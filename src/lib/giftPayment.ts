import { supabase } from './supabase';

export async function createGiftPayment(itemId: string, amount: number, buyerEmail: string, buyerName: string, returnUrl?: string) {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-gift-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId,
        amount,
        buyerEmail,
        buyerName,
        returnUrl
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Error al crear el pago del regalo'
      };
    }

    return {
      success: true,
      preferenceId: data.preferenceId,
      initPoint: data.initPoint
    };
  } catch (error) {
    console.error('Error creating gift payment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

export async function checkGiftPaymentStatus(preferenceId: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-gift-payment-status?preference_id=${preferenceId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Error al verificar el estado del pago del regalo'
      };
    }

    return {
      success: true,
      payment: data.payment,
      giftItem: data.giftItem
    };
  } catch (error) {
    console.error('Error checking gift payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
} 