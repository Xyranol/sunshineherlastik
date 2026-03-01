import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { formatPrice, ROUTE_PATHS } from "@/lib/index";
import { springPresets } from "@/lib/motion";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={springPresets.gentle}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <ShoppingCart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Sepetim</h2>
                  <p className="text-sm text-muted-foreground">
                    {totalItems} ürün
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Sepetiniz Boş
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Henüz sepetinize ürün eklemediniz
                </p>
                <Button
                  onClick={onClose}
                  asChild
                  className="bg-primary hover:bg-primary/90"
                >
                  <Link to={ROUTE_PATHS.PRODUCTS}>Alışverişe Başla</Link>
                </Button>
              </div>
            ) : (
              <>
                <ScrollArea className="flex-1 p-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={springPresets.snappy}
                        className="flex gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-border transition-colors"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm mb-1 truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.product.brand}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 rounded-md"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                                disabled={item.quantity >= item.product.stock}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeItem(item.product.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            {item.product.oldPrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(item.product.oldPrice * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="border-t border-border p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Ara Toplam</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">KDV</span>
                      <span className="font-medium">
                        {formatPrice(totalPrice * 0.2)}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-foreground">Toplam</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(totalPrice * 1.2)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={onClose}
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      size="lg"
                    >
                      <Link to={ROUTE_PATHS.CHECKOUT}>Ödemeye Geç</Link>
                    </Button>
                    <Button
                      onClick={onClose}
                      asChild
                      variant="outline"
                      className="w-full"
                      size="lg"
                    >
                      <Link to={ROUTE_PATHS.CART}>Sepeti Görüntüle</Link>
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground">
                    Kargo ücreti ödeme sayfasında hesaplanacaktır
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}