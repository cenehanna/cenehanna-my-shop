import Categories from "@/components/Categories/Categories";
import Hero from "@/components/Hero/Hero";
import NewArrivals from "@/components/NewArrivals/NewArrivals";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import Accordion from "@/components/Accordion/Accordion";
import { getHomeNewArrivals } from "@/lib/productQueries";
import { getFeaturedCategoriesWithImages } from "@/lib/categoryQueries";

const FAQ_ITEMS = [
  {
    id: 1,
    title: "How do I place an order?",
    content:
      "Pick your favorite pieces, choose your size and color, and add them to your cart. At checkout, enter your delivery details, select a payment method, and confirm. That's it, your new look is on its way.",
  },
  {
    id: 2,
    title: "How fast will my order arrive?",
    content:
      "We ship across Ukraine via Nova Poshta (to a branch, parcel locker, or by courier) and Ukrposhta. Most orders arrive within 1–3 business days. Spend over 2,000 UAH and delivery is on us.",
  },
  {
    id: 3,
    title: "How can I pay?",
    content:
      "Pay online with Visa or Mastercard, Apple Pay, or Google Pay. Prefer to try first? Choose cash on delivery and pay when you pick up your order. Installment options are available too.",
  },
  {
    id: 4,
    title: "What if it doesn't fit or I change my mind?",
    content:
      "No worries. You can return or exchange any item within 14 days of receiving it. Just make sure it's unworn, with all tags attached and in its original packaging.",
  },
  {
    id: 5,
    title: "How do I find my perfect size?",
    content:
      "Check the size details on each product page and compare them with your measurements. Between two sizes? Go for the one that matches how you like your fit: relaxed or true to size.",
  },
  {
    id: 6,
    title: "How should I care for my pieces?",
    content:
      "Care instructions are on the label of every item and in the product description. Following them keeps fabrics, colors, and shape looking fresh season after season.",
  },
  {
    id: 7,
    title: "Is everything in the catalog available right now?",
    content:
      "Yes. Every piece you see on the site is in stock and ready to ship, and availability updates in real time. New arrivals land regularly, so check back often.",
  },
];

export default async function Home() {
  const [products, categories] = await Promise.all([
    getHomeNewArrivals(),
    getFeaturedCategoriesWithImages(5),
  ]);

  return (
    <div className="pageSections">
      <Hero />
      <Categories categories={categories} />
      <NewArrivals products={products} />

      <ProductCarousel title="Recently viewed items" />

      <section className="content" id="faq">
        <h2 className="main-headings">Frequently Asked Questions</h2>
        {FAQ_ITEMS.map((item) => (
          <Accordion key={item.id} title={item.title}>
            <p>{item.content}</p>
          </Accordion>
        ))}
      </section>
    </div>
  );
}
