import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// Stripe API key (usa tu secret key real en producción)
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // Parse body
    const { amount, description, userId, wishId } = await req.json();
    // Validación básica
    if (!amount || !description || !userId) {
      return new Response(JSON.stringify({
        error: "Faltan datos requeridos"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Crea el PaymentIntent usando la API REST de Stripe
    const stripeRes = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        amount: String(amount * 100),
        currency: "clp",
        description,
        ...userId ? {
          "metadata[userId]": userId
        } : {},
        ...wishId ? {
          "metadata[wishId]": wishId
        } : {},
        "automatic_payment_methods[enabled]": "true"
      })
    });
    const stripeData = await stripeRes.json();
    if (!stripeData.client_secret) {
      throw new Error(stripeData.error?.message || "No se pudo crear el PaymentIntent");
    }
    // (Opcional) Guarda el intento de pago en tu base de datos aquí si lo deseas
    return new Response(JSON.stringify({
      clientSecret: stripeData.client_secret
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error creando PaymentIntent:", error);
    return new Response(JSON.stringify({
      error: error.message || "Error desconocido"
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
