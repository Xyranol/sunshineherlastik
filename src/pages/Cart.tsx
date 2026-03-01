import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, ROUTE_PATHS } from '@/lib/index';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { springPresets, fadeInUp, staggerContainer, staggerItem } from '@/lib/motion';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  const shippingCost = totalPrice > 1000 ? 0 : 50;
  const finalTotal = totalPrice + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4">Sepetiniz Boş</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Henüz sepetinize ürün eklemediniz. Ürünlerimize göz atmak için alışverişe başlayın.
            </p>
            <Button
              size="lg"
              onClick={() => navigate(ROUTE_PATHS.PRODUCTS)}
              className="gap-2"
            >
              Alışverişe Başla
              <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.gentle}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Sepetim</h1>
          <p className="text-lg text-muted-foreground">
            {totalItems} ürün sepetinizde
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-4"
          >
            {items.map((item) => (
              <motion.div key={item.product.id} variants={staggerItem}>
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                            {item.product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.brand}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.product.specifications.width && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted">
                            {item.product.specifications.width}/{item.product.specifications.aspectRatio} R{item.product.specifications.diameter}
                          </span>
                        )}
                        {item.product.specifications.season && (
                          <span className="text-xs px-2 py-1 rounded-full bg-muted capitalize">
                            {item.product.specifications.season}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="h-9 w-9"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="h-9 w-9"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-bold text-xl text-primary">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatPrice(item.product.price)} / adet
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={springPresets.gentle}
            className="lg:col-span-1"
          >
            <Card className="p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Sipariş Özeti</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span className="font-semibold">{formatPrice(totalPrice)}</span>
                </div>

                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Ücretsiz</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {totalPrice < 1000 && (
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {formatPrice(1000 - totalPrice)} değerinde daha ürün ekleyin, kargo ücretsiz olsun!
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg">
                  <span className="font-bold">Toplam</span>
                  <span className="font-bold text-2xl text-primary">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full gap-2 mb-4"
                onClick={() => navigate(ROUTE_PATHS.CHECKOUT)}
              >
                Ödemeye Geç
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate(ROUTE_PATHS.PRODUCTS)}
              >
                Alışverişe Devam Et
              </Button>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Güvenli ödeme</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Hızlı teslimat</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Kolay iade</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
