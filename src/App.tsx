import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import CatalogPage from "./pages/CatalogPage";
import FAQPage from "./pages/FAQPage";
import TestimoniosPage from "./pages/TestimoniosPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />oka
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/testimonios" element={<TestimoniosPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}