import { useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useProducts, useCategories, useTireSizes } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { VehicleFilter } from "@/components/VehicleFilter";
import { VehicleFilters, SEASONS } from "@/lib/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("none");
  const [brandFilter, setBrandFilter] = useState<string>("none");
  const [seasonFilter, setSeasonFilter] = useState<string>("none");
  const [tireSizeFilter, setTireSizeFilter] = useState<string>("none");
  const [priceRange, setPriceRange] = useState<{
    min?: number;
    max?: number;
  }>({});
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilters>({});
  const [showVehicleFilter, setShowVehicleFilter] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: tireSizes, isLoading: tireSizesLoading } = useTireSizes();
  const { data: products, isLoading: productsLoading } = useProducts({
    category: categoryFilter === "none" ? undefined : categoryFilter,
    brand: brandFilter === "none" ? undefined : brandFilter,
    season: seasonFilter === "none" ? undefined : seasonFilter,
    tireSize: tireSizeFilter === "none" ? undefined : tireSizeFilter,
    minPrice: priceRange.min,
    maxPrice: priceRange.max,
    search: searchQuery || undefined,
  });

  // Türkiye'de popüler lastik markaları
  const popularBrands = [
    "Continental", "Michelin", "Bridgestone", "Pirelli", "Goodyear",
    "Hankook", "Lassa", "Petlas", "Yokohama", "Falken", "Nexen", "Kumho"
  ];

  const handleVehicleFilterChange = (filters: VehicleFilters) => {
    setVehicleFilters(filters);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("none");
    setBrandFilter("none");
    setSeasonFilter("none");
    setTireSizeFilter("none");
    setPriceRange({});
    setVehicleFilters({});
  };

  const hasActiveFilters =
    searchQuery ||
    categoryFilter !== "none" ||
    brandFilter !== "none" ||
    seasonFilter !== "none" ||
    tireSizeFilter !== "none" ||
    priceRange.min !== undefined ||
    priceRange.max !== undefined ||
    Object.keys(vehicleFilters).length > 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-transparent to-transparent py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ürünlerimiz
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dünya markalarından lastik, jant ve akü ürünlerini keşfedin
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Select
                  value={categoryFilter}
                  onValueChange={(value) => setCategoryFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tüm Kategoriler</SelectItem>
                    <SelectItem value="lastikler">Lastikler</SelectItem>
                    <SelectItem value="jantlar">Jantlar</SelectItem>
                    <SelectItem value="akuler">Aküler</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={brandFilter}
                  onValueChange={(value) => setBrandFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Marka" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tüm Markalar</SelectItem>
                    {popularBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={seasonFilter}
                  onValueChange={(value) => setSeasonFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Mevsim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tüm Mevsimler</SelectItem>
                    <SelectItem value="Yaz">Yaz Lastik</SelectItem>
                    <SelectItem value="Kış">Kış Lastik</SelectItem>
                    <SelectItem value="4 Mevsim">4 Mevsim</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={tireSizeFilter}
                  onValueChange={(value) => setTireSizeFilter(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Lastik Ebatı" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Tüm Ebatlar</SelectItem>
                    {tireSizes?.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Sheet open={showVehicleFilter} onOpenChange={setShowVehicleFilter}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Araç Filtresi
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md">
                    <SheetHeader>
                      <SheetTitle>Aracınıza Göre Filtrele</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <VehicleFilter
                        onFilterChange={handleVehicleFilterChange}
                        className=""
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Temizle
                  </Button>
                )}
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Arama: {searchQuery}
                    <button
                      onClick={() => setSearchQuery("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {categoryFilter !== "none" && (
                  <Badge variant="secondary" className="gap-1">
                    Kategori: {categoryFilter}
                    <button
                      onClick={() => setCategoryFilter("none")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {brandFilter !== "none" && (
                  <Badge variant="secondary" className="gap-1">
                    Marka: {brandFilter}
                    <button
                      onClick={() => setBrandFilter("none")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {seasonFilter !== "none" && (
                  <Badge variant="secondary" className="gap-1">
                    Mevsim: {SEASONS[seasonFilter as keyof typeof SEASONS]}
                    <button
                      onClick={() => setSeasonFilter("none")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {tireSizeFilter !== "none" && (
                  <Badge variant="secondary" className="gap-1">
                    Ebat: {tireSizeFilter}
                    <button
                      onClick={() => setTireSizeFilter("none")}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {productsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">
                Ürün Bulunamadı
              </h3>
              <p className="text-muted-foreground mb-6">
                Aradığınız kriterlere uygun ürün bulunamadı. Lütfen farklı
                filtreler deneyin.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {!categoriesLoading && categories && categories.length > 0 && (
        <div className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold mb-4">Kategoriler</h2>
              <p className="text-muted-foreground">
                İhtiyacınıza uygun kategoriyi seçin
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCategoryFilter(category.slug);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-card rounded-2xl p-6 text-left shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {category.description}
                  </p>
                  <Badge variant="secondary">
                    {category.productCount} Ürün
                  </Badge>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
