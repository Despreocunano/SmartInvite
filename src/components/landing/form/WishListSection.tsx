import { CardContent } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { FieldErrors } from 'react-hook-form';
import { Utensils, Plane, Home, Umbrella, Gift, Heart, Plus, Trash2, PawPrint, Building2, GraduationCap, Baby, Users, TreePine, Stethoscope, Car, BookOpen, Camera, Music } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Icon options for wedding wishes with social impact
const ICON_OPTIONS = [
  { value: 'dinner', label: 'Cena', icon: <Utensils size={16} /> },
  { value: 'trip', label: 'Viaje', icon: <Plane size={16} /> },
  { value: 'home', label: 'Casa', icon: <Home size={16} /> },
  { value: 'vacation', label: 'Vacaciones', icon: <Umbrella size={16} /> },
  { value: 'gift', label: 'Regalo', icon: <Gift size={16} /> },
  { value: 'love', label: 'Amor', icon: <Heart size={16} /> },
  { value: 'pets', label: 'Mascotas', icon: <PawPrint size={16} /> },
  { value: 'education', label: 'Educación', icon: <GraduationCap size={16} /> },
  { value: 'children', label: 'Niños', icon: <Baby size={16} /> },
  { value: 'community', label: 'Comunidad', icon: <Users size={16} /> },
  { value: 'environment', label: 'Medio Ambiente', icon: <TreePine size={16} /> },
  { value: 'transport', label: 'Transporte', icon: <Car size={16} /> },
  { value: 'books', label: 'Libros', icon: <BookOpen size={16} /> },
  { value: 'photography', label: 'Fotografía', icon: <Camera size={16} /> },
  { value: 'music', label: 'Música', icon: <Music size={16} /> },
];

export interface WishListItem {
  id?: string;
  name: string;
  price?: number;
  icon: string;
}

interface WishListSectionProps {
  value: WishListItem[];
  onChange: (items: WishListItem[]) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  errors?: FieldErrors;
  onSaved?: () => void;
}

export function WishListSection({ value, onChange, enabled, onEnabledChange, errors, onSaved }: WishListSectionProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation('landing');

  const formatPriceInput = (value: string) => {
    // Remove all non-digit characters
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    
    // Format with dots as thousands separator
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parsePriceInput = (value: string) => {
    // Remove dots and convert to number
    const cleanValue = value.replace(/\./g, '');
    return cleanValue ? Number(cleanValue) : undefined;
  };

  const handleAdd = () => {
    onChange([...value, { name: '', price: undefined, icon: 'gift' }]);
  };

  const handleRemove = (idx: number) => {
    const newList = value.slice();
    newList.splice(idx, 1);
    onChange(newList);
  };

  const handleChange = (idx: number, field: keyof WishListItem, fieldValue: any) => {
    const newList = value.slice();
    newList[idx] = { ...newList[idx], [field]: fieldValue };
    onChange(newList);
  };

  const handlePriceChange = (idx: number, value: string) => {
    const formattedValue = formatPriceInput(value);
    const numericValue = parsePriceInput(formattedValue);
    handleChange(idx, 'price', numericValue);
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error(t('wishlist_login_required', 'Debes iniciar sesión para guardar tu lista de deseos'));
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
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        
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
          
          // Actualizar el ID en el estado local
          value[i] = { ...item, id: existingItemsArray[i].id };
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
          
          // Actualizar el ID en el estado local
          value[i] = { ...item, id: newItem.id };
        }
      }
      
      // Eliminar registros sobrantes si hay menos items que antes
      if (value.length < existingItemsArray.length) {
        const itemsToDelete = existingItemsArray.slice(value.length);
        for (const item of itemsToDelete) {
          const { error } = await supabase
            .from('wish_list_items')
            .delete()
            .eq('id', item.id);
          
          if (error) throw error;
        }
      }
      
      // Actualizar el estado con los IDs
      onChange([...value]);
      
      toast.success(t('wishlist_saved', 'Lista guardada'));
      if (onSaved) onSaved();
    } catch (err) {
      toast.error(t('wishlist_save_error', 'Error al guardar la lista'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // Ejemplos de regalos
  const EXAMPLE_GIFTS: WishListItem[] = [
    { name: 'Set de copas', price: 25000, icon: 'gift' },
    { name: 'Cena romántica', price: 40000, icon: 'dinner' },
    { name: 'Aporte luna de miel', price: 60000, icon: 'trip' },
    { name: 'Robot de cocina', price: 120000, icon: 'home' },
  ];

  const handleAddExamples = async () => {
    if (!user?.id) {
      toast.error(t('wishlist_login_required', 'Debes iniciar sesión para agregar ejemplos'));
      return;
    }
    setSaving(true);
    try {
      const newItems = [];
      for (const item of EXAMPLE_GIFTS) {
        const { data: newItem, error } = await supabase
          .from('wish_list_items')
          .insert({
            user_id: user.id,
            name: item.name,
            price: item.price,
            icon: item.icon
          })
          .select('id, name, price, icon')
          .single();
        if (error) throw error;
        newItems.push(newItem);
      }
      onChange([...value, ...newItems]);
      toast.success(t('wishlist_examples_added', 'Ejemplos agregados'));
    } catch (err) {
      toast.error(t('wishlist_examples_error', 'Error al agregar ejemplos'));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="">
      <CardContent className="p-0 pt-6">
        {enabled && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{t('wishlist_helper')}</p>
            <p className="text-sm text-gray-500 font-bold italic">{t('wishlist_service_fee')}</p>
            {value.length === 0 && (
              <div className="text-sm text-gray-400 italic">{t('wishlist_empty')}</div>
            )}
            {/* Botón para agregar ejemplos */}
            {(value.length === 0 || value.length < 3) && (
              <button
                type="button"
                className="mb-2 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700 transition"
                onClick={handleAddExamples}
                disabled={saving}
              >
                {saving ? t('wishlist_adding') : t('wishlist_add_examples')}
              </button>
            )}
            {value.map((item, idx) => (
              <div
                key={idx}
                className="border rounded-lg p-3 relative bg-gray-50 hover:shadow-sm transition-shadow group"
              >
                {/* Header with icon selector and remove button */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0 relative">
                    <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1 relative">
                      {ICON_OPTIONS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`p-1.5 rounded-md border transition-all duration-150 flex-shrink-0 ${
                            item.icon === opt.value 
                              ? 'bg-rose-100 border-rose-400 text-rose-600 scale-105 shadow-sm' 
                              : 'bg-white border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                          }`}
                          onClick={() => handleChange(idx, 'icon', opt.value)}
                          aria-label={opt.label}
                          title={opt.label}
                        >
                          {opt.icon}
                        </button>
                      ))}
                    </div>
                    {/* Gradient indicator for scroll */}
                    <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                  </div>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-rose-500 transition-colors p-1 flex-shrink-0 ml-2"
                    onClick={() => handleRemove(idx)}
                    title="Eliminar deseo"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Name */}
                  <div className="md:col-span-1">
                    <Input
                      label={t('wishlist_name_label')}
                      value={item.name}
                      onChange={e => handleChange(idx, 'name', e.target.value)}
                      error={((errors?.[idx] as any)?.name?.message) || undefined}
                      placeholder={t('wishlist_name_placeholder')}
                    />
                  </div>
                  {/* Price */}
                  <div className="md:col-span-1">
                    <Input
                      label={t('wishlist_price_label')}
                      type="text"
                      value={item.price ? formatPriceInput(item.price.toString()) : ''}
                      onChange={e => handlePriceChange(idx, e.target.value)}
                      error={((errors?.[idx] as any)?.price?.message) || undefined}
                      placeholder={t('wishlist_price_placeholder')}
                    />
                  </div>
                </div>
              </div>
            ))}
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 bg-rose-600 text-white rounded-lg shadow-sm hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                onClick={handleAdd}
                disabled={saving}
              >
                <Plus size={16} /> {t('wishlist_add')}
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-primary text-white rounded-lg shadow-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                onClick={handleSave}
                disabled={!enabled || saving}
              >
                {saving ? t('wishlist_saving') : t('wishlist_save')}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </div>
  );
} 