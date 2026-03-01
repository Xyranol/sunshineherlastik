import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Product,
  Category,
  VehicleBrand,
  VehicleModel,
  VehicleFilters,
} from "@/lib/index";

export const useProducts = (filters?: {
  category?: string;
  brand?: string;
  season?: string;
  tireSize?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      let query = supabase.from("products_2026_03_01_14_16").select("*");

      // Kategori filtreleme için önce kategori ID'sini bulalım
      if (filters?.category) {
        const { data: categoryData } = await supabase
          .from("categories_2026_03_01_14_16")
          .select("id")
          .eq("slug", filters.category)
          .single();
        
        if (categoryData) {
          query = query.eq("category_id", categoryData.id);
        }
      }

      if (filters?.brand) {
        query = query.eq("brand", filters.brand);
      }

      if (filters?.season) {
        query = query.eq("tire_season", filters.season);
      }

      if (filters?.tireSize) {
        query = query.eq("tire_size", filters.tireSize);
      }

      if (filters?.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters?.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      query = query.eq("is_active", true);

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Products query error:", error);
        return [];
      }
      return (data || []) as Product[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories_2026_03_01_14_16")
        .select("*")
        .order("name");

      if (error) {
        console.error("Categories query error:", error);
        return [];
      }
      return (data || []) as Category[];
    },
  });
};

export const useVehicleBrands = () => {
  return useQuery({
    queryKey: ["vehicle-brands"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicle_brands_2026_03_01_14_16")
        .select("*")
        .order("name");

      if (error) {
        console.error("Vehicle brands query error:", error);
        return [];
      }
      return (data || []) as VehicleBrand[];
    },
  });
};

export const useVehicleModels = (brandId?: string) => {
  return useQuery({
    queryKey: ["vehicle-models", brandId],
    queryFn: async () => {
      if (!brandId) return [];
      
      let query = supabase.from("vehicle_models_2026_03_01_14_16").select("*");
      query = query.eq("brand_id", brandId);

      const { data, error } = await query.order("name");

      if (error) {
        console.error("Vehicle models query error:", error);
        return [];
      }
      return (data || []) as VehicleModel[];
    },
    enabled: !!brandId,
  });
};

export const useProductsByVehicle = (filters: VehicleFilters) => {
  return useQuery({
    queryKey: ["products-by-vehicle", filters],
    queryFn: async () => {
      if (!filters.brandId || !filters.modelId || !filters.year) {
        return [];
      }

      // Get compatible tire sizes for the vehicle
      const { data: compatibilityData, error: compatibilityError } = await supabase
        .from("vehicle_tire_compatibility_2026_03_01_14_16")
        .select("tire_size")
        .eq("vehicle_model_id", filters.modelId);

      if (compatibilityError) {
        console.error("Compatibility query error:", compatibilityError);
        return [];
      }

      let tireSizes: string[] = [];
      if (filters.tireSize) {
        tireSizes = [filters.tireSize];
      } else if (compatibilityData && compatibilityData.length > 0) {
        tireSizes = compatibilityData.map((item) => item.tire_size);
      }

      if (tireSizes.length === 0) {
        return [];
      }

      const { data: products, error: productsError } = await supabase
        .from("products_2026_03_01_14_16")
        .select("*")
        .in("tire_size", tireSizes)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (productsError) {
        console.error("Products by vehicle query error:", productsError);
        return [];
      }
      return (products || []) as Product[];
    },
    enabled:
      !!filters.brandId && !!filters.modelId && filters.year !== undefined,
  });
};

export const useTireSizes = () => {
  return useQuery({
    queryKey: ["tire-sizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products_2026_03_01_14_16")
        .select("tire_size")
        .not("tire_size", "is", null)
        .order("tire_size");

      if (error) {
        console.error("Tire sizes query error:", error);
        return [];
      }
      
      // Benzersiz ebatları al ve sırala
      const uniqueSizes = [...new Set(data?.map(item => item.tire_size).filter(Boolean))];
      return uniqueSizes.sort();
    },
  });
};