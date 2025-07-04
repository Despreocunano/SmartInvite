import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
import { z } from "npm:zod@3.22.4";
// Función pública para pagos de regalos - sin autenticación requerida
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
const createGiftPaymentSchema = z.object({
  itemId: z.string().uuid(),
  amount: z.number().positive(),
  buyerEmail: z.string().email(),
  buyerName: z.string().min(1),
  returnUrl: z.string().url().optional() // URL de la página de invitación
});
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    const body = await req.json();
    const { itemId, amount, buyerEmail, buyerName, returnUrl } = createGiftPaymentSchema.parse(body);
    
    // Verificar que el item existe
    const { data: giftItem, error: giftError } = await supabase.from('wish_list_items').select('id, name, paid').eq('id', itemId).single();
    if (giftError || !giftItem) {
      throw new Error("Gift item not found");
    }
    if (giftItem.paid) {
      throw new Error("This gift has already been paid");
    }
    
    // Crear registro en gift_payments
    const { data: payment, error: paymentError } = await supabase.from('gift_payments').insert({
      gift_item_id: itemId,
      amount: amount,
      status: 'pending'
    }).select().single();
    if (paymentError) {
      console.error("Error creating gift payment record:", paymentError);
      throw new Error(`Error creating payment record: ${paymentError.message}`);
    }
    
    // Crear sesión de Stripe Checkout
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const Stripe = (await import("npm:stripe@12.15.0")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    });
    
    // Usar la URL de retorno proporcionada o la URL por defecto
    const baseUrl = returnUrl || "https://app.tuparte.digital";
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "clp",
            product_data: {
              name: `Regalo: ${giftItem.name}`
            },
            unit_amount: amount
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${baseUrl}?payment=success&type=gift&item_id=${itemId}`,
      cancel_url: `${baseUrl}?payment=cancelled&type=gift&item_id=${itemId}`,
      customer_email: buyerEmail,
      metadata: {
        itemId,
        paymentId: payment.id,
        buyerName,
        returnUrl: returnUrl || ""
      }
    });
    
    // Guardar el session.id de Stripe en preference_id
    const { error: updateError } = await supabase.from('gift_payments').update({
      preference_id: session.id
    }).eq('id', payment.id);
    if (updateError) {
      console.error("Error updating payment record:", updateError);
      throw new Error(`Error updating payment record: ${updateError.message}`);
    }
    
    return new Response(JSON.stringify({
      success: true,
      preferenceId: session.id,
      initPoint: session.url
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error creating gift payment:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Failed to create gift payment"
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
