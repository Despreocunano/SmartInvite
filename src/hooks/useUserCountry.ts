import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getPricingForCountry, formatPrice } from '../lib/pricing';

export function useUserCountry() {
  const { user } = useAuth();
  const [country, setCountry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pricing, setPricing] = useState<any>(null);

  useEffect(() => {
    const fetchUserCountry = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('country')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user country:', error);
          setCountry('default');
        } else {
          setCountry(data?.country || 'default');
        }
      } catch (error) {
        console.error('Error fetching user country:', error);
        setCountry('default');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCountry();
  }, [user?.id]);

  useEffect(() => {
    if (country) {
      const userPricing = getPricingForCountry(country);
      setPricing({
        ...userPricing,
        formattedPrice: formatPrice(userPricing.amount, userPricing.currency, userPricing.symbol)
      });
    }
  }, [country]);

  return {
    country,
    pricing,
    loading
  };
} 