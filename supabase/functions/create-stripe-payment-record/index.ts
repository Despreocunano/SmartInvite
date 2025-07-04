import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }
  try {
    const { userId, amount, description, type } = await req.json();
    if (!userId || !amount || !description || !type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: corsHeaders });
    }
    const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data, error } = await supabase.from("payments").insert({
      user_id: userId,
      amount,
      description,
      type,
      status: "pending"
    }).select("id").single();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
    return new Response(JSON.stringify({ paymentId: data.id }), { headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), { status: 500, headers: corsHeaders });
  }
}); 