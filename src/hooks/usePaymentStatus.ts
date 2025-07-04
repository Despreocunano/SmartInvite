import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function usePaymentStatus() {
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!user) {
        setIsPaid(false);
        setLoading(false);
        return;
      }

      try {
        // Verificar si el usuario tiene un pago aprobado
        const { data: payments, error } = await supabase
          .from('payments')
          .select('status, type, amount')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) {
          console.error('Error checking payment status:', error);
          setIsPaid(false);
        } else {
          // Si hay al menos un pago aprobado, el usuario está pagado
          setIsPaid(payments && payments.length > 0);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setIsPaid(false);
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [user]);

  return { isPaid, loading };
} 