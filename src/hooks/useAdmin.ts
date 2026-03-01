import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product, Order, ROUTE_PATHS } from "@/lib";

const ADMIN_ACCESS_KEY = "suzi1234";
const ADMIN_SESSION_KEY = "sunshine_admin_session";

interface AdminSession {
  isAuthenticated: boolean;
  loginTime: number;
}

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(ADMIN_SESSION_KEY);
    if (session) {
      try {
        const parsed: AdminSession = JSON.parse(session);
        const now = Date.now();
        const sessionAge = now - parsed.loginTime;
        const maxAge = 24 * 60 * 60 * 1000;

        if (parsed.isAuthenticated && sessionAge < maxAge) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY);
        }
      } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (accessKey: string): boolean => {
    if (accessKey === ADMIN_ACCESS_KEY) {
      const session: AdminSession = {
        isAuthenticated: true,
        loginTime: Date.now(),
      };
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    navigate(ROUTE_PATHS.HOME);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
};

export const useAdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const stored = localStorage.getItem("sunshine_products");
      if (stored) {
        setProducts(JSON.parse(stored));
      }
    } catch (err) {
      setError("Ürünler yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("sunshine_products", JSON.stringify(updated));
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>): boolean => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const updated = [...products];
    updated[index] = {
      ...updated[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setProducts(updated);
    localStorage.setItem("sunshine_products", JSON.stringify(updated));
    return true;
  };

  const deleteProduct = (id: string): boolean => {
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;

    setProducts(filtered);
    localStorage.setItem("sunshine_products", JSON.stringify(filtered));
    return true;
  };

  return {
    products,
    isLoading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts,
  };
};

export const useAdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    try {
      const stored = localStorage.getItem("sunshine_orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        setOrders(parsed.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      }
    } catch (err) {
      setError("Siparişler yüklenirken hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = (
    orderId: string,
    orderStatus: Order["orderStatus"]
  ): boolean => {
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return false;

    const updated = [...orders];
    updated[index] = {
      ...updated[index],
      orderStatus,
      updatedAt: new Date().toISOString(),
    };

    setOrders(updated);
    localStorage.setItem("sunshine_orders", JSON.stringify(updated));
    return true;
  };

  const updatePaymentStatus = (
    orderId: string,
    paymentStatus: Order["paymentStatus"]
  ): boolean => {
    const index = orders.findIndex((o) => o.id === orderId);
    if (index === -1) return false;

    const updated = [...orders];
    updated[index] = {
      ...updated[index],
      paymentStatus,
      updatedAt: new Date().toISOString(),
    };

    setOrders(updated);
    localStorage.setItem("sunshine_orders", JSON.stringify(updated));
    return true;
  };

  const deleteOrder = (orderId: string): boolean => {
    const filtered = orders.filter((o) => o.id !== orderId);
    if (filtered.length === orders.length) return false;

    setOrders(filtered);
    localStorage.setItem("sunshine_orders", JSON.stringify(filtered));
    return true;
  };

  return {
    orders,
    isLoading,
    error,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    refreshOrders: loadOrders,
  };
};