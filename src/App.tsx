import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ROUTE_PATHS } from "@/lib/index";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Services from "@/pages/Services";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Admin from "@/pages/Admin";
import DeveloperMode from "@/pages/DeveloperMode";
import SEOPages from "@/pages/SEOPages";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MotionConfig reducedMotion="user">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path={ROUTE_PATHS.HOME} element={<Home />} />
              <Route path={ROUTE_PATHS.PRODUCTS} element={<Products />} />
              <Route path={ROUTE_PATHS.PRODUCT_DETAIL} element={<ProductDetail />} />
              <Route path={ROUTE_PATHS.CART} element={<Cart />} />
              <Route path={ROUTE_PATHS.CHECKOUT} element={<Checkout />} />
              <Route path={ROUTE_PATHS.SERVICES} element={<Services />} />
              <Route path={ROUTE_PATHS.ABOUT} element={<About />} />
              <Route path={ROUTE_PATHS.CONTACT} element={<Contact />} />
              <Route path={ROUTE_PATHS.ADMIN} element={<Admin />} />
              <Route path="/developer" element={<DeveloperMode />} />
              <Route path={ROUTE_PATHS.SEO} element={<SEOPages />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MotionConfig>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
