import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import CatalogPage from "./pages/CatalogPage";
import FAQPage from "./pages/FAQPage";
import TestimoniosPage from "./pages/TestimoniosPage";
import ContactPage from "./pages/ContactPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import GalleryPage from "./pages/GalleryPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/nosotros" element={<AboutPage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/catalogo" element={<CatalogPage />} />
            <Route path="/catalogo/:slug" element={<ProductDetailPage />} />
            <Route path="/carrito" element={<CartPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/testimonios" element={<TestimoniosPage />} />
            <Route path="/contacto" element={<ContactPage />} />
            <Route path="/galeria" element={<GalleryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
