import { revalidateTag, revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { tag, path, secret } = body;

    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ message: "Невірний токен доступу" }, { status: 401 });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag, timestamp: Date.now() });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, timestamp: Date.now() });
    }

    return NextResponse.json(
      { message: "Необхідно вказати параметр tag або path" },
      { status: 400 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Помилка інвалідації кешу", error: error.message },
      { status: 500 },
    );
  }
}

