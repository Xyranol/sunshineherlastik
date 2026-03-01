import { motion } from "framer-motion";
import { Calendar, MapPin, Award, Users, Wrench, Shield } from "lucide-react";
import { COMPANY_INFO } from "@/lib/index";
import { springPresets, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export default function About() {
  const yearsInBusiness = COMPANY_INFO.currentYear - COMPANY_INFO.foundedYear;

  const milestones = [
    {
      year: 2003,
      title: "Kuruluş",
      description: "Sunshine Otomotiv, Çorlu'da lastik ve otomotiv hizmetleri alanında faaliyete başladı.",
      icon: Calendar,
    },
    {
      year: 2010,
      title: "Herlastik Bayiliği",
      description: "Türkiye'nin önde gelen lastik distribütörü Herlastik'in yetkili bayisi olduk.",
      icon: Award,
    },
    {
      year: 2015,
      title: "Genişleme",
      description: "Jant ve akü ürün gamımızı genişleterek tam donanımlı otomotiv merkezi haline geldik.",
      icon: Wrench,
    },
    {
      year: 2020,
      title: "Dijital Dönüşüm",
      description: "Online satış ve rezervasyon sistemimizi hayata geçirerek müşteri deneyimini geliştirdik.",
      icon: Users,
    },
    {
      year: 2026,
      title: "Bugün",
      description: "23 yıllık deneyimimizle Tekirdağ bölgesinin en güvenilir otomotiv merkezi olarak hizmet veriyoruz.",
      icon: Shield,
    },
  ];

  const values = [
    {
      title: "Kalite",
      description: "Sadece dünya markası ürünlerle çalışıyor, kaliteden asla ödün vermiyoruz.",
      icon: Award,
    },
    {
      title: "Güven",
      description: "23 yıldır binlerce müşterimize güvenilir hizmet sunmanın gururunu yaşıyoruz.",
      icon: Shield,
    },
    {
      title: "Uzmanlık",
      description: "Deneyimli ekibimiz ve modern ekipmanlarımızla profesyonel hizmet garantisi.",
      icon: Wrench,
    },
    {
      title: "Müşteri Memnuniyeti",
      description: "Müşteri memnuniyeti bizim için her şeyden önce gelir.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen">
      <motion.section
        className="relative py-24 bg-gradient-to-b from-primary/5 via-background to-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springPresets.gentle}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {COMPANY_INFO.foundedYear} yılından bu yana Çorlu Tekirdağ'da güvenilir otomotiv hizmetleri
            </p>
            <div className="flex items-center justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold">{yearsInBusiness} Yıl Deneyim</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-semibold">Çorlu, Tekirdağ</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={staggerItem} className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Hikayemiz</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  <strong className="text-foreground">Sunshine Otomotiv</strong>, {COMPANY_INFO.foundedYear} yılında Çorlu'da kurularak otomotiv sektöründe hizmet vermeye başladı. Kuruluşumuzdan bu yana müşteri memnuniyeti ve kaliteli hizmet anlayışımızdan asla ödün vermedik.
                </p>
                <p className="mb-4">
                  2010 yılında Türkiye'nin önde gelen lastik distribütörlerinden <strong className="text-foreground">Herlastik</strong>'in yetkili bayisi olarak, Continental, Michelin, Bridgestone, Pirelli gibi dünya markalarının ürünlerini müşterilerimize sunma ayrıcalığına kavuştuk.
                </p>
                <p className="mb-4">
                  Yıllar içinde sadece lastik satışı yapmakla kalmayıp, jant, akü ve çeşitli otomotiv hizmetlerini de bünyemize katarak tam donanımlı bir otomotiv merkezi haline geldik. Far temizliği, pasta cila, boya koruma gibi hizmetlerimizle aracınızın her türlü ihtiyacına cevap veriyoruz.
                </p>
                <p>
                  Bugün {yearsInBusiness} yıllık deneyimimiz, uzman kadromuz ve modern ekipmanlarımızla Tekirdağ bölgesinin en güvenilir otomotiv merkezi olarak hizmet vermeye devam ediyoruz.
                </p>
              </div>
            </motion.div>

            <motion.div variants={staggerItem} className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Kilometre Taşlarımız</h2>
              <div className="space-y-8">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <motion.div
                      key={milestone.year}
                      className="flex gap-6 group"
                      variants={staggerItem}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                          <h3 className="text-xl font-semibold">{milestone.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div variants={staggerItem}>
              <h2 className="text-3xl font-bold mb-8">Değerlerimiz</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.title}
                      className="p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all group"
                      variants={staggerItem}
                      whileHover={{ scale: 1.02 }}
                      transition={springPresets.snappy}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springPresets.gentle}
          >
            <h2 className="text-3xl font-bold mb-6">Neden Bizi Tercih Etmelisiniz?</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">{yearsInBusiness}+</div>
                <div className="text-muted-foreground">Yıllık Deneyim</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">Dünya Markası</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                <div className="text-muted-foreground">Mutlu Müşteri</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
