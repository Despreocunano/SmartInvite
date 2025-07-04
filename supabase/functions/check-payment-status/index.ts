import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
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
    // Initialize Supabase client
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
    // Get URL parameters
    const url = new URL(req.url);
    const preferenceId = url.searchParams.get("preference_id");
    if (!preferenceId) {
      throw new Error("Preference ID is required");
    }
    // Get payment status from database
    const { data: payment, error: paymentError } = await supabase.from("payments").select("status, payment_id, payment_details").eq("preference_id", preferenceId).eq("user_id", user.id).single();
    if (paymentError || !payment) {
      throw new Error(`Payment not found: ${paymentError ? paymentError.message : 'No payment found'}`);
    }
    // Check if landing page is published
    const { data: landingPage, error: landingError } = await supabase.from("landing_pages").select("published_at, slug").eq("user_id", user.id).single();
    if (landingError && landingError.code !== "PGRST116") {
      throw new Error(`Error checking landing page: ${landingError.message}`);
    }
    return new Response(JSON.stringify({
      success: true,
      payment: {
        status: payment.status,
        paymentId: payment.payment_id,
        details: payment.payment_details
      },
      landingPage: {
        isPublished: !!landingPage?.published_at,
        slug: landingPage?.slug || null,
        publishedUrl: landingPage?.slug ? `https://tuparte.digital/invitacion/${landingPage.slug}` : null
      }
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
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
