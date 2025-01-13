import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { transcript, meetingType } = await req.json()

    if (!transcript || !meetingType) {
      throw new Error('Transcript and meeting type are required')
    }

    const prompt = `As a sales coaching expert, analyze this ${meetingType} meeting transcript and provide structured feedback. Focus on:
    1. Key Strengths: What the sales rep did well
    2. Areas for Improvement: Specific aspects that could be enhanced
    3. Actionable Recommendations: Concrete steps for improvement
    4. Overall Assessment: A brief summary of the performance

    Transcript:
    ${transcript}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert sales coach providing constructive feedback on sales meetings.' },
          { role: 'user', content: prompt }
        ],
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      console.error('OpenAI API error:', data)
      throw new Error(data.error?.message || 'Failed to analyze transcript')
    }

    const analysis = data.choices[0].message.content

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-meeting function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})