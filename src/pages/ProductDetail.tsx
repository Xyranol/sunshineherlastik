import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Check, Truck, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatPrice, ROUTE_PATHS, SEASONS, type Product } from "@/lib/index";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";



export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products_2026_03_01_14_16")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Product;
    },
    enabled: !!id,
  });

  const handleAddToCart = () => {
    if (!product) return;

    addItem(product, quantity);
    toast({
      title: "Sepete Eklendi",
      description: `${product.name} sepetinize eklendi.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-foreground">Ürün Bulunamadı</h1>
        <Button onClick={() => navigate(ROUTE_PATHS.PRODUCTS)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ürünlere Dön
        </Button>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.startsWith('/') ? img : `/images/${img}`)
    : [product.image || '/images/placeholder.jpg'];
  const hasDiscount = product.oldPrice && product.oldPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate(ROUTE_PATHS.PRODUCTS)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Ürünlere Dön
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="sticky top-24">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-square relative bg-muted">
                    <img
                      src={images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {hasDiscount && (
                      <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
                        -{discountPercent}%
                      </Badge>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <Badge variant="destructive" className="text-lg px-6 py-2">
                          Stokta Yok
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.brand}</Badge>
                {product.category === "lastik" && product.specifications.season && (
                  <Badge variant="outline">
                    {SEASONS[product.specifications.season]}
                  </Badge>
                )}
                {product.specifications.runFlat && (
                  <Badge variant="outline">Run Flat</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (4.8 - 127 değerlendirme)
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.oldPrice!)}
                  </span>
                )}
              </div>

              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="destructive" className="mb-4">
                  Son {product.stock} adet!
                </Badge>
              )}

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Sepete Ekle
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">Ücretsiz Kargo</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">Güvenli Ödeme</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Check className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xs text-muted-foreground">Orijinal Ürün</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Ürün Açıklaması</h2>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Teknik Özellikler</h2>
              <div className="grid grid-cols-2 gap-4">
                {product.category === "lastik" && (
                  <>
                    {product.specifications.width && (
                      <div>
                        <p className="text-sm text-muted-foreground">Genişlik</p>
                        <p className="font-semibold">{product.specifications.width} mm</p>
                      </div>
                    )}
                    {product.specifications.aspectRatio && (
                      <div>
                        <p className="text-sm text-muted-foreground">Yanak Oranı</p>
                        <p className="font-semibold">{product.specifications.aspectRatio}%</p>
                      </div>
                    )}
                    {product.specifications.diameter && (
                      <div>
                        <p className="text-sm text-muted-foreground">Jant Çapı</p>
                        <p className="font-semibold">{product.specifications.diameter}"</p>
                      </div>
                    )}
                    {product.specifications.loadIndex && (
                      <div>
                        <p className="text-sm text-muted-foreground">Yük İndeksi</p>
                        <p className="font-semibold">{product.specifications.loadIndex}</p>
                      </div>
                    )}
                    {product.specifications.speedRating && (
                      <div>
                        <p className="text-sm text-muted-foreground">Hız Sembolü</p>
                        <p className="font-semibold">{product.specifications.speedRating}</p>
                      </div>
                    )}
                  </>
                )}

                {product.category === "jant" && (
                  <>
                    {product.specifications.size && (
                      <div>
                        <p className="text-sm text-muted-foreground">Boyut</p>
                        <p className="font-semibold">{product.specifications.size}</p>
                      </div>
                    )}
                    {product.specifications.material && (
                      <div>
                        <p className="text-sm text-muted-foreground">Malzeme</p>
                        <p className="font-semibold">{product.specifications.material}</p>
                      </div>
                    )}
                    {product.specifications.finish && (
                      <div>
                        <p className="text-sm text-muted-foreground">Kaplama</p>
                        <p className="font-semibold">{product.specifications.finish}</p>
                      </div>
                    )}
                  </>
                )}

                {product.category === "aku" && (
                  <>
                    {product.specifications.capacity && (
                      <div>
                        <p className="text-sm text-muted-foreground">Kapasite</p>
                        <p className="font-semibold">{product.specifications.capacity} Ah</p>
                      </div>
                    )}
                    {product.specifications.voltage && (
                      <div>
                        <p className="text-sm text-muted-foreground">Voltaj</p>
                        <p className="font-semibold">{product.specifications.voltage} V</p>
                      </div>
                    )}
                    {product.specifications.warranty && (
                      <div>
                        <p className="text-sm text-muted-foreground">Garanti</p>
                        <p className="font-semibold">{product.specifications.warranty}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <Card className="bg-accent/50">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Montaj Hizmeti</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Çorlu Tekirdağ'daki mağazamızda profesyonel montaj hizmeti sunuyoruz.
                  Randevu için bizi arayın.
                </p>
                <Link to={ROUTE_PATHS.CONTACT}>
                  <Button variant="outline" className="w-full">
                    İletişime Geç
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
