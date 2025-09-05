import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const now = new Date().toISOString();
  console.log('keepalive invoked', {
    method: req.method,
    ua: req.headers.get('user-agent') ?? undefined,
    time: now,
  });

  if (req.method === 'GET' || req.method === 'POST') {
    return new Response(
      JSON.stringify({ status: 'ok', time: now }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
});
