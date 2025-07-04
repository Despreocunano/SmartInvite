import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
serve(async (req)=>{
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const url = new URL(req.url);
    const preferenceId = url.searchParams.get("preference_id");
    
    if (!preferenceId) {
      throw new Error("Preference ID is required");
    }
    
    // Buscar el pago en la base de datos
    const { data: payment, error: paymentError } = await supabase
      .from('gift_payments')
      .select('*')
      .eq('preference_id', preferenceId)
      .single();
      
    if (paymentError || !payment) {
      console.error("Payment not found for preference:", preferenceId, paymentError);
      throw new Error("Payment not found");
    }
    
    // Obtener información del regalo
    const { data: giftItem, error: giftError } = await supabase
      .from('wish_list_items')
      .select('*')
      .eq('id', payment.gift_item_id)
      .single();
      
    if (giftError) {
      console.error("Error fetching gift item:", giftError);
    }
    
    return new Response(JSON.stringify({
      success: true,
      payment: payment,
      giftItem: giftItem
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error checking gift payment status:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Failed to check gift payment status"
    }), {
      status: 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
