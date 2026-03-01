import { useState } from "react";
import { useAdminProducts } from "@/hooks/useAdmin";
import { Product, TIRE_BRANDS, WHEEL_BRANDS, BATTERY_BRANDS, SEASONS, formatPrice } from "@/lib";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { motion } from "framer-motion";
import { springPresets } from "@/lib/motion";

interface AdminProductManagerProps {
  className?: string;
}

export function AdminProductManager({ className }: AdminProductManagerProps) {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useAdminProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    brand: "",
    category: "lastik",
    price: 0,
    oldPrice: undefined,
    image: "",
    description: "",
    specifications: {},
    stock: 0,
    featured: false,
  });

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
    } else {
      setEditingProduct(null);
      setFormData({
        name: "",
        brand: "",
        category: "lastik",
        price: 0,
        oldPrice: undefined,
        image: "",
        description: "",
        specifications: {},
        stock: 0,
        featured: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProduct) {
      updateProduct(editingProduct.id, formData);
    } else {
      addProduct(formData as Omit<Product, "id" | "createdAt" | "updatedAt">);
    }
    
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu ürünü silmek istediğinizden emin misiniz?")) {
      deleteProduct(id);
    }
  };

  const getBrandOptions = (): readonly string[] => {
    switch (formData.category) {
      case "lastik":
        return TIRE_BRANDS;
      case "jant":
        return WHEEL_BRANDS;
      case "aku":
        return BATTERY_BRANDS;
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Ürün Yönetimi</CardTitle>
              <CardDescription>Lastik, jant ve akü ürünlerini yönetin</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Yeni Ürün Ekle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
                  </DialogTitle>
                  <DialogDescription>
                    Ürün bilgilerini doldurun ve kaydedin
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ürün Adı *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Kategori *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value: "lastik" | "jant" | "aku") =>
                          setFormData({ ...formData, category: value, brand: "" })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lastik">Lastik</SelectItem>
                          <SelectItem value="jant">Jant</SelectItem>
                          <SelectItem value="aku">Akü</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Marka *</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) => setFormData({ ...formData, brand: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Marka seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {getBrandOptions().map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stok Adedi *</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Fiyat (₺) *</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="oldPrice">Eski Fiyat (₺)</Label>
                      <Input
                        id="oldPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.oldPrice || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            oldPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Görsel URL *</Label>
                    <Input
                      id="image"
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Açıklama *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  {formData.category === "lastik" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Lastik Özellikleri</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="width">Genişlik</Label>
                          <Input
                            id="width"
                            value={formData.specifications?.width || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, width: e.target.value },
                              })
                            }
                            placeholder="205"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aspectRatio">Yükseklik Oranı</Label>
                          <Input
                            id="aspectRatio"
                            value={formData.specifications?.aspectRatio || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, aspectRatio: e.target.value },
                              })
                            }
                            placeholder="55"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="diameter">Çap</Label>
                          <Input
                            id="diameter"
                            value={formData.specifications?.diameter || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, diameter: e.target.value },
                              })
                            }
                            placeholder="16"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="season">Mevsim</Label>
                          <Select
                            value={formData.specifications?.season || "none"}
                            onValueChange={(value) =>
                              setFormData({
                                ...formData,
                                specifications: {
                                  ...formData.specifications,
                                  season: value === "none" ? undefined : (value as "yaz" | "kis" | "dort-mevsim"),
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Seçiniz</SelectItem>
                              <SelectItem value="yaz">Yaz</SelectItem>
                              <SelectItem value="kis">Kış</SelectItem>
                              <SelectItem value="dort-mevsim">4 Mevsim</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-2 pt-8">
                          <Switch
                            id="runFlat"
                            checked={formData.specifications?.runFlat || false}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, runFlat: checked },
                              })
                            }
                          />
                          <Label htmlFor="runFlat">Run Flat</Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.category === "jant" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Jant Özellikleri</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="size">Boyut</Label>
                          <Input
                            id="size"
                            value={formData.specifications?.size || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, size: e.target.value },
                              })
                            }
                            placeholder="17x7.5"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="material">Malzeme</Label>
                          <Input
                            id="material"
                            value={formData.specifications?.material || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, material: e.target.value },
                              })
                            }
                            placeholder="Alüminyum"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.category === "aku" && (
                    <div className="space-y-4">
                      <h3 className="font-semibold">Akü Özellikleri</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="capacity">Kapasite</Label>
                          <Input
                            id="capacity"
                            value={formData.specifications?.capacity || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, capacity: e.target.value },
                              })
                            }
                            placeholder="60Ah"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="voltage">Voltaj</Label>
                          <Input
                            id="voltage"
                            value={formData.specifications?.voltage || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                specifications: { ...formData.specifications, voltage: e.target.value },
                              })
                            }
                            placeholder="12V"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured || false}
                      onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                    />
                    <Label htmlFor="featured">Öne Çıkan Ürün</Label>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      İptal
                    </Button>
                    <Button type="submit">
                      {editingProduct ? "Güncelle" : "Ekle"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Henüz ürün eklenmemiş</p>
              <p className="text-sm text-muted-foreground mt-1">Yeni ürün eklemek için yukarıdaki butona tıklayın</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ürün</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Marka</TableHead>
                    <TableHead>Fiyat</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={springPresets.gentle}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.featured && (
                              <Badge variant="secondary" className="mt-1">
                                Öne Çıkan
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-semibold">{formatPrice(product.price)}</div>
                          {product.oldPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatPrice(product.oldPrice)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock} adet
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.stock > 0 ? "default" : "secondary"}>
                          {product.stock > 0 ? "Stokta" : "Tükendi"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
