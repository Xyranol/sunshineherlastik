import { useState, useEffect } from "react";
import { useAdminAuth, useAdminOrders } from "@/hooks/useAdmin";
import { AdminLogin } from "@/components/AdminLogin";
import { AdminProductManager } from "@/components/AdminProductManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice, ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib";
import { LogOut, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { springPresets, fadeInUp } from "@/lib/motion";

export default function Admin() {
  const { isAuthenticated, isLoading: authLoading, logout } = useAdminAuth();
  const { orders, updateOrderStatus, updatePaymentStatus } = useAdminOrders();
  const [activeTab, setActiveTab] = useState("products");

  const handleLoginSuccess = () => {
    window.location.reload();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.gentle}
        >
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Admin Paneli</CardTitle>
              <CardDescription>Yönetim paneline erişmek için giriş yapın</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminLogin onLoginSuccess={handleLoginSuccess} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === "yeni").length;
  const totalRevenue = orders
    .filter(o => o.paymentStatus === "odendi")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={springPresets.snappy}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Yönetim Paneli</h1>
            <p className="text-muted-foreground mt-1">Sunshine Herlastik Admin</p>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Çıkış Yap
          </Button>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={springPresets.gentle}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Sipariş
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bekleyen Sipariş
              </CardTitle>
              <Package className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Toplam Gelir
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springPresets.gentle, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="products">Ürün Yönetimi</TabsTrigger>
              <TabsTrigger value="orders">Sipariş Yönetimi</TabsTrigger>
              <TabsTrigger value="developer">Developer Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Ürünler</CardTitle>
                  <CardDescription>
                    Ürün ekleyin, düzenleyin veya silin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AdminProductManager />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Siparişler</CardTitle>
                  <CardDescription>
                    Sipariş durumlarını yönetin ve takip edin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      Henüz sipariş bulunmuyor
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Sipariş No</TableHead>
                            <TableHead>Müşteri</TableHead>
                            <TableHead>Tutar</TableHead>
                            <TableHead>Ödeme Durumu</TableHead>
                            <TableHead>Sipariş Durumu</TableHead>
                            <TableHead>Tarih</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">
                                {order.orderNumber}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.customerInfo.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {order.customerInfo.phone}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {formatPrice(order.totalAmount)}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.paymentStatus}
                                  onValueChange={(value) =>
                                    updatePaymentStatus(
                                      order.id,
                                      value as typeof order.paymentStatus
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(PAYMENT_STATUSES).map(([key, label]) => (
                                      <SelectItem key={key} value={key}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={order.orderStatus}
                                  onValueChange={(value) =>
                                    updateOrderStatus(
                                      order.id,
                                      value as typeof order.orderStatus
                                    )
                                  }
                                >
                                  <SelectTrigger className="w-[140px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {Object.entries(ORDER_STATUSES).map(([key, label]) => (
                                      <SelectItem key={key} value={key}>
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="developer" className="space-y-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Developer Mode
                  </CardTitle>
                  <CardDescription>
                    Site yönetimi ve geliştirici araçları
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ürün Konumları</CardTitle>
                        <CardDescription>
                          Ürünlerin site içindeki konumlarını düzenleyin
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full">
                          Konum Yöneticisini Aç
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Site Ayarları</CardTitle>
                        <CardDescription>
                          Genel site ayarlarını düzenleyin
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          Ayarları Düzenle
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Veritabanı</CardTitle>
                        <CardDescription>
                          Veritabanı işlemlerini yönetin
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          Veritabanı Yöneticisi
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Bölüm Ekle</CardTitle>
                        <CardDescription>
                          Siteye yeni bölümler ekleyin
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button variant="outline" className="w-full">
                          Bölüm Oluştur
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Hızlı İşlemler</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        Cache Temizle
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        Logları Görüntüle
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        Backup Al
                      </Badge>
                      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                        Site Harita
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}