import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Shield, Wrench, Award, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IMAGES } from "@/assets/images";
import { ROUTE_PATHS, COMPANY_INFO, SERVICES, formatPrice } from "@/lib/index";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { VehicleFilter } from "@/components/VehicleFilter";
import { springPresets, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";
import { useState } from "react";
import type { VehicleFilters } from "@/lib/index";

export default function Home() {
  const { data: featuredProducts = [] } = useProducts({ category: "lastik" });
  const [vehicleFilters, setVehicleFilters] = useState<VehicleFilters>({});

  const displayProducts = featuredProducts.slice(0, 6);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-muted/20">

        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ ...springPresets.snappy, delay: 0.1 }}
            >
              <p className="text-primary font-semibold">
                {COMPANY_INFO.foundedYear} - {COMPANY_INFO.currentYear} • 23 Yıllık Deneyim
              </p>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Sunshine Otomotiv
              <br />
              <span className="text-primary">Herlastik</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Çorlu'nun güvenilir lastik, jant ve akü merkezi. Dünya markalarıyla kaliteli hizmet.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
              >
                <Link to={ROUTE_PATHS.PRODUCTS}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Ürünleri İncele
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-background/50 backdrop-blur-sm"
              >
                <Link to={ROUTE_PATHS.SERVICES}>
                  <Wrench className="mr-2 h-5 w-5" />
                  Hizmetlerimiz
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springPresets.gentle}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Aracınıza Uygun Lastik Bulun
            </h2>
            <p className="text-xl text-muted-foreground">
              Araç bilgilerinizi girerek size özel lastik önerilerimizi görün
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...springPresets.gentle, delay: 0.1 }}
          >
            <VehicleFilter
              onFilterChange={setVehicleFilters}
              className="max-w-4xl mx-auto"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springPresets.gentle}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Öne Çıkan Ürünler
            </h2>
            <p className="text-xl text-muted-foreground">
              En çok tercih edilen lastik modelleri
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayProducts.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...springPresets.gentle, delay: 0.3 }}
          >
            <Button asChild size="lg" variant="outline">
              <Link to={ROUTE_PATHS.PRODUCTS}>Tüm Ürünleri Görüntüle</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springPresets.gentle}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-xl text-muted-foreground">
              Aracınız için profesyonel bakım ve servis çözümleri
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {SERVICES.map((service, index) => (
              <motion.div key={service.id} variants={staggerItem}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                      {service.icon === "headlight" && <Shield className="h-8 w-8 text-primary" />}
                      {service.icon === "polish" && <Award className="h-8 w-8 text-primary" />}
                      {service.icon === "shield" && <Shield className="h-8 w-8 text-primary" />}
                      {service.icon === "tire" && <ShoppingCart className="h-8 w-8 text-primary" />}
                      {service.icon === "wheel" && <Wrench className="h-8 w-8 text-primary" />}
                      {service.icon === "battery" && <Award className="h-8 w-8 text-primary" />}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...springPresets.gentle, delay: 0.3 }}
          >
            <Button asChild size="lg">
              <Link to={ROUTE_PATHS.SERVICES}>Tüm Hizmetleri Görüntüle</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={springPresets.gentle}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                23 Yıllık Deneyim
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                {COMPANY_INFO.foundedYear} yılından bu yana Çorlu ve Tekirdağ bölgesinde
                otomotiv sektöründe hizmet veriyoruz. Herlastik bayiliğimizle birlikte,
                Continental, Michelin, Bridgestone, Pirelli gibi dünya markalarının
                yetkili satıcısıyız.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Dünya Markaları</h3>
                    <p className="text-muted-foreground">
                      Orijinal ve garantili ürünler
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Güvenilir Hizmet</h3>
                    <p className="text-muted-foreground">
                      Profesyonel ekip ve modern ekipman
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Kapsamlı Servis</h3>
                    <p className="text-muted-foreground">
                      Montajdan bakıma tüm hizmetler
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild size="lg" className="mt-8">
                <Link to={ROUTE_PATHS.ABOUT}>Hakkımızda Daha Fazla</Link>
              </Button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ...springPresets.gentle, delay: 0.1 }}
            >
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={IMAGES.TIRE_DISPLAY_3}
                  alt="Lastik Showroom"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
                <img
                  src={IMAGES.HEADLIGHT_SERVICE_1}
                  alt="Far Temizliği"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                />
                <img
                  src={IMAGES.CAR_POLISH_1}
                  alt="Pasta Cila"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover"
                />
                <img
                  src={IMAGES.TIRE_DISPLAY_5}
                  alt="Jant Çeşitleri"
                  className="rounded-2xl shadow-lg w-full h-64 object-cover mt-8"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springPresets.gentle}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Bize Ulaşın
            </h2>
            <p className="text-xl text-muted-foreground">
              Sorularınız için bizimle iletişime geçin
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={staggerItem}>
              <Card className="text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Telefon</h3>
                  <p className="text-muted-foreground mb-2">{COMPANY_INFO.contact.phone}</p>
                  <p className="text-sm text-muted-foreground">WhatsApp: {COMPANY_INFO.contact.whatsapp}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Adres</h3>
                  <p className="text-muted-foreground">
                    {COMPANY_INFO.location.address}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="text-center h-full">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Clock className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Çalışma Saatleri</h3>
                  <p className="text-muted-foreground mb-2">
                    Hafta İçi: {COMPANY_INFO.workingHours.weekdays}
                  </p>
                  <p className="text-muted-foreground mb-2">
                    Cumartesi: {COMPANY_INFO.workingHours.saturday}
                  </p>
                  <p className="text-muted-foreground">
                    Pazar: {COMPANY_INFO.workingHours.sunday}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ...springPresets.gentle, delay: 0.3 }}
          >
            <Button asChild size="lg">
              <Link to={ROUTE_PATHS.CONTACT}>İletişim Formu</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}