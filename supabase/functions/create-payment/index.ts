import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
// MercadoPago SDK
import { MercadoPagoConfig, Preference } from "npm:mercadopago@2.0.6";
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    // Get auth token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    // Initialize Supabase client with service role key
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // Verify the user's JWT and get their ID
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !user) {
      throw new Error("Unauthorized");
    }
    // Check if user already has an approved payment
    const { data: existingPayment, error: paymentCheckError } = await supabase.from("payments").select("id, status").eq("user_id", user.id).eq("type", "publication").eq("status", "approved").maybeSingle();
    if (paymentCheckError) {
      console.error("Error checking existing payments:", paymentCheckError);
    }
    // If user already has an approved payment, return success with alreadyPaid flag
    if (existingPayment) {
      // Get user's landing page to check if it's already published
      const { data: landingPage, error: landingError } = await supabase.from("landing_pages").select("published_at, slug").eq("user_id", user.id).single();
      // If landing page is not published but payment is approved, publish it
      if (landingPage && !landingPage.published_at) {
        const { error: publishError } = await supabase.from("landing_pages").update({
          published_at: new Date().toISOString(),
          slug: await generateSlug(supabase, user.id)
        }).eq("user_id", user.id);
        if (publishError) {
          console.error("Error publishing landing page:", publishError);
        }
      }
      return new Response(JSON.stringify({
        success: true,
        alreadyPaid: true,
        message: "Ya tienes un pago aprobado. Tu invitación puede ser publicada."
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
    // Get user's landing page to check if it's already published
    const { data: landingPage, error: landingError } = await supabase.from("landing_pages").select("published_at").eq("user_id", user.id).single();
    if (landingError && landingError.code !== "PGRST116") {
      throw new Error("Error checking landing page status");
    }
    // If landing page is already published, check if there's an approved payment
    if (landingPage?.published_at) {
      const { data: paymentForPublished, error: publishedPaymentError } = await supabase.from("payments").select("id, status").eq("user_id", user.id).eq("type", "publication").order("created_at", {
        ascending: false
      }).limit(1).maybeSingle();
      // If there's a payment and it's approved, return alreadyPublished
      if (paymentForPublished && paymentForPublished.status === "approved") {
        return new Response(JSON.stringify({
          success: false,
          error: "La invitación ya ha sido publicada",
          alreadyPublished: true
        }), {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      }
      // If there's no payment or it's not approved, unpublish the landing page
      const { error: unpublishError } = await supabase.from("landing_pages").update({
        published_at: null,
        slug: null
      }).eq("user_id", user.id);
      if (unpublishError) {
        throw new Error(`Error unpublishing landing page: ${unpublishError.message}`);
      }
    }
    // --- STRIPE LOGIC STARTS HERE ---
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
    const Stripe = (await import("npm:stripe@12.15.0")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2022-11-15"
    });
    // Create payment in database first
    const { data: payment, error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      amount: 39990,
      description: "Publicación de invitación digital",
      type: "publication",
      status: "pending"
    }).select().single();
    if (paymentError) {
      throw new Error(`Error creating payment record: ${paymentError.message}`);
    }
    // Create Stripe Checkout Session
    const FRONTEND_URL = Deno.env.get("FRONTEND_URL") ?? "https://app.tuparte.digital";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "clp",
            product_data: {
              name: "Publicación de invitación digital"
            },
            unit_amount: 39990
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/payment/success`,
      cancel_url: `${FRONTEND_URL}/payment/failure`,
      metadata: {
        userId: user.id,
        paymentId: payment.id
      }
    });
    // Update payment record with Stripe session info
    const { error: updateError } = await supabase.from("payments").update({
      preference_id: session.id, // Stripe session id
      payment_id: session.payment_intent ?? null, // Stripe payment intent id
      payment_details: session
    }).eq("id", payment.id);
    if (updateError) {
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
    console.error("Error creating payment:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
// Helper function to generate a slug based on groom and bride names
async function generateSlug(supabase, userId) {
  try {
    // Get landing page data
    const { data: landingPage, error: landingError } = await supabase.from("landing_pages").select("groom_name, bride_name").eq("user_id", userId).single();
    if (landingError) {
      throw landingError;
    }
    // Generate base slug from names
    let baseSlug = `${landingPage.groom_name.toLowerCase()}-y-${landingPage.bride_name.toLowerCase()}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
    // Add a unique suffix (first 6 chars of user ID)
    const uniqueSuffix = userId.substring(0, 6);
    const slug = `${baseSlug}-${uniqueSuffix}`;
    return slug;
  } catch (error) {
    console.error("Error generating slug:", error);
    // Fallback to a timestamp-based slug
    return `boda-${Date.now()}`;
  }
}
