import { motion } from "framer-motion";
import { Wrench, Sparkles, Shield, Car, Settings, Battery } from "lucide-react";
import { IMAGES } from "@/assets/images";
import { SERVICES, COMPANY_INFO } from "@/lib/index";
import { springPresets, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

const serviceIcons = {
  headlight: Wrench,
  polish: Sparkles,
  shield: Shield,
  tire: Car,
  wheel: Settings,
  battery: Battery,
};

const serviceImages = {
  "far-temizlik": [
    IMAGES.HEADLIGHT_SERVICE_1,
    IMAGES.HEADLIGHT_SERVICE_2,
    IMAGES.HEADLIGHT_SERVICE_3,
  ],
  "pasta-cila": [
    IMAGES.CAR_POLISH_1,
    IMAGES.CAR_POLISH_2,
    IMAGES.CAR_POLISH_3,
  ],
  "boya-koruma": [
    IMAGES.CAR_POLISH_4,
    IMAGES.CAR_POLISH_5,
    IMAGES.CAR_POLISH_6,
  ],
  "lastik-montaj": [
    IMAGES.HEADLIGHT_SERVICE_4,
    IMAGES.HEADLIGHT_SERVICE_5,
    IMAGES.HEADLIGHT_SERVICE_6,
  ],
  "jant-tamir": [
    IMAGES.CAR_POLISH_7,
    IMAGES.CAR_POLISH_8,
    IMAGES.CAR_POLISH_9,
  ],
  "aku-degisim": [
    IMAGES.HEADLIGHT_SERVICE_7,
    IMAGES.HEADLIGHT_SERVICE_8,
    IMAGES.CAR_POLISH_10,
  ],
};

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      <motion.section
        className="relative py-24 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springPresets.gentle}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={springPresets.gentle}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Profesyonel Otomotiv Hizmetleri
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              {COMPANY_INFO.foundedYear} yılından beri Çorlu ve Tekirdağ'da kaliteli hizmet sunuyoruz
            </p>
          </motion.div>
        </div>
      </motion.section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {SERVICES.map((service) => {
              const Icon = serviceIcons[service.icon as keyof typeof serviceIcons];
              const images = serviceImages[service.id as keyof typeof serviceImages];

              return (
                <motion.div
                  key={service.id}
                  variants={staggerItem}
                  className="group"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent z-10" />
                      <img
                        src={images[0]}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 z-20">
                        <div className="bg-primary/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-3 text-foreground">
                        {service.name}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>

                      <div className="mt-6 grid grid-cols-3 gap-2">
                        {images.slice(0, 3).map((img, idx) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden"
                          >
                            <img
                              src={img}
                              alt={`${service.name} ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <motion.section
        className="py-16 bg-gradient-to-b from-background to-primary/5"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={springPresets.gentle}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Neden {COMPANY_INFO.shortName}?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Deneyim</h3>
                    <p className="text-muted-foreground">
                      {COMPANY_INFO.currentYear - COMPANY_INFO.foundedYear} yıllık sektör tecrübesi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Kalite</h3>
                    <p className="text-muted-foreground">
                      Dünya markalarıyla çalışma garantisi
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Profesyonellik</h3>
                    <p className="text-muted-foreground">
                      Uzman kadro ve modern ekipman
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Güven</h3>
                    <p className="text-muted-foreground">
                      Binlerce müşterinin tercihi
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border text-center">
                <p className="text-muted-foreground mb-4">
                  Hizmetlerimiz hakkında detaylı bilgi almak için
                </p>
                <a
                  href={`tel:${COMPANY_INFO.contact.phone}`}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  <span>{COMPANY_INFO.contact.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
