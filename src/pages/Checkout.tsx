import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, Building2, CheckCircle2, ShoppingBag, MapPin, Phone, Mail, User, FileText } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, generateOrderNumber, ROUTE_PATHS, PAYMENT_METHODS, type Order } from '@/lib/index';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { springPresets } from '@/lib/motion';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'kapida-odeme' | 'havale-eft' | 'stripe'>('kapida-odeme');

  const totalAmount = getTotalPrice();
  const shippingCost = totalAmount > 1000 ? 0 : 50;
  const finalTotal = totalAmount + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const newOrderNumber = generateOrderNumber();
      setOrderNumber(newOrderNumber);

      // Siparişi Supabase'e kaydet
      const orderData = {
        order_number: newOrderNumber,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        customer_address: formData.address,
        payment_method: paymentMethod,
        payment_status: 'beklemede',
        order_status: 'yeni',
        total_amount: finalTotal,
        notes: formData.notes || null
      };

      const { data: orderResult, error: orderError } = await supabase
        .from('orders_2026_03_01_14_16')
        .insert([orderData])
        .select()
        .single();

      if (orderError) {
        console.error('Sipariş kaydetme hatası:', orderError);
        throw orderError;
      }

      // Sipariş ürünlerini kaydet
      const orderItems = items.map(item => ({
        order_id: orderResult.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_brand: item.product.brand,
        unit_price: item.product.price,
        quantity: item.quantity,
        total_price: item.product.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items_2026_03_01_14_16')
        .insert(orderItems);

      if (itemsError) {
        console.error('Sipariş ürünleri kaydetme hatası:', itemsError);
        throw itemsError;
      }

      toast({
        title: "Sipariş Başarılı!",
        description: `Sipariş numaranız: ${newOrderNumber}`,
      });

      clearCart();
      setIsProcessing(false);
      setOrderComplete(true);

    } catch (error) {
      console.error('Sipariş işlemi hatası:', error);
      setIsProcessing(false);
      
      toast({
        title: "Sipariş Hatası",
        description: "Siparişiniz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive"
      });
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
            className="max-w-md mx-auto text-center"
          >
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-3xl font-bold mb-4">Sepetiniz Boş</h1>
            <p className="text-muted-foreground mb-8">
              Ödeme yapabilmek için sepetinize ürün eklemeniz gerekmektedir.
            </p>
            <Button onClick={() => navigate(ROUTE_PATHS.PRODUCTS)} size="lg">
              Ürünlere Göz At
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={springPresets.gentle}
            className="max-w-2xl mx-auto"
          >
            <Card className="border-2 border-primary/20">
              <CardHeader className="text-center pb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ ...springPresets.bouncy, delay: 0.2 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-12 h-12 text-primary" />
                </motion.div>
                <CardTitle className="text-3xl mb-2">Siparişiniz Alındı!</CardTitle>
                <CardDescription className="text-lg">
                  Sipariş numaranız: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">E-posta Onayı</p>
                      <p className="text-sm text-muted-foreground">
                        Sipariş detayları {formData.email} adresinize gönderildi.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Bilgilendirme</p>
                      <p className="text-sm text-muted-foreground">
                        Kısa süre içinde {formData.phone} numaranızdan aranacaksınız.
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'havale-eft' && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Ödeme Bilgileri</p>
                        <p className="text-sm text-muted-foreground">
                          Havale/EFT bilgileri e-posta ile gönderildi.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => navigate(ROUTE_PATHS.HOME)}
                    className="w-full"
                    size="lg"
                  >
                    Ana Sayfaya Dön
                  </Button>
                  <Button
                    onClick={() => navigate(ROUTE_PATHS.PRODUCTS)}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Alışverişe Devam Et
                  </Button>
                </div>
              </CardContent>
            </Card>
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
        >
          <h1 className="text-4xl font-bold mb-2">Ödeme</h1>
          <p className="text-muted-foreground mb-12">
            Sipariş bilgilerinizi girin ve ödeme yöntemini seçin
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    İletişim Bilgileri
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Adınız ve soyadınız"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0555 123 45 67"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Teslimat Adresi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Adres *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Mahalle, sokak, bina no, daire no"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">İl *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Tekirdağ"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">İlçe *</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        placeholder="Çorlu"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Posta Kodu</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="59850"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Ödeme Yöntemi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
                    <div className="space-y-3">
                      <label
                        htmlFor="kapida-odeme"
                        className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <RadioGroupItem value="kapida-odeme" id="kapida-odeme" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Truck className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{PAYMENT_METHODS['kapida-odeme']}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ürünleriniz teslim edildiğinde nakit olarak ödeme yapabilirsiniz.
                          </p>
                        </div>
                      </label>

                      <label
                        htmlFor="havale-eft"
                        className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <RadioGroupItem value="havale-eft" id="havale-eft" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{PAYMENT_METHODS['havale-eft']}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Banka hesap bilgilerimize havale veya EFT yaparak ödeme yapabilirsiniz.
                          </p>
                        </div>
                      </label>

                      <label
                        htmlFor="stripe"
                        className="flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                      >
                        <RadioGroupItem value="stripe" id="stripe" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{PAYMENT_METHODS.stripe}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Kredi kartı ile güvenli ödeme yapabilirsiniz.
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Sipariş Notu (Opsiyonel)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Siparişiniz hakkında eklemek istediğiniz notlar..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Card>
                  <CardHeader>
                    <CardTitle>Sipariş Özeti</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product.name} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Ara Toplam</span>
                        <span className="font-medium">{formatPrice(totalAmount)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Kargo</span>
                        <span className="font-medium">
                          {shippingCost === 0 ? (
                            <span className="text-primary">Ücretsiz</span>
                          ) : (
                            formatPrice(shippingCost)
                          )}
                        </span>
                      </div>
                      {totalAmount < 1000 && (
                        <p className="text-xs text-muted-foreground">
                          1.000 TL üzeri alışverişlerde kargo ücretsiz!
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Toplam</span>
                      <span className="text-primary">{formatPrice(finalTotal)}</span>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? 'İşleniyor...' : 'Siparişi Tamamla'}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Siparişinizi tamamlayarak{' '}
                      <a href="#" className="text-primary hover:underline">
                        kullanım koşullarını
                      </a>{' '}
                      kabul etmiş olursunuz.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}