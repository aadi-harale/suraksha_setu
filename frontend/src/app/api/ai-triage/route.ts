import { NextResponse } from 'next/server';
import { getFallbackTriage, TriageRequest } from '@/lib/openrouter-triage';

export async function POST(req: Request) {
  try {
    const body: TriageRequest = await req.json();
    
    // Minimal validation
    if (!body || !body.transcript) {
      return NextResponse.json(getFallbackTriage(body || {} as any));
    }
    
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.log('No OPENROUTER_API_KEY found, using fallback triage.');
      return NextResponse.json(getFallbackTriage(body));
    }

    const prompt = `You are assisting a cybercrime triage officer. Summarize this suspected digital arrest scam case using only the provided transcript, extracted entities, risk score, and kill-chain stage. Do not invent facts. Use cautious language. Produce a JSON object with the following keys:
- summary: One-paragraph case summary
- riskIndicators: Array of top risk indicators
- citizenAction: Recommended action for the citizen
- investigatorAction: Recommended action for the investigator
- uncertainties: Uncertainties or missing evidence

Note: Mention that any suspect repository matches (if provided) are supporting signals, not absolute proof.

Transcript:
${body.transcript}

Risk Score: ${body.riskScore}
Kill Chain Stage: ${body.killChainStage}
`;

    // 8 second timeout for hackathon demo speed
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "SurakshaNet AI",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('OpenRouter API error', response.statusText);
        return NextResponse.json(getFallbackTriage(body));
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message) {
        console.error('OpenRouter missing choices in response');
        return NextResponse.json(getFallbackTriage(body));
      }
      
      try {
        const result = JSON.parse(data.choices[0].message.content);
        return NextResponse.json({
          ...result,
          isSimulated: false
        });
      } catch (e) {
        console.error('Failed to parse OpenRouter response JSON', e);
        return NextResponse.json(getFallbackTriage(body));
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Fetch error or timeout:', fetchError);
      return NextResponse.json(getFallbackTriage(body));
    }

  } catch (error) {
    console.error('AI Triage request error:', error);
    return NextResponse.json(getFallbackTriage({} as any)); // Return fallback on any error
  }
}
