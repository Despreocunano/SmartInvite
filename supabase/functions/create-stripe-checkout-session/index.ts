import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders
    });
  }
  try {
    const { userId, price, successUrl, cancelUrl, paymentId } = await req.json();
    const Stripe = (await import("npm:stripe@12.15.0")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: [
        "card"
      ],
      line_items: [
        {
          price_data: {
            currency: "clp",
            product_data: {
              name: "Publicación de invitación digital"
            },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        paymentId
      }
    });
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
