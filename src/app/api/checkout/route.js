import { Resend } from "resend";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { formData, carrier, deliveryDetails, paymentMethod, cart } = body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return Response.json(
        { success: false, error: "Кошик порожній." },
        { status: 400 },
      );
    }

    // Отримуємо унікальні ID товарів для перевірки в базі даних
    const itemIds = [...new Set(cart.map((item) => item?.id).filter(Boolean))];

    if (itemIds.length === 0) {
      return Response.json(
        { success: false, error: "Некоректні дані товарів у кошику." },
        { status: 400 },
      );
    }

    // Отримуємо актуальні дані товарів напряму з БД
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: itemIds } },
      select: {
        id: true,
        title: true,
        price: true,
      },
    });

    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Перевіряємо, чи всі товари існують у базі
    const missingItems = cart.filter((item) => !dbProductMap.has(item.id));
    if (missingItems.length > 0) {
      return Response.json(
        {
          success: false,
          error:
            "Деякі товари з вашого кошика більше недоступні в магазині. Будь ласка, оновіть кошик.",
        },
        { status: 400 },
      );
    }

    // Розрахунок реальної суми на сервері з актуальних цін БД
    let serverTotal = 0;
    const verifiedItems = cart.map((item) => {
      const dbProduct = dbProductMap.get(item.id);
      const price = Number(dbProduct.price || 0);
      serverTotal += price;

      return {
        id: dbProduct.id,
        title: dbProduct.title,
        price,
        size: item.size || "—",
      };
    });

    // Формування інформації про доставку
    let deliveryHtml = "";
    if (carrier === "nova") {
      const deliveryType =
        deliveryDetails?.deliveryType === "postomat"
          ? "Поштомат"
          : "Відділення";
      deliveryHtml = `
        <p><strong>Служба доставки:</strong> Нова пошта (${deliveryType})</p>
        <p><strong>Місто:</strong> ${deliveryDetails?.city || "—"}</p>
        <p><strong>Відділення / Поштомат:</strong> ${deliveryDetails?.branch || "—"}</p>
      `;
    } else {
      deliveryHtml = `
        <p><strong>Служба доставки:</strong> Укрпошта</p>
        <p><strong>Поштовий індекс:</strong> ${deliveryDetails?.postIndex || "—"}</p>
        <p><strong>Область:</strong> ${deliveryDetails?.region || "—"}</p>
        <p><strong>Місто:</strong> ${deliveryDetails?.city || "—"}</p>
        <p><strong>Адреса:</strong> вул. ${deliveryDetails?.street || "—"}, буд. ${deliveryDetails?.house || "—"}${deliveryDetails?.apartment ? `, кв. ${deliveryDetails.apartment}` : ""}</p>
      `;
    }

    const itemsHtml = verifiedItems
      .map(
        (item) => `<li>${item.title} (${item.size}) — ${item.price} грн</li>`,
      )
      .join("");

    const recipientEmail =
      process.env.EMAIL_TO || "bilocerkivska.a2na@gmail.com";

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: recipientEmail,
      subject: `🛍️ Замовлення від ${formData?.firstName || ""} ${formData?.lastName || ""}`,
      html: `
        <h2>Нове замовлення!</h2>
        <p><strong>Клієнт:</strong> ${formData?.lastName || ""} ${formData?.firstName || ""} ${formData?.middleName || ""}</p>
        <p><strong>Телефон:</strong> ${formData?.phone || "—"}</p>
        ${deliveryHtml}
        <p><strong>Оплата:</strong> ${paymentMethod || "—"}</p>
        <h3>Товари (верифіковано з бази даних):</h3>
        <ul>${itemsHtml}</ul>
        <h3>Сума замовлення: ${serverTotal} грн</h3>
      `,
    });

    return Response.json({ success: true, total: serverTotal });
  } catch (error) {
    console.error("Помилка обробки замовлення:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
