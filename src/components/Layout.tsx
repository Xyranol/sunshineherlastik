import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Settings } from 'lucide-react';
import { SiFacebook, SiInstagram, SiX } from 'react-icons/si';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ROUTE_PATHS, COMPANY_INFO } from '@/lib/index';
import { useCart } from '@/hooks/useCart';
import { springPresets } from '@/lib/motion';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const navigationLinks = [
    { to: ROUTE_PATHS.HOME, label: 'Ana Sayfa' },
    { to: ROUTE_PATHS.PRODUCTS, label: 'Ürünler' },
    { to: ROUTE_PATHS.SERVICES, label: 'Hizmetler' },
    { to: ROUTE_PATHS.ABOUT, label: 'Hakkımızda' },
    { to: ROUTE_PATHS.CONTACT, label: 'İletişim' },
  ];

  const handleSecretClick = () => {
    setClickCount(prev => prev + 1);
    
    if (clickCount === 1) {
      setShowPasswordInput(true);
      setClickCount(0);
    }
    
    // Reset click count after 2 seconds
    setTimeout(() => {
      setClickCount(0);
    }, 2000);
  };

  const handlePasswordSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (password === 'suzi1234') {
        navigate('/developer');
        setShowPasswordInput(false);
        setPassword('');
      } else {
        setPassword('');
        setShowPasswordInput(false);
      }
    }
  };

  const handlePasswordBlur = () => {
    setShowPasswordInput(false);
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to={ROUTE_PATHS.HOME} className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <span className="text-white font-bold text-xl">SH</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-none text-foreground">
                  {COMPANY_INFO.shortName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {COMPANY_INFO.foundedYear} - {COMPANY_INFO.currentYear}
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <Link to={ROUTE_PATHS.CART}>
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={springPresets.gentle}
              className="md:hidden border-t border-border bg-background"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col space-y-2">
                {navigationLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                  <span className="text-white font-bold text-xl">SH</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-base leading-none text-foreground">
                    {COMPANY_INFO.shortName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {COMPANY_INFO.foundedYear} - {COMPANY_INFO.currentYear}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Çorlu'nun güvenilir lastik, jant ve akü merkezi. Dünya markalarıyla hizmetinizdeyiz.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Hızlı Bağlantılar</h3>
              <ul className="space-y-2">
                {navigationLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">İletişim</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <span>{COMPANY_INFO.location.address}</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{COMPANY_INFO.contact.phone}</span>
                </li>
                <li className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span>{COMPANY_INFO.contact.email}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Çalışma Saatleri</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>Hafta İçi:</span>
                  <span className="font-medium text-foreground">{COMPANY_INFO.workingHours.weekdays}</span>
                </li>
                <li className="flex justify-between">
                  <span>Cumartesi:</span>
                  <span className="font-medium text-foreground">{COMPANY_INFO.workingHours.saturday}</span>
                </li>
                <li className="flex justify-between">
                  <span>Pazar:</span>
                  <span className="font-medium text-foreground">{COMPANY_INFO.workingHours.sunday}</span>
                </li>
              </ul>
              <div className="flex items-center space-x-3 mt-6">
                <a
                  href={COMPANY_INFO.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a
                  href={COMPANY_INFO.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiInstagram className="h-5 w-5" />
                </a>
                <a
                  href={COMPANY_INFO.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <SiX className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {COMPANY_INFO.currentYear} {COMPANY_INFO.name}. Tüm hakları saklıdır.
            </p>
            
            {/* Gizli Developer Mode Erişimi */}
            <div className="relative mt-4">
              <div 
                onClick={handleSecretClick}
                className="w-3 h-3 bg-muted-foreground/20 rounded-full mx-auto cursor-pointer hover:bg-muted-foreground/40 transition-colors"
                title=""
              />
              
              {showPasswordInput && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handlePasswordSubmit}
                    onBlur={handlePasswordBlur}
                    placeholder="Şifre girin..."
                    className="px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}