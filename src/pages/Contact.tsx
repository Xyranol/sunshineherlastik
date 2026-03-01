import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { COMPANY_INFO } from "@/lib/index";
import { springPresets, fadeInUp, staggerContainer, staggerItem } from "@/lib/motion";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Mesajınız Gönderildi",
      description: "En kısa sürede size dönüş yapacağız.",
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springPresets.gentle}
        className="relative bg-gradient-to-b from-primary/10 via-background to-background py-24"
      >
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={springPresets.gentle}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">İletişim</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sorularınız için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <motion.div variants={staggerItem}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-2xl">İletişim Bilgileri</CardTitle>
                  <CardDescription>
                    {COMPANY_INFO.name} - {COMPANY_INFO.foundedYear} yılından beri hizmetinizdeyiz
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adres</h3>
                      <p className="text-muted-foreground">
                        {COMPANY_INFO.location.address}
                      </p>
                      <p className="text-muted-foreground">
                        {COMPANY_INFO.location.city} / {COMPANY_INFO.location.province}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefon</h3>
                      <p className="text-muted-foreground">{COMPANY_INFO.contact.phone}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        WhatsApp: {COMPANY_INFO.contact.whatsapp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">E-posta</h3>
                      <p className="text-muted-foreground">{COMPANY_INFO.contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Çalışma Saatleri</h3>
                      <p className="text-muted-foreground">
                        Hafta İçi: {COMPANY_INFO.workingHours.weekdays}
                      </p>
                      <p className="text-muted-foreground">
                        Cumartesi: {COMPANY_INFO.workingHours.saturday}
                      </p>
                      <p className="text-muted-foreground">
                        Pazar: {COMPANY_INFO.workingHours.sunday}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Card className="h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Bize Yazın</CardTitle>
                  <CardDescription>
                    Formu doldurarak bize mesaj gönderebilirsiniz
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Input
                        name="name"
                        placeholder="Adınız Soyadınız"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Input
                        name="email"
                        type="email"
                        placeholder="E-posta Adresiniz"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Input
                        name="phone"
                        type="tel"
                        placeholder="Telefon Numaranız"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Input
                        name="subject"
                        placeholder="Konu"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Textarea
                        name="message"
                        placeholder="Mesajınız"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                      size="lg"
                    >
                      {isSubmitting ? (
                        "Gönderiliyor..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Mesaj Gönder
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={springPresets.gentle}
          >
            <Card className="shadow-lg overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">Konum</CardTitle>
                <CardDescription>
                  {COMPANY_INFO.location.city} merkezinde hizmet veriyoruz
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-[400px] bg-muted relative">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3019.8!2d27.8!3d41.16!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA5JzM2LjAiTiAyN8KwNDgnMDAuMCJF!5e0!3m2!1str!2str!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Sunshine Herlastik Konum"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
