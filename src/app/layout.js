import "./globals.css";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { getHeaderCategories } from "@/lib/categoryQueries";
import { CartUIProvider } from "@/lib/CartUIContext";
import CartContainer from "../components/Cart/CartContainer";


export const metadata = {
  title: "Cenehanna Shop",
  description: "Clothing, accessories and home essentials store",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }) {
  const categories = await getHeaderCategories();

  return (
    <html lang="uk" data-scroll-behavior="smooth">
      <body>
        <CartUIProvider>
          <Header CATEGORIES={categories} />
          <main>{children}</main>
          <Footer />
          <CartContainer />
        </CartUIProvider>
      </body>
    </html>
  );
}
