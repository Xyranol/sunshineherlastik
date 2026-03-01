export const ROUTE_PATHS = {
  HOME: "/",
  PRODUCTS: "/urunler",
  PRODUCT_DETAIL: "/urun/:id",
  CART: "/sepet",
  CHECKOUT: "/odeme",
  SERVICES: "/hizmetler",
  ABOUT: "/hakkimizda",
  CONTACT: "/iletisim",
  ADMIN: "/admin",
  SEO: "/seo",
} as const;

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "lastik" | "jant" | "aku";
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  description: string;
  specifications: {
    width?: string;
    aspectRatio?: string;
    diameter?: string;
    loadIndex?: string;
    speedRating?: string;
    season?: "yaz" | "kis" | "dort-mevsim";
    runFlat?: boolean;
    size?: string;
    material?: string;
    finish?: string;
    capacity?: string;
    voltage?: string;
    warranty?: string;
  };
  stock: number;
  featured?: boolean;
  compatibleVehicles?: {
    brandId: string;
    modelId: string;
    year: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: "lastik" | "jant" | "aku";
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
  };
  paymentMethod: "kapida-odeme" | "havale-eft" | "stripe";
  paymentStatus: "beklemede" | "odendi" | "iptal";
  orderStatus: "yeni" | "hazirlaniyor" | "kargoda" | "teslim-edildi" | "iptal";
  totalAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleBrand {
  id: string;
  name: string;
  logo?: string;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  years: number[];
  tireSpecs: {
    width: string;
    aspectRatio: string;
    diameter: string;
  }[];
}

export interface VehicleFilters {
  brandId?: string;
  modelId?: string;
  year?: number;
  tireSize?: string;
}

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `SH${timestamp}${random}`;
};

export const TIRE_BRANDS = [
  "Continental",
  "Michelin",
  "Bridgestone",
  "Pirelli",
  "Goodyear",
  "Dunlop",
  "Hankook",
  "Yokohama",
  "Lassa",
  "Petlas",
] as const;

export const WHEEL_BRANDS = [
  "OZ Racing",
  "BBS",
  "Enkei",
  "Rays",
  "Rotiform",
  "Vossen",
  "TSW",
  "Konig",
] as const;

export const BATTERY_BRANDS = [
  "Varta",
  "Bosch",
  "Mutlu",
  "Inci",
  "Hugel",
  "Westa",
] as const;

export const SEASONS = {
  yaz: "Yaz Lastiği",
  kis: "Kış Lastiği",
  "dort-mevsim": "4 Mevsim Lastiği",
} as const;

export const PAYMENT_METHODS = {
  "kapida-odeme": "Kapıda Ödeme",
  "havale-eft": "Havale/EFT",
  stripe: "Kredi Kartı (Stripe)",
} as const;

export const ORDER_STATUSES = {
  yeni: "Yeni Sipariş",
  hazirlaniyor: "Hazırlanıyor",
  kargoda: "Kargoda",
  "teslim-edildi": "Teslim Edildi",
  iptal: "İptal Edildi",
} as const;

export const PAYMENT_STATUSES = {
  beklemede: "Ödeme Bekliyor",
  odendi: "Ödendi",
  iptal: "İptal Edildi",
} as const;

export const COMPANY_INFO = {
  name: "Sunshine Otomotiv Herlastik",
  shortName: "Sunshine Herlastik",
  foundedYear: 2003,
  currentYear: 2026,
  location: {
    city: "Çorlu",
    province: "Tekirdağ",
    address: "Reşadiye Mahallesi Bülent Ecevit Bulvarı Aş Evi Yanı Halk Eğitim Karşısı",
  },
  contact: {
    phone: "05373563526",
    email: "info@sunshineherlastik.com",
    whatsapp: "05373563526",
  },
  social: {
    facebook: "https://facebook.com/sunshineherlastik",
    instagram: "https://instagram.com/sunshineherlastik",
    twitter: "https://twitter.com/sunshineherlastik",
  },
  workingHours: {
    weekdays: "09:00 - 19:00",
    saturday: "09:00 - 18:00",
    sunday: "Kapalı",
  },
} as const;

export const SERVICES = [
  {
    id: "far-temizlik",
    name: "Far Temizliği ve Ayarı",
    description: "Profesyonel far temizliği ve ayar hizmeti ile güvenli sürüş",
    icon: "headlight",
  },
  {
    id: "pasta-cila",
    name: "Pasta Cila",
    description: "Aracınızın boyasını koruyucu pasta cila uygulaması",
    icon: "polish",
  },
  {
    id: "boya-koruma",
    name: "Boya Koruma",
    description: "Uzun ömürlü boya koruma filmi ve seramik kaplama",
    icon: "shield",
  },
  {
    id: "lastik-montaj",
    name: "Lastik Montaj ve Balans",
    description: "Profesyonel lastik montaj, balans ve rot ayarı",
    icon: "tire",
  },
  {
    id: "jant-tamir",
    name: "Jant Tamiri",
    description: "Hasarlı jantların profesyonel tamiri ve boyası",
    icon: "wheel",
  },
  {
    id: "aku-degisim",
    name: "Akü Değişimi",
    description: "Hızlı ve güvenli akü değişim hizmeti",
    icon: "battery",
  },
] as const;

export const SEO_KEYWORDS = [
  "çorlu lastikçi",
  "tekirdağ lastik",
  "herlastik çorlu",
  "sunshine otomotiv",
  "çorlu jant",
  "çorlu akü",
  "lastik fiyatları çorlu",
  "continental lastik çorlu",
  "michelin lastik tekirdağ",
  "bridgestone çorlu",
  "pirelli lastik",
  "kış lastiği çorlu",
  "4 mevsim lastik",
  "far temizliği çorlu",
  "pasta cila tekirdağ",
  "boya koruma çorlu",
] as const;
