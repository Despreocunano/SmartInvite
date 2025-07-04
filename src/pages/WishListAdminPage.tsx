import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { WishListSection, WishListItem } from '../components/landing/form/WishListSection';
import toast from 'react-hot-toast';

function WishListSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="border rounded-lg p-0 bg-white">
        <div className="pt-6 px-6 space-y-4">
          <div className="h-4 w-80 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-96 bg-gray-100 rounded animate-pulse mb-4"></div>
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse mb-6"></div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-3 bg-gray-50 mb-2">
              {/* Icon selector skeleton */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex gap-1">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="w-7 h-7 rounded-md border bg-gray-200 animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse ml-2"></div>
              </div>
              {/* Inputs skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-1">
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
                <div className="md:col-span-1">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-10 w-full bg-gray-100 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2 pb-6">
            <div className="px-4 py-2 bg-rose-200 rounded-lg w-40 h-10 animate-pulse"></div>
            <div className="px-4 py-2 bg-primary/30 rounded-lg w-40 h-10 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WishListAdminPage() {
  const { t } = useTranslation('features');
  const { user } = useAuth();
  const [wishList, setWishList] = useState<WishListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const fetchWishList = async () => {
      if (!user?.id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('wish_list_items')
        .select('id, name, price, icon')
        .eq('user_id', user.id)
        .order('created_at');
      if (error) {
        toast.error(t('wishlist.loading_error'));
      } else {
        setWishList(data || []);
      }
      setLoading(false);
    };
    fetchWishList();
  }, [user, t]);

  const handleChange = (items: WishListItem[]) => {
    setWishList(items);
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error(t('wishlist.login_required'));
      return;
    }
    setSaving(true);
    try {
      // Obtener los registros existentes para mantener los UUIDs
      const { data: existingItems } = await supabase
        .from('wish_list_items')
        .select('id, name, price, icon')
        .eq('user_id', user.id)
        .order('created_at');
      const existingItemsArray = existingItems || [];
      // Actualizar o insertar cada item
      for (let i = 0; i < wishList.length; i++) {
        const item = wishList[i];
        if (i < existingItemsArray.length) {
          // Actualizar registro existente
          const { error } = await supabase
            .from('wish_list_items')
            .update({
              name: item.name,
              price: item.price ?? null,
              icon: item.icon
            })
            .eq('id', existingItemsArray[i].id);
          if (error) throw error;
          wishList[i] = { ...item, id: existingItemsArray[i].id };
        } else {
          // Insertar nuevo registro
          const { data: newItem, error } = await supabase
            .from('wish_list_items')
            .insert({
              user_id: user.id,
              name: item.name,
              price: item.price ?? null,
              icon: item.icon
            })
            .select('id')
            .single();
          if (error) throw error;
          wishList[i] = { ...item, id: newItem.id };
        }
      }
      // Eliminar registros sobrantes si hay menos items que antes
      if (wishList.length < existingItemsArray.length) {
        const itemsToDelete = existingItemsArray.slice(wishList.length);
        for (const item of itemsToDelete) {
          const { error } = await supabase
            .from('wish_list_items')
            .delete()
            .eq('id', item.id);
          if (error) throw error;
        }
      }
      setWishList([...wishList]);
      toast.success(t('wishlist.save_success'));
    } catch (err) {
      toast.error(t('wishlist.save_error'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto max-w-full overflow-x-hidden">
      <div className="max-w-6xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('wishlist.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <WishListSkeleton />
            ) : (
              <WishListSection
                value={wishList}
                onChange={handleChange}
                enabled={enabled}
                onEnabledChange={setEnabled}
                errors={{}}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 