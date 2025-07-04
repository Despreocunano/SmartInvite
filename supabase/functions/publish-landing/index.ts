import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "", 
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", 
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Validate user token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { userId, slug } = await req.json();
    if (userId !== user.id) {
      throw new Error("Unauthorized - User ID mismatch");
    }

    // Generate unique slug
    const userIdSuffix = user.id.substring(0, 4);
    const uniqueSlug = `${slug}-${userIdSuffix}`;

    // Single optimized query: check existing landing and update in one operation
    const { data, error: updateError } = await supabase
      .from('landing_pages')
      .update({
        published_at: new Date().toISOString(),
        slug: uniqueSlug
      })
      .eq('user_id', userId)
      .select('published_at, slug')
      .single();

    if (updateError) {
      // If update fails, check if it's because the landing doesn't exist
      if (updateError.code === 'PGRST116') {
        throw new Error("Landing page not found. Please save your landing first.");
      }
      
      // Check if it's a slug conflict
      const { data: conflictCheck } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('slug', uniqueSlug)
        .neq('user_id', userId)
        .single();
        
      if (conflictCheck) {
        throw new Error("This URL is already in use");
      }
      
      throw new Error("Failed to update landing page status");
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        published_at: data.published_at,
        slug: data.slug
      }
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("Error publishing landing:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish landing page"
    }), {
      status: error instanceof Error && error.message.includes("Unauthorized") ? 401 : 400,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
