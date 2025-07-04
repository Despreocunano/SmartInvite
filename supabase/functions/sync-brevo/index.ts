import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Brevo API configuration
    const BREVO_API_KEY = Deno.env.get('BREVO_API_KEY')!
    const BREVO_API_URL = 'https://api.brevo.com/v3'

    // Get the request body
    const { type, table, record, old_record } = await req.json()

    console.log('Request received:', { type, table, record: record?.id })

    // Handle different database events
    if (type === 'INSERT' && table === 'users') {
      // New user registration
      await syncUserToBrevo(record, BREVO_API_KEY, BREVO_API_URL, 'create')
    } else if (type === 'UPDATE' && table === 'users') {
      // User update
      await syncUserToBrevo(record, BREVO_API_KEY, BREVO_API_URL, 'update')
    } else if (type === 'INSERT' && table === 'landing_pages') {
      // New landing page created
      await syncLandingPageToBrevo(record, null, BREVO_API_KEY, BREVO_API_URL, 'create')
    } else if (type === 'UPDATE' && table === 'landing_pages') {
      // Landing page updated - only sync if important fields changed
      const importantFieldsChanged = hasImportantChanges(record, old_record)
      if (importantFieldsChanged) {
        await syncLandingPageToBrevo(record, old_record, BREVO_API_KEY, BREVO_API_URL, 'update')
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

function hasImportantChanges(newRecord: any, oldRecord: any): boolean {
  if (!oldRecord) return true
  
  const importantFields = ['groom_name', 'bride_name', 'wedding_date', 'slug']
  return importantFields.some(field => newRecord[field] !== oldRecord[field])
}

async function syncUserToBrevo(user: any, apiKey: string, apiUrl: string, action: 'create' | 'update') {
  // Get user email from auth.users since it's not in public.users table
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
  const userEmail = authUser?.user?.email || `${user.id}@placeholder.com`

  const endpoint = action === 'create' ? '/contacts' : `/contacts/${userEmail}`
  const method = action === 'create' ? 'POST' : 'PUT'

  const contactData = {
    email: userEmail,
    attributes: {
      FIRSTNAME: user.groom_name || '',
      GROOM_NAME: user.groom_name || '',
      BRIDE_NAME: user.bride_name || '',
      CREATED_AT: user.created_at,
      UPDATED_AT: user.updated_at || new Date().toISOString()
    },
    listIds: [parseInt(Deno.env.get('BREVO_LIST_ID') || '1')],
    updateEnabled: true
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(contactData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo API error: ${error}`)
  }

  console.log(`User ${action}d in Brevo:`, userEmail)
}

async function syncLandingPageToBrevo(landingPage: any, oldLandingPage: any, apiKey: string, apiUrl: string, action: 'create' | 'update') {
  // Get user associated with this landing page
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: user } = await supabase
    .from('users')
    .select('id, groom_name, bride_name')
    .eq('id', landingPage.user_id)
    .single()

  if (!user) {
    console.log('User not found for landing page sync')
    return
  }

  // Get user email from auth.users
  const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
  const userEmail = authUser?.user?.email || `${user.id}@placeholder.com`

  const endpoint = action === 'create' ? '/contacts' : `/contacts/${userEmail}`
  const method = action === 'create' ? 'POST' : 'PUT'

  // Only sync essential fields
  const contactData = {
    email: userEmail,
    attributes: {
      FIRSTNAME: landingPage.groom_name || user.groom_name || '',
      GROOM_NAME: landingPage.groom_name || user.groom_name || '',
      BRIDE_NAME: landingPage.bride_name || user.bride_name || '',
      WEDDING_DATE: landingPage.wedding_date || '',
      SLUG: landingPage.slug || '', // Will be empty until payment is made
      LANDING_CREATED_AT: landingPage.created_at || '',
      HAS_PAID: landingPage.slug ? 'Yes' : 'No', // Indicates if payment was made
      UPDATED_AT: landingPage.updated_at || new Date().toISOString()
    },
    listIds: [parseInt(Deno.env.get('BREVO_LIST_ID') || '1')],
    updateEnabled: true
  }

  const response = await fetch(`${apiUrl}${endpoint}`, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'api-key': apiKey
    },
    body: JSON.stringify(contactData)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Brevo API error: ${error}`)
  }

  console.log(`Landing page ${action}d in Brevo for user:`, userEmail)
  console.log(`Payment status: ${landingPage.slug ? 'Paid' : 'Not paid'}`)
} 