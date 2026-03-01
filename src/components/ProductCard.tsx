import { motion } from "framer-motion";
import { ShoppingCart, Star, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { formatPrice, ROUTE_PATHS, SEASONS, type Product } from "@/lib/index";
import { IMAGES } from "@/assets/images";
import { cn } from "@/lib/utils";
import { springPresets, hoverLift } from "@/lib/motion";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const getProductImage = (product: Product) => {
  // Eğer ürünün kendi görseli varsa onu kullan
  if (product.images && product.images.length > 0) {
    const img = product.images[0];
    return img.startsWith('/') ? img : `/images/${img}`;
  }
  
  // Kategoriye göre varsayılan görsel seç
  const tireImages = [
    IMAGES.TIRE_WHITE_BG_1, IMAGES.TIRE_WHITE_BG_2, IMAGES.TIRE_WHITE_BG_3,
    IMAGES.TIRE_WHITE_BG_4, IMAGES.TIRE_WHITE_BG_5, IMAGES.TIRE_WHITE_BG_6,
    IMAGES.TIRE_PRODUCT_1, IMAGES.TIRE_PRODUCT_2, IMAGES.TIRE_PRODUCT_3
  ];
  
  const rimImages = [
    IMAGES.WHEEL_RIM_1, IMAGES.WHEEL_RIM_2, IMAGES.WHEEL_RIM_3,
    IMAGES.WHEEL_RIM_4, IMAGES.WHEEL_RIM_5
  ];
  
  const batteryImages = [
    IMAGES.CAR_BATTERY_1, IMAGES.CAR_BATTERY_2, IMAGES.CAR_BATTERY_3,
    IMAGES.CAR_BATTERY_4, IMAGES.CAR_BATTERY_5
  ];
  
  // Ürün ID'sine göre rastgele ama tutarlı görsel seç
  const productId = typeof product.id === 'string' ? product.id : String(product.id);
  const hash = productId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  if (product.category === 'lastik') {
    return tireImages[Math.abs(hash) % tireImages.length];
  } else if (product.category === 'jant') {
    return rimImages[Math.abs(hash) % rimImages.length];
  } else if (product.category === 'aku') {
    return batteryImages[Math.abs(hash) % batteryImages.length];
  }
  
  return IMAGES.TIRE_WHITE_BG_1;
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  const discountPercentage = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const getCategoryBadgeColor = () => {
    switch (product.category) {
      case "lastik":
        return "bg-primary/10 text-primary border-primary/20";
      case "jant":
        return "bg-accent/10 text-accent-foreground border-accent/20";
      case "aku":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryName = () => {
    switch (product.category) {
      case "lastik":
        return "Lastik";
      case "jant":
        return "Jant";
      case "aku":
        return "Akü";
      default:
        return product.category;
    }
  };

  return (
    <motion.div
      variants={hoverLift}
      initial="rest"
      whileHover="hover"
      className={cn("h-full", className)}
    >
      <Link to={`/urun/${product.id}`} className="block h-full">
        <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-200">
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            <img
              src={getProductImage(product)}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = IMAGES.TIRE_WHITE_BG_1;
              }}
            />
            
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "font-medium shadow-sm backdrop-blur-sm",
                  getCategoryBadgeColor()
                )}
              >
                {getCategoryName()}
              </Badge>
              
              {product.featured && (
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground shadow-sm backdrop-blur-sm"
                >
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  Öne Çıkan
                </Badge>
              )}
              
              {product.specifications.season && product.category === "lastik" && (
                <Badge
                  variant="outline"
                  className="bg-background/80 backdrop-blur-sm shadow-sm"
                >
                  {SEASONS[product.specifications.season]}
                </Badge>
              )}
            </div>

            {discountPercentage > 0 && (
              <div className="absolute top-3 right-3">
                <Badge
                  variant="destructive"
                  className="shadow-sm backdrop-blur-sm"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  %{discountPercentage} İndirim
                </Badge>
              </div>
            )}

            {product.stock <= 5 && product.stock > 0 && (
              <div className="absolute bottom-3 left-3">
                <Badge
                  variant="outline"
                  className="bg-destructive/10 text-destructive border-destructive/20 backdrop-blur-sm shadow-sm"
                >
                  Son {product.stock} Adet
                </Badge>
              </div>
            )}

            {product.stock === 0 && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                <Badge variant="destructive" className="text-base px-4 py-2">
                  Stokta Yok
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="flex-1 p-4 space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-medium">
                {product.brand}
              </p>
              <h3 className="font-semibold text-base line-clamp-2 leading-tight">
                {product.name}
              </h3>
            </div>

            {product.category === "lastik" && product.specifications.width && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono font-medium">
                  {product.specifications.width}/{product.specifications.aspectRatio} R{product.specifications.diameter}
                </span>
                {product.specifications.loadIndex && product.specifications.speedRating && (
                  <span className="font-mono">
                    {product.specifications.loadIndex}{product.specifications.speedRating}
                  </span>
                )}
              </div>
            )}

            {product.category === "jant" && product.specifications.size && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Boyut:</span> {product.specifications.size}
              </div>
            )}

            {product.category === "aku" && product.specifications.capacity && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Kapasite:</span> {product.specifications.capacity}
              </div>
            )}

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full"
              size="lg"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
