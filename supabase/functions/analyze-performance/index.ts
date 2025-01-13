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
    const { monthlyScores, assessmentData, areasOfFocus, teamProgress } = await req.json()

    // Prepare the prompt for analysis
    const analysisPrompt = `
      As a sales performance analyst, analyze this data and provide 3-4 specific, actionable recommendations:
      
      Monthly Scores: ${JSON.stringify(monthlyScores)}
      Assessment Performance: ${JSON.stringify(assessmentData)}
      Areas Needing Focus: ${JSON.stringify(areasOfFocus)}
      Team Progress: ${JSON.stringify(teamProgress)}
      
      Focus on:
      1. Performance trends
      2. Skill gaps
      3. Training needs
      4. Success patterns
      
      Format recommendations as bullet points.
    `

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert sales performance analyst. Provide clear, actionable recommendations based on the data.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.7,
      }),
    })

    const aiResponse = await openAIResponse.json()
    const recommendations = aiResponse.choices[0].message.content

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      },
    )
  }
})