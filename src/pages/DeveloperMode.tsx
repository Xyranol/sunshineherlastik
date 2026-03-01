import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Settings, 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowLeft,
  Database,
  FileText,
  Image,
  DollarSign,
  Palette,
  Layout,
  Type,
  Monitor,
  Smartphone,
  Eye,
  Upload,
  Download,
  Copy,
  Layers,
  Grid,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Zap,
  Sparkles,
  ShoppingCart
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  price: number;
  sale_price?: number;
  tire_size?: string;
  tire_season?: string;
  description: string;
  short_description: string;
  images: string[];
  stock_quantity: number;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  customer_city: string;
  customer_district: string;
  customer_postal_code: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    product_id: string;
    product_name: string;
    product_brand: string;
    product_price: number;
    quantity: number;
    subtotal: number;
  }[];
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
}

export default function DeveloperMode() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showImageManager, setShowImageManager] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [availableImages, setAvailableImages] = useState<string[]>([]);

  // Site tasarım ayarları
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    siteName: "Sunshine Herlastik",
    siteDescription: "Çorlu'nun güvenilir lastik, jant ve akü merkezi",
    primaryColor: "#f97316",
    secondaryColor: "#1f2937",
    accentColor: "#3b82f6",
    fontFamily: "Inter",
    logoUrl: "",
    heroTitle: "Çorlu'nun En Güvenilir Lastik Merkezi",
    heroSubtitle: "2003'ten beri kaliteli hizmet",
    contactPhone: "05373563526",
    contactEmail: "info@sunshineherlastik.com",
    contactAddress: "Reşadiye Mahallesi Bülent Ecevit Bulvarı Aş Evi Yanı Halk Eğitim Karşısında",
    socialFacebook: "https://facebook.com/sunshineherlastik",
    socialInstagram: "https://instagram.com/sunshineherlastik",
    socialTwitter: "https://twitter.com/sunshineherlastik"
  });

  // Yeni ürün formu state'leri
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    category_id: "",
    price: "",
    sale_price: "",
    tire_size: "",
    tire_season: "",
    description: "",
    short_description: "",
    images: [""],
    stock_quantity: "",
    is_featured: false
  });

  useEffect(() => {
    loadData();
    loadAvailableImages();
    loadOrders();
  }, []);

  const loadData = async () => {
    try {
      // Kategorileri yükle
      const { data: categoriesData } = await supabase
        .from("categories_2026_03_01_14_16")
        .select("*")
        .order("name");
      
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Ürünleri yükle
      const { data: productsData } = await supabase
        .from("products_2026_03_01_14_16")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (productsData) {
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
      toast({
        title: "Hata",
        description: "Veriler yüklenirken hata oluştu",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from("orders_2026_03_01_14_16")
        .select(`
          *,
          order_items_2026_03_01_14_16 (
            id,
            product_id,
            product_name,
            product_brand,
            unit_price,
            quantity,
            total_price
          )
        `)
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) {
        console.error("Sipariş sorgu hatası:", error);
        return;
      }
      
      if (ordersData) {
        const formattedOrders = ordersData.map(order => ({
          ...order,
          order_items: (order.order_items_2026_03_01_14_16 || []).map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_brand: item.product_brand || "Bilinmeyen",
            product_price: item.unit_price,
            quantity: item.quantity,
            subtotal: item.total_price
          }))
        }));
        setOrders(formattedOrders);
        console.log("Siparişler yüklendi:", formattedOrders.length, "adet");
      }
    } catch (error) {
      console.error("Sipariş yükleme hatası:", error);
    }
  };

  const loadAvailableImages = async () => {
    try {
      // Public/images klasöründeki resimleri listele
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
      const images: string[] = [];
      
      // Mevcut ürünlerden resimleri topla
      products.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach(img => {
            if (img && !images.includes(img)) {
              images.push(img);
            }
          });
        }
      });

      // Public klasöründeki resimleri ekle (örnek)
      const publicImages = [
        '/images/bridgestone_tire_1.jpeg',
        '/images/continental_tire_1.jpeg',
        '/images/michelin_tire_1.jpeg',
        '/images/goodyear_tire_1.png',
        '/images/lassa_tire_1.jpeg',
        '/images/petlas_tire_1.jpeg',
        '/images/car_battery_1.jpeg',
        '/images/alloy_wheel_rim_1.jpeg'
      ];

      setAvailableImages([...images, ...publicImages]);
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        name: newProduct.name,
        slug: newProduct.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now(),
        brand: newProduct.brand,
        category_id: newProduct.category_id,
        price: parseFloat(newProduct.price),
        sale_price: newProduct.sale_price ? parseFloat(newProduct.sale_price) : null,
        tire_size: newProduct.tire_size || null,
        tire_season: newProduct.tire_season || null,
        description: newProduct.description,
        short_description: newProduct.short_description,
        images: newProduct.images.filter(img => img.trim() !== ""),
        stock_quantity: parseInt(newProduct.stock_quantity),
        is_featured: newProduct.is_featured,
        sku: `SKU-${Date.now()}`,
        specifications: {},
        is_active: true
      };

      const { data, error } = await supabase
        .from("products_2026_03_01_14_16")
        .insert([productData])
        .select()
        .single();

      if (error) throw error;

      setProducts([data, ...products]);
      setShowAddProduct(false);
      setNewProduct({
        name: "",
        brand: "",
        category_id: "",
        price: "",
        sale_price: "",
        tire_size: "",
        tire_season: "",
        description: "",
        short_description: "",
        images: [""],
        stock_quantity: "",
        is_featured: false
      });

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla eklendi"
      });
    } catch (error) {
      console.error("Ürün ekleme hatası:", error);
      toast({
        title: "Hata",
        description: "Ürün eklenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products_2026_03_01_14_16")
        .update({
          name: product.name,
          brand: product.brand,
          price: product.price,
          sale_price: product.sale_price,
          description: product.description,
          stock_quantity: product.stock_quantity,
          is_featured: product.is_featured,
          images: product.images
        })
        .eq("id", product.id);

      if (error) throw error;

      setProducts(products.map(p => p.id === product.id ? product : p));
      setEditingProduct(null);

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla güncellendi"
      });
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Ürün güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

    try {
      const { error } = await supabase
        .from("products_2026_03_01_14_16")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi"
      });
    } catch (error) {
      console.error("Ürün silme hatası:", error);
      toast({
        title: "Hata",
        description: "Ürün silinirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders_2026_03_01_14_16")
        .update({ 
          order_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, order_status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast({
        title: "Başarılı",
        description: "Sipariş durumu güncellendi"
      });
    } catch (error) {
      console.error("Sipariş durumu güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Sipariş durumu güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("orders_2026_03_01_14_16")
        .update({ 
          payment_status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) throw error;

      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, payment_status: newStatus, updated_at: new Date().toISOString() }
          : order
      ));

      toast({
        title: "Başarılı",
        description: "Ödeme durumu güncellendi"
      });
    } catch (error) {
      console.error("Ödeme durumu güncelleme hatası:", error);
      toast({
        title: "Hata",
        description: "Ödeme durumu güncellenirken hata oluştu",
        variant: "destructive"
      });
    }
  };

  const handleSaveSiteSettings = () => {
    // Site ayarlarını localStorage'a kaydet
    localStorage.setItem('sunshine_site_settings', JSON.stringify(siteSettings));
    
    toast({
      title: "Başarılı",
      description: "Site ayarları kaydedildi. Değişikliklerin görünmesi için sayfayı yenileyin."
    });
  };

  const handleApplyDesignChanges = () => {
    // CSS değişkenlerini güncelle
    const root = document.documentElement;
    root.style.setProperty('--primary', siteSettings.primaryColor);
    root.style.setProperty('--secondary', siteSettings.secondaryColor);
    root.style.setProperty('--accent', siteSettings.accentColor);
    
    toast({
      title: "Başarılı",
      description: "Tasarım değişiklikleri uygulandı!"
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : "Bilinmeyen";
  };

  const filteredImages = availableImages.filter(img => 
    img.toLowerCase().includes(imageSearchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              Developer Mode
            </h1>
            <p className="text-muted-foreground mt-1">Sunshine Herlastik Site Yönetimi</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open("/", "_blank")} className="gap-2">
              <Eye className="h-4 w-4" />
              Siteyi Görüntüle
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </Button>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-6">
            <TabsTrigger value="products">Ürünler</TabsTrigger>
            <TabsTrigger value="orders">Siparişler</TabsTrigger>
            <TabsTrigger value="images">Fotoğraflar</TabsTrigger>
            <TabsTrigger value="design">Site Tasarım</TabsTrigger>
            <TabsTrigger value="database">Veritabanı</TabsTrigger>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="settings">Ayarlar</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Ürün Yönetimi
                    </CardTitle>
                    <CardDescription>
                      Ürünleri ekleyin, düzenleyin veya silin
                    </CardDescription>
                  </div>
                  <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Yeni Ürün Ekle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Yeni Ürün Ekle</DialogTitle>
                        <DialogDescription>
                          Yeni ürün bilgilerini girin
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Ürün Adı</Label>
                            <Input
                              id="name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                              placeholder="Ürün adını girin"
                            />
                          </div>
                          <div>
                            <Label htmlFor="brand">Marka</Label>
                            <Input
                              id="brand"
                              value={newProduct.brand}
                              onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                              placeholder="Marka adını girin"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="category">Kategori</Label>
                          <Select value={newProduct.category_id} onValueChange={(value) => setNewProduct({...newProduct, category_id: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Kategori seçin" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="price">Fiyat (₺)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="sale_price">İndirimli Fiyat (₺)</Label>
                            <Input
                              id="sale_price"
                              type="number"
                              value={newProduct.sale_price}
                              onChange={(e) => setNewProduct({...newProduct, sale_price: e.target.value})}
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <Label htmlFor="stock">Stok Adedi</Label>
                            <Input
                              id="stock"
                              type="number"
                              value={newProduct.stock_quantity}
                              onChange={(e) => setNewProduct({...newProduct, stock_quantity: e.target.value})}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tire_size">Lastik Ebatı</Label>
                            <Input
                              id="tire_size"
                              value={newProduct.tire_size}
                              onChange={(e) => setNewProduct({...newProduct, tire_size: e.target.value})}
                              placeholder="195/65 R15"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tire_season">Mevsim</Label>
                            <Select value={newProduct.tire_season} onValueChange={(value) => setNewProduct({...newProduct, tire_season: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Mevsim seçin" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Yaz">Yaz</SelectItem>
                                <SelectItem value="Kış">Kış</SelectItem>
                                <SelectItem value="4 Mevsim">4 Mevsim</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="short_description">Kısa Açıklama</Label>
                          <Input
                            id="short_description"
                            value={newProduct.short_description}
                            onChange={(e) => setNewProduct({...newProduct, short_description: e.target.value})}
                            placeholder="Kısa açıklama girin"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Detaylı Açıklama</Label>
                          <Textarea
                            id="description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                            placeholder="Detaylı açıklama girin"
                            rows={3}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="images">Ürün Görselleri</Label>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setShowImageManager(true)}
                            >
                              <Image className="h-4 w-4 mr-2" />
                              Galeri'den Seç
                            </Button>
                          </div>
                          {newProduct.images.map((image, index) => (
                            <div key={index} className="flex gap-2 mt-2">
                              <Input
                                value={image}
                                onChange={(e) => {
                                  const newImages = [...newProduct.images];
                                  newImages[index] = e.target.value;
                                  setNewProduct({...newProduct, images: newImages});
                                }}
                                placeholder="Görsel URL'si girin"
                              />
                              {index === newProduct.images.length - 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setNewProduct({...newProduct, images: [...newProduct.images, ""]})}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              )}
                              {newProduct.images.length > 1 && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newImages = newProduct.images.filter((_, i) => i !== index);
                                    setNewProduct({...newProduct, images: newImages});
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={newProduct.is_featured}
                            onCheckedChange={(checked) => setNewProduct({...newProduct, is_featured: checked})}
                          />
                          <Label htmlFor="featured">Öne Çıkan Ürün</Label>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddProduct(false)}>
                          İptal
                        </Button>
                        <Button onClick={handleAddProduct}>
                          <Save className="h-4 w-4 mr-2" />
                          Ürünü Kaydet
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ürün</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Fiyat</TableHead>
                        <TableHead>Stok</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead className="text-right">İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative group">
                                {product.images && product.images[0] ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-12 h-12 rounded-lg object-cover border"
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/placeholder.jpg';
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center border">
                                    <Image className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  className="absolute -top-1 -right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => {
                                    setEditingProduct(product);
                                    // Focus on image editing
                                    setTimeout(() => {
                                      const imageSection = document.getElementById('edit-images-section');
                                      if (imageSection) {
                                        imageSection.scrollIntoView({ behavior: 'smooth' });
                                      }
                                    }, 100);
                                  }}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.brand}</div>
                                {product.images && product.images.length > 1 && (
                                  <div className="text-xs text-muted-foreground">
                                    +{product.images.length - 1} fotoğraf
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getCategoryName(product.category_id)}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{product.price}₺</div>
                              {product.sale_price && (
                                <div className="text-sm text-muted-foreground line-through">
                                  {product.sale_price}₺
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                              {product.stock_quantity} adet
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={product.is_featured ? "default" : "secondary"}>
                              {product.is_featured ? "Öne Çıkan" : "Normal"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingProduct(product)}
                                title="Ürünü düzenle"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                title="Ürünü sil"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Sipariş Yönetimi
                    </CardTitle>
                    <CardDescription>
                      Gelen siparişleri görüntüleyin ve yönetin
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={loadOrders}>
                      <Database className="h-4 w-4 mr-2" />
                      Yenile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Henüz sipariş bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-l-4 border-l-primary">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                Sipariş #{order.order_number}
                              </CardTitle>
                              <CardDescription>
                                {new Date(order.created_at).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </CardDescription>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant={
                                order.order_status === 'yeni' ? 'default' :
                                order.order_status === 'hazirlaniyor' ? 'secondary' :
                                order.order_status === 'kargoda' ? 'outline' :
                                order.order_status === 'teslim-edildi' ? 'default' : 'destructive'
                              }>
                                {order.order_status === 'yeni' ? 'Yeni' :
                                 order.order_status === 'hazirlaniyor' ? 'Hazırlanıyor' :
                                 order.order_status === 'kargoda' ? 'Kargoda' :
                                 order.order_status === 'teslim-edildi' ? 'Teslim Edildi' : 'İptal'}
                              </Badge>
                              <Badge variant={
                                order.payment_status === 'odendi' ? 'default' :
                                order.payment_status === 'beklemede' ? 'secondary' : 'destructive'
                              }>
                                {order.payment_status === 'odendi' ? 'Ödendi' :
                                 order.payment_status === 'beklemede' ? 'Beklemede' : 'İptal'}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Müşteri Bilgileri */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-semibold">Müşteri Bilgileri</Label>
                              <div className="mt-2 space-y-1 text-sm">
                                <div><strong>Ad Soyad:</strong> {order.customer_name}</div>
                                <div><strong>Telefon:</strong> {order.customer_phone}</div>
                                <div><strong>E-posta:</strong> {order.customer_email}</div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-semibold">Teslimat Adresi</Label>
                              <div className="mt-2 text-sm">
                                <div>{order.customer_address}</div>
                                <div>{order.customer_district}, {order.customer_city}</div>
                                {order.customer_postal_code && (
                                  <div>Posta Kodu: {order.customer_postal_code}</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Sipariş Ürünleri */}
                          <div>
                            <Label className="text-sm font-semibold">Sipariş Ürünleri</Label>
                            <div className="mt-2 space-y-2">
                              {order.order_items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                  <div>
                                    <div className="font-medium">{item.product_name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {item.product_brand} • {item.quantity} adet • {item.product_price}₺/adet
                                    </div>
                                  </div>
                                  <div className="font-semibold">
                                    {item.subtotal}₺
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Ödeme Bilgileri */}
                          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                            <div>
                              <div className="font-semibold">Toplam Tutar</div>
                              <div className="text-sm text-muted-foreground">
                                Ödeme: {
                                  order.payment_method === 'kapida-odeme' ? 'Kapıda Ödeme' :
                                  order.payment_method === 'havale-eft' ? 'Havale/EFT' :
                                  order.payment_method === 'stripe' ? 'Kredi Kartı' : order.payment_method
                                }
                              </div>
                            </div>
                            <div className="text-xl font-bold text-primary">
                              {order.total_amount}₺
                            </div>
                          </div>

                          {/* Notlar */}
                          {order.notes && (
                            <div>
                              <Label className="text-sm font-semibold">Sipariş Notları</Label>
                              <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
                                {order.notes}
                              </div>
                            </div>
                          )}

                          {/* Durum Güncelleme */}
                          <div className="flex gap-4 pt-4 border-t">
                            <div className="flex-1">
                              <Label className="text-sm">Sipariş Durumu</Label>
                              <Select 
                                value={order.order_status} 
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="yeni">Yeni</SelectItem>
                                  <SelectItem value="hazirlaniyor">Hazırlanıyor</SelectItem>
                                  <SelectItem value="kargoda">Kargoda</SelectItem>
                                  <SelectItem value="teslim-edildi">Teslim Edildi</SelectItem>
                                  <SelectItem value="iptal">İptal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1">
                              <Label className="text-sm">Ödeme Durumu</Label>
                              <Select 
                                value={order.payment_status} 
                                onValueChange={(value) => handleUpdatePaymentStatus(order.id, value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="beklemede">Beklemede</SelectItem>
                                  <SelectItem value="odendi">Ödendi</SelectItem>
                                  <SelectItem value="iptal">İptal</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Fotoğraf Yönetimi
                </CardTitle>
                <CardDescription>
                  Site fotoğraflarını görüntüleyin ve yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Input
                      placeholder="Fotoğraf ara..."
                      value={imageSearchQuery}
                      onChange={(e) => setImageSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Yeni Fotoğraf Yükle
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredImages.map((image, index) => (
                      <Card key={index} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img
                            src={image}
                            alt={`Fotoğraf ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/images/placeholder.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => navigator.clipboard.writeText(image)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="secondary">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-2">
                          <p className="text-xs text-muted-foreground truncate">
                            {image.split('/').pop()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Renk Paleti
                  </CardTitle>
                  <CardDescription>
                    Site renklerini özelleştirin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="primary-color">Ana Renk</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="primary-color"
                        type="color"
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                        placeholder="#f97316"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="secondary-color">İkincil Renk</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={siteSettings.secondaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, secondaryColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={siteSettings.secondaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, secondaryColor: e.target.value})}
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="accent-color">Vurgu Rengi</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="accent-color"
                        type="color"
                        value={siteSettings.accentColor}
                        onChange={(e) => setSiteSettings({...siteSettings, accentColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={siteSettings.accentColor}
                        onChange={(e) => setSiteSettings({...siteSettings, accentColor: e.target.value})}
                        placeholder="#3b82f6"
                      />
                    </div>
                  </div>

                  <Button onClick={handleApplyDesignChanges} className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Değişiklikleri Uygula
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Tipografi & İçerik
                  </CardTitle>
                  <CardDescription>
                    Yazı tipleri ve ana içerikleri düzenleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="font-family">Yazı Tipi</Label>
                    <Select value={siteSettings.fontFamily} onValueChange={(value) => setSiteSettings({...siteSettings, fontFamily: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Poppins">Poppins</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="hero-title">Ana Başlık</Label>
                    <Input
                      id="hero-title"
                      value={siteSettings.heroTitle}
                      onChange={(e) => setSiteSettings({...siteSettings, heroTitle: e.target.value})}
                      placeholder="Ana sayfa başlığı"
                    />
                  </div>

                  <div>
                    <Label htmlFor="hero-subtitle">Alt Başlık</Label>
                    <Input
                      id="hero-subtitle"
                      value={siteSettings.heroSubtitle}
                      onChange={(e) => setSiteSettings({...siteSettings, heroSubtitle: e.target.value})}
                      placeholder="Ana sayfa alt başlığı"
                    />
                  </div>

                  <div>
                    <Label htmlFor="site-description">Site Açıklaması</Label>
                    <Textarea
                      id="site-description"
                      value={siteSettings.siteDescription}
                      onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                      placeholder="Site açıklaması"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5" />
                    Sayfa Düzeni
                  </CardTitle>
                  <CardDescription>
                    Sayfa bileşenlerini düzenleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Grid className="h-6 w-6 mb-2" />
                      <span className="text-xs">Grid Düzen</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Layers className="h-6 w-6 mb-2" />
                      <span className="text-xs">Katmanlar</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Square className="h-6 w-6 mb-2" />
                      <span className="text-xs">Bölümler</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Monitor className="h-6 w-6 mb-2" />
                      <span className="text-xs">Önizleme</span>
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label>Responsive Görünüm</Label>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    İletişim Bilgileri
                  </CardTitle>
                  <CardDescription>
                    İletişim bilgilerini güncelleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="contact-phone">Telefon</Label>
                    <Input
                      id="contact-phone"
                      value={siteSettings.contactPhone}
                      onChange={(e) => setSiteSettings({...siteSettings, contactPhone: e.target.value})}
                      placeholder="Telefon numarası"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email">E-posta</Label>
                    <Input
                      id="contact-email"
                      value={siteSettings.contactEmail}
                      onChange={(e) => setSiteSettings({...siteSettings, contactEmail: e.target.value})}
                      placeholder="E-posta adresi"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-address">Adres</Label>
                    <Textarea
                      id="contact-address"
                      value={siteSettings.contactAddress}
                      onChange={(e) => setSiteSettings({...siteSettings, contactAddress: e.target.value})}
                      placeholder="İş adresi"
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleSaveSiteSettings} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Ayarları Kaydet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Veritabanı Yönetimi
                </CardTitle>
                <CardDescription>
                  Veritabanı işlemlerini yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Ürün İstatistikleri</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Toplam Ürün:</span>
                          <Badge>{products.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Stokta Olan:</span>
                          <Badge>{products.filter(p => p.stock_quantity > 0).length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Öne Çıkan:</span>
                          <Badge>{products.filter(p => p.is_featured).length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Kategoriler:</span>
                          <Badge>{categories.length}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Hızlı İşlemler</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full" onClick={loadData}>
                          <Database className="h-4 w-4 mr-2" />
                          Verileri Yenile
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Backup Al
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Zap className="h-4 w-4 mr-2" />
                          Cache Temizle
                        </Button>
                        <Button variant="outline" className="w-full">
                          <Upload className="h-4 w-4 mr-2" />
                          Veri İçe Aktar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  İçerik Yönetimi
                </CardTitle>
                <CardDescription>
                  Site içeriğini düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    İçerik yönetimi özellikleri yakında eklenecek. Sayfa editörü, blog yönetimi ve SEO araçları gelecek.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Sistem Ayarları
                </CardTitle>
                <CardDescription>
                  Genel sistem ayarlarını yönetin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Bakım Modu</Label>
                      <p className="text-sm text-muted-foreground">Siteyi geçici olarak kapatın</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Debug Modu</Label>
                      <p className="text-sm text-muted-foreground">Geliştirici araçlarını etkinleştirin</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Sistem Bilgileri</Label>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Versiyon: 1.0.0</div>
                      <div>Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</div>
                      <div>Veritabanı: Supabase</div>
                      <div>Hosting: Vercel</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Ürün Düzenleme Dialog'u */}
        {editingProduct && (
          <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
            <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Ürün Düzenle: {editingProduct.name}
                </DialogTitle>
                <DialogDescription>
                  Ürün bilgilerini ve fotoğraflarını güncelleyin
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Ürün Adı</Label>
                    <Input
                      id="edit-name"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-brand">Marka</Label>
                    <Input
                      id="edit-brand"
                      value={editingProduct.brand}
                      onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="edit-price">Fiyat (₺)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-sale-price">İndirimli Fiyat (₺)</Label>
                    <Input
                      id="edit-sale-price"
                      type="number"
                      value={editingProduct.sale_price || ""}
                      onChange={(e) => setEditingProduct({...editingProduct, sale_price: e.target.value ? parseFloat(e.target.value) : undefined})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-stock">Stok</Label>
                    <Input
                      id="edit-stock"
                      type="number"
                      value={editingProduct.stock_quantity}
                      onChange={(e) => setEditingProduct({...editingProduct, stock_quantity: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Açıklama</Label>
                  <Textarea
                    id="edit-description"
                    value={editingProduct.description}
                    onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                    rows={3}
                  />
                </div>

                {/* Mevcut Ürün Fotoğrafları */}
                <div id="edit-images-section">
                  <Label className="text-base font-semibold">Mevcut Ürün Fotoğrafları</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    {editingProduct.images && editingProduct.images.length > 0 ? (
                      editingProduct.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border-2 border-border">
                            <img
                              src={image}
                              alt={`${editingProduct.name} - ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setShowImageManager(true)}
                              title="Fotoğrafı değiştir"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newImages = (editingProduct.images || []).filter((_, i) => i !== index);
                                setEditingProduct({...editingProduct, images: newImages});
                              }}
                              title="Fotoğrafı sil"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <Image className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground mb-4">Bu ürünün fotoğrafı yok</p>
                          <Button
                            variant="outline"
                            onClick={() => setShowImageManager(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Fotoğraf Ekle
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Fotoğraf Ekleme Butonları */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowImageManager(true)}
                      className="flex-1"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Galeri'den Seç
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newImages = [...(editingProduct.images || []), ""];
                        setEditingProduct({...editingProduct, images: newImages});
                      }}
                      className="flex-1"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      URL Ekle
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Manuel URL Girişi */}
                {editingProduct.images && editingProduct.images.some(img => img === "") && (
                  <div>
                    <Label>Yeni Fotoğraf URL'leri</Label>
                    <div className="space-y-2 mt-2">
                      {editingProduct.images.map((image, index) => (
                        image === "" && (
                          <div key={index} className="flex gap-2">
                            <Input
                              value={image}
                              onChange={(e) => {
                                const newImages = [...(editingProduct.images || [])];
                                newImages[index] = e.target.value;
                                setEditingProduct({...editingProduct, images: newImages});
                              }}
                              placeholder="Fotoğraf URL'si girin"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newImages = (editingProduct.images || []).filter((_, i) => i !== index);
                                setEditingProduct({...editingProduct, images: newImages});
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-featured"
                    checked={editingProduct.is_featured}
                    onCheckedChange={(checked) => setEditingProduct({...editingProduct, is_featured: checked})}
                  />
                  <Label htmlFor="edit-featured">Öne Çıkan Ürün</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProduct(null)}>
                  İptal
                </Button>
                <Button onClick={() => handleUpdateProduct(editingProduct)}>
                  <Save className="h-4 w-4 mr-2" />
                  Güncelle
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Fotoğraf Yöneticisi Dialog'u */}
        <Dialog open={showImageManager} onOpenChange={setShowImageManager}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Fotoğraf Galerisi</DialogTitle>
              <DialogDescription>
                Ürün için fotoğraf seçin
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="grid grid-cols-4 gap-4 p-4">
                {availableImages.map((image, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer border-2 rounded-lg overflow-hidden ${
                      selectedImages.includes(image) ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => {
                      if (selectedImages.includes(image)) {
                        setSelectedImages(selectedImages.filter(img => img !== image));
                      } else {
                        setSelectedImages([...selectedImages, image]);
                      }
                    }}
                  >
                    <img
                      src={image}
                      alt={`Fotoğraf ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    {selectedImages.includes(image) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowImageManager(false);
                setSelectedImages([]);
              }}>
                İptal
              </Button>
              <Button onClick={() => {
                if (editingProduct) {
                  // Düzenleme modunda
                  setEditingProduct({
                    ...editingProduct,
                    images: [...(editingProduct.images || []).filter(img => img.trim() !== ""), ...selectedImages]
                  });
                } else {
                  // Yeni ürün ekleme modunda
                  setNewProduct({
                    ...newProduct,
                    images: [...newProduct.images.filter(img => img.trim() !== ""), ...selectedImages]
                  });
                }
                setShowImageManager(false);
                setSelectedImages([]);
              }}>
                Seçilenleri Ekle ({selectedImages.length})
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}