import { useState, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleFilters } from "@/lib/index";
import {
  useVehicleBrands,
  useVehicleModels,
} from "@/hooks/useProducts";
import { springPresets } from "@/lib/motion";

interface VehicleFilterProps {
  onFilterChange: (filters: VehicleFilters) => void;
  className?: string;
}

export function VehicleFilter({
  onFilterChange,
  className = "",
}: VehicleFilterProps) {
  const [brandId, setBrandId] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [tireSize, setTireSize] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: brands = [], isLoading: brandsLoading } = useVehicleBrands();
  const { data: models = [], isLoading: modelsLoading } =
    useVehicleModels(brandId);

  const selectedBrand = brands.find((b) => b.id === brandId);
  const selectedModel = models.find((m) => m.id === modelId);

  const availableYears =
    selectedModel?.years.sort((a, b) => b - a) || [];
  const availableTireSizes =
    selectedModel?.tireSpecs.map(
      (spec) => `${spec.width}/${spec.aspectRatio}R${spec.diameter}`
    ) || [];

  useEffect(() => {
    setModelId("");
    setYear(undefined);
    setTireSize("");
  }, [brandId]);

  useEffect(() => {
    setYear(undefined);
    setTireSize("");
  }, [modelId]);

  const handleSearch = () => {
    const filters: VehicleFilters = {};

    if (brandId) filters.brandId = brandId;
    if (modelId) filters.modelId = modelId;
    if (year) filters.year = year;
    if (tireSize) filters.tireSize = tireSize;

    onFilterChange(filters);
  };

  const handleReset = () => {
    setBrandId("");
    setModelId("");
    setYear(undefined);
    setTireSize("");
    onFilterChange({});
  };

  const hasActiveFilters = brandId || modelId || year || tireSize;

  return (
    <Card
      className={`p-6 bg-gradient-to-br from-card via-card to-accent/5 border-border/50 shadow-lg ${className}`}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Aracınıza Uygun Lastik Bulun
              </h3>
              <p className="text-sm text-muted-foreground">
                Marka, model ve yıl seçerek uyumlu lastikleri görün
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <ChevronDown
              className={`w-5 h-5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        <AnimatePresence>
          {(isExpanded || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={springPresets.gentle}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Marka
                  </label>
                  <Select
                    value={brandId || "none"}
                    onValueChange={(value) =>
                      setBrandId(value === "none" ? "" : value)
                    }
                    disabled={brandsLoading}
                  >
                    <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Marka Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Marka Seçin</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Model
                  </label>
                  <Select
                    value={modelId || "none"}
                    onValueChange={(value) =>
                      setModelId(value === "none" ? "" : value)
                    }
                    disabled={!brandId || modelsLoading}
                  >
                    <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Model Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Model Seçin</SelectItem>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Yıl
                  </label>
                  <Select
                    value={year?.toString() || "none"}
                    onValueChange={(value) =>
                      setYear(value === "none" ? undefined : parseInt(value))
                    }
                    disabled={!modelId || availableYears.length === 0}
                  >
                    <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Yıl Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Yıl Seçin</SelectItem>
                      {availableYears.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Lastik Ebadı
                  </label>
                  <Select
                    value={tireSize || "none"}
                    onValueChange={(value) =>
                      setTireSize(value === "none" ? "" : value)
                    }
                    disabled={!modelId || availableTireSizes.length === 0}
                  >
                    <SelectTrigger className="bg-background border-border hover:border-primary/50 transition-colors">
                      <SelectValue placeholder="Ebat Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ebat Seçin</SelectItem>
                      {availableTireSizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <Button
                  onClick={handleSearch}
                  disabled={!brandId && !modelId && !year && !tireSize}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Lastik Ara
                </Button>

                {hasActiveFilters && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="border-border hover:bg-muted transition-all duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Filtreleri Temizle
                  </Button>
                )}

                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2 ml-auto">
                    {selectedBrand && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {selectedBrand.name}
                      </Badge>
                    )}
                    {selectedModel && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {selectedModel.name}
                      </Badge>
                    )}
                    {year && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {year}
                      </Badge>
                    )}
                    {tireSize && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        {tireSize}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
