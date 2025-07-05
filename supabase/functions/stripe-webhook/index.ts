import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
serve(async (req)=>{
  console.log('stripe-webhook: received request');
  
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  let event;
  try {
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();
    console.log('stripe-webhook: raw body length:', rawBody.length);
    console.log('stripe-webhook: signature header:', sig ? 'present' : 'missing');
    
    if (!sig) throw new Error("No stripe-signature header");
    const Stripe = (await import("npm:stripe@12.15.0")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    });
    event = await stripe.webhooks.constructEventAsync(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    console.log('stripe-webhook: event constructed successfully, type:', event.type);
  } catch (err) {
    console.error('stripe-webhook: error', err);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
      headers: corsHeaders
    });
  }
  // Solo nos interesa checkout.session.completed
  if (event.type === "checkout.session.completed") {
    console.log('stripe-webhook: processing checkout.session.completed');
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const paymentId = session.metadata?.paymentId;
    const itemId = session.metadata?.itemId; // Para pagos de regalos
    
    console.log('stripe-webhook: session metadata:', {
      userId,
      paymentId,
      itemId,
      allMetadata: session.metadata
    });
    
    // Si es un pago de regalo (tiene itemId pero no userId), ignorarlo
    if (itemId && !userId) {
      return new Response(JSON.stringify({
        received: true,
        message: "Gift payment ignored, handled by gift-payment-webhook"
      }), {
        status: 200,
        headers: corsHeaders
      });
    }
    
    if (!userId) {
      return new Response(JSON.stringify({
        error: "No userId in session metadata"
      }), {
        status: 400,
        headers: corsHeaders
      });
    }
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let payment;
    let findError;
    if (paymentId) {
      console.log('stripe-webhook: searching payment by paymentId:', paymentId);
      // Buscar el pago por id (que es el paymentId)
      ({ data: payment, error: findError } = await supabase.from('payments').select('*').eq('id', paymentId).maybeSingle());
    } else {
      console.log('stripe-webhook: searching payment by userId and type:', userId);
      // Fallback: buscar por userId, tipo y pendiente
      ({ data: payment, error: findError } = await supabase.from('payments').select('*').eq('user_id', userId).eq('type', 'publication').eq('status', 'pending').order('created_at', {
        ascending: false
      }).limit(1).maybeSingle());
    }
    
    console.log('stripe-webhook: payment search result:', {
      found: !!payment,
      error: findError,
      paymentId: payment?.id,
      status: payment?.status
    });
    if (findError || !payment) {
      console.error('stripe-webhook: payment not found', { paymentId, userId });
      return new Response(JSON.stringify({
        error: "No pending payment found for user"
      }), {
        status: 404,
        headers: corsHeaders
      });
    }
    console.log('stripe-webhook: updating payment status to approved for payment:', payment.id);
    const { error: updateError } = await supabase.from('payments').update({
      status: 'approved',
      payment_details: session
    }).eq('id', payment.id);
    if (updateError) {
      console.error('stripe-webhook: failed to update payment', updateError);
      return new Response(JSON.stringify({
        error: "Failed to update payment status"
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
    console.log('stripe-webhook: payment status updated successfully');
  // (Opcional) Publicar la invitación automáticamente
  // await supabase.from('landing_pages').update({ published_at: new Date().toISOString() }).eq('user_id', userId);
  }
  return new Response(JSON.stringify({
    received: true
  }), {
    status: 200,
    headers: corsHeaders
  });
});
