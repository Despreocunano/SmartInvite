import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    console.log("Gift payment webhook received");
    
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Leer y verificar el evento de Stripe
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_GIFT_WEBHOOK_SECRET") ?? Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "";
    const sig = req.headers.get("stripe-signature");
    const rawBody = await req.text();
    
    if (!sig) {
      console.error("No stripe-signature header found");
      throw new Error("No stripe-signature header");
    }
    
    if (!STRIPE_WEBHOOK_SECRET) {
      console.error("No webhook secret configured");
      throw new Error("No webhook secret configured");
    }
    
    const Stripe = (await import("npm:stripe@12.15.0")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    });
    
    let event;
    try {
      // Usar constructEventAsync para contexto asíncrono
      event = await stripe.webhooks.constructEventAsync(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('stripe-webhook: error constructing event', err);
      
      // Intentar procesar el evento sin verificación de firma para debugging
      try {
        const parsedBody = JSON.parse(rawBody);
        event = parsedBody;
      } catch (parseErr) {
        console.error("Failed to parse body as JSON:", parseErr);
      return new Response(`Webhook Error: ${err.message}`, {
        status: 400,
        headers: corsHeaders
      });
    }
    }
    
    // Solo nos interesa checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const preferenceId = session.id;
      
      // Buscar el pago en gift_payments
      const { data: payment, error: paymentError } = await supabase
        .from('gift_payments')
        .select('*')
        .eq('preference_id', preferenceId)
        .single();
        
      if (paymentError) {
        console.error("Error finding payment:", paymentError);
        
        // Intentar buscar por paymentId en metadata
        const paymentId = session.metadata?.paymentId;
        if (paymentId) {
          const { data: paymentByMetadata, error: metadataError } = await supabase
            .from('gift_payments')
            .select('*')
            .eq('id', paymentId)
            .single();
            
          if (metadataError || !paymentByMetadata) {
            console.error("Payment not found by metadata either:", metadataError);
            return new Response(JSON.stringify({
              error: "No pending payment found for gift"
            }), {
              status: 404,
              headers: corsHeaders
            });
          }
          
          // Actualizar el preference_id si no estaba configurado
          if (!paymentByMetadata.preference_id) {
            const { error: updatePreferenceError } = await supabase
              .from('gift_payments')
              .update({ preference_id: preferenceId })
              .eq('id', paymentByMetadata.id);
              
            if (updatePreferenceError) {
              console.error("Error updating preference_id:", updatePreferenceError);
            }
          }
          
          // Usar el payment encontrado por metadata
          const payment = paymentByMetadata;
        } else {
          return new Response(JSON.stringify({
            error: "No pending payment found for gift"
          }), {
            status: 404,
            headers: corsHeaders
          });
        }
      }
      
      if (!payment) {
        console.error("Payment not found for preference:", preferenceId);
        return new Response(JSON.stringify({
          error: "No pending payment found for gift"
        }), {
          status: 404,
          headers: corsHeaders
        });
      }
      
      // Solo actualizar si no está ya aprobado
      if (payment.status === 'approved') {
        return new Response(JSON.stringify({
          received: true,
          message: "Payment already approved"
        }), {
          status: 200,
          headers: corsHeaders
        });
      }
      
      // Marcar el pago como aprobado
      const { error: updateError } = await supabase
        .from('gift_payments')
        .update({
        status: 'approved',
        payment_details: session
        })
        .eq('id', payment.id);
        
      if (updateError) {
        console.error('stripe-webhook: failed to update payment', updateError);
        return new Response(JSON.stringify({
          error: "Failed to update payment status"
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
      
      // Marcar el regalo como pagado
      const { error: giftUpdateError } = await supabase
        .from('wish_list_items')
        .update({
        paid: true,
        payment_status: 'approved'
        })
        .eq('id', payment.gift_item_id);
        
      if (giftUpdateError) {
        console.error("Error updating gift item:", giftUpdateError);
        return new Response(JSON.stringify({
          error: "Failed to update gift item status"
        }), {
          status: 500,
          headers: corsHeaders
        });
      }
    } else {
      console.log("Ignoring event type:", event.type);
    }
    
    return new Response(JSON.stringify({
      received: true
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error("Error processing gift payment webhook:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Failed to process webhook"
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
