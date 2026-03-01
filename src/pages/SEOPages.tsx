import { ROUTE_PATHS, SEO_KEYWORDS, COMPANY_INFO, TIRE_BRANDS, WHEEL_BRANDS, BATTERY_BRANDS, SERVICES } from "@/lib/index";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useEffect } from "react";

export default function SEOPages() {
  useEffect(() => {
    document.title = "Çorlu Lastikçi | Tekirdağ Lastik | Sunshine Herlastik";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "Çorlu'nun en güvenilir lastikçisi Sunshine Herlastik. Continental, Michelin, Bridgestone, Pirelli lastik satışı. Jant, akü, far temizliği hizmetleri. 2003'ten beri Tekirdağ Çorlu'da.");
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', SEO_KEYWORDS.join(", "));
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', "Çorlu Lastikçi | Sunshine Herlastik");
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', "Tekirdağ Çorlu'da 2003'ten beri lastik, jant, akü satışı ve otomotiv hizmetleri");
    }
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}${ROUTE_PATHS.SEO}`);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Çorlu Lastikçi - Sunshine Herlastik
            </h1>
            <p className="text-xl text-muted-foreground">
              Tekirdağ Çorlu'nun En Güvenilir Lastik ve Otomotiv Merkezi
            </p>
            <p className="text-lg text-muted-foreground">
              {COMPANY_INFO.foundedYear} - {COMPANY_INFO.currentYear} | {COMPANY_INFO.currentYear - COMPANY_INFO.foundedYear} Yıllık Deneyim
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Çorlu'da Lastik Satışı ve Hizmetleri
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p>
                <strong>Sunshine Otomotiv Herlastik</strong>, {COMPANY_INFO.foundedYear} yılından bu yana Tekirdağ Çorlu'da
                kaliteli lastik satışı ve profesyonel otomotiv hizmetleri sunmaktadır. Dünya markası lastikler,
                jantlar ve aküler ile aracınız için en iyi çözümleri sunuyoruz.
              </p>
              <p>
                Çorlu lastikçi arayanlar için tek adres: Continental, Michelin, Bridgestone, Pirelli gibi
                premium markaların yanı sıra Lassa, Petlas gibi yerli markaların da yetkili satıcısıyız.
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Lastik Markaları
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {TIRE_BRANDS.map((brand) => (
                <div
                  key={brand}
                  className="bg-card border border-border rounded-lg p-4 text-center hover:shadow-lg transition-shadow"
                >
                  <p className="font-semibold text-foreground">{brand}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">
              Çorlu'da tüm lastik markalarını bulabileceğiniz tek adres. Yaz lastiği, kış lastiği ve 4 mevsim
              lastik seçenekleri ile her ihtiyaca uygun çözümler.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Jant ve Akü Satışı
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Jant Markaları</h3>
                <ul className="space-y-2">
                  {WHEEL_BRANDS.map((brand) => (
                    <li key={brand} className="text-muted-foreground flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {brand}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground">
                  Tekirdağ'ın en geniş jant çeşitliliği Sunshine Herlastik'te. Alüminyum jant, çelik jant ve
                  özel tasarım jantlar.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-foreground">Akü Markaları</h3>
                <ul className="space-y-2">
                  {BATTERY_BRANDS.map((brand) => (
                    <li key={brand} className="text-muted-foreground flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full" />
                      {brand}
                    </li>
                  ))}
                </ul>
                <p className="text-muted-foreground">
                  Çorlu'da akü değişimi ve satışı. Garantili, uzun ömürlü aküler ve profesyonel montaj hizmeti.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Otomotiv Hizmetlerimiz
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-lg p-6 space-y-3 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-foreground">{service.name}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              ))}
            </div>
            <p className="text-muted-foreground">
              Çorlu'da far temizliği, pasta cila, boya koruma ve tüm otomotiv bakım hizmetleri için
              Sunshine Herlastik'i tercih edin.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              İletişim Bilgileri
            </h2>
            <div className="bg-card border border-border rounded-lg p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Adres</p>
                      <p className="text-muted-foreground">{COMPANY_INFO.location.address}</p>
                      <p className="text-muted-foreground">
                        {COMPANY_INFO.location.city} / {COMPANY_INFO.location.province}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Telefon</p>
                      <p className="text-muted-foreground">{COMPANY_INFO.contact.phone}</p>
                      <p className="text-muted-foreground">WhatsApp: {COMPANY_INFO.contact.whatsapp}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">E-posta</p>
                      <p className="text-muted-foreground">{COMPANY_INFO.contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-foreground">Çalışma Saatleri</p>
                      <p className="text-muted-foreground">Hafta İçi: {COMPANY_INFO.workingHours.weekdays}</p>
                      <p className="text-muted-foreground">Cumartesi: {COMPANY_INFO.workingHours.saturday}</p>
                      <p className="text-muted-foreground">Pazar: {COMPANY_INFO.workingHours.sunday}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Neden Sunshine Herlastik?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">✓ {COMPANY_INFO.currentYear - COMPANY_INFO.foundedYear} Yıllık Deneyim</h3>
                <p className="text-muted-foreground">
                  {COMPANY_INFO.foundedYear} yılından bu yana Çorlu'da güvenilir hizmet
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">✓ Dünya Markaları</h3>
                <p className="text-muted-foreground">
                  Continental, Michelin, Bridgestone, Pirelli yetkili satıcısı
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">✓ Profesyonel Ekip</h3>
                <p className="text-muted-foreground">
                  Uzman kadromuz ile kaliteli montaj ve bakım hizmeti
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">✓ Uygun Fiyatlar</h3>
                <p className="text-muted-foreground">
                  Tekirdağ'ın en uygun lastik fiyatları ve kampanyalar
                </p>
              </div>
            </div>
          </section>

          <section className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Çorlu'da Lastik Arayanlar İçin En İyi Adres
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sunshine Otomotiv Herlastik olarak, Tekirdağ Çorlu'da lastik, jant, akü satışı ve
              otomotiv hizmetlerinde sektörün lideri olmaya devam ediyoruz. Kaliteli ürünler,
              uygun fiyatlar ve profesyonel hizmet için bizi tercih edin.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                to={ROUTE_PATHS.PRODUCTS}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Ürünleri İncele
              </Link>
              <Link
                to={ROUTE_PATHS.CONTACT}
                className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
              >
                İletişime Geç
              </Link>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Sık Aranan Kelimeler
            </h2>
            <div className="flex flex-wrap gap-2">
              {SEO_KEYWORDS.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-block px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
