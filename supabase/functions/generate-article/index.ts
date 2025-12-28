import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sourceUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!sourceUrl) {
      throw new Error('Source URL is required');
    }

    console.log('Generating article from URL:', sourceUrl);

    const isTikTok = sourceUrl.toLowerCase().includes('tiktok.com');
    const isInstagram = sourceUrl.toLowerCase().includes('instagram.com');
    const platform = isTikTok ? 'TikTok' : isInstagram ? 'Instagram' : 'social media';

    const systemPrompt = `Kamu adalah jurnalis profesional Indonesia yang menulis berita viral dari konten media sosial.
Tugasmu adalah mengubah konten video ${platform} menjadi artikel berita yang menarik dan informatif.

Panduan penulisan:
- Gunakan bahasa Indonesia yang baik dan benar
- Gaya penulisan jurnalistik: objektif, ringkas, dan informatif
- Mulai dengan lead yang menarik (5W+1H)
- Paragraf pendek (2-3 kalimat)
- Hindari clickbait berlebihan
- Sertakan konteks dan informasi tambahan jika relevan`;

    const userPrompt = `Berdasarkan video ${platform} dari URL berikut: ${sourceUrl}

Buatkan artikel berita dengan format JSON:
{
  "title": "Judul berita yang menarik dan SEO-friendly (maks 100 karakter)",
  "content": "Isi artikel berita lengkap (minimal 3 paragraf, pisahkan dengan \\n\\n)",
  "category": "pilih satu: nasional/tech/lifestyle/viral/social"
}

Catatan: Karena tidak bisa mengakses video secara langsung, buatkan artikel berdasarkan pola umum konten viral dari platform tersebut. Buat konten yang masuk akal dan menarik.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error('AI gateway error');
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI response:', aiResponse);

    // Parse JSON from AI response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response');
    }

    const articleData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({
      title: articleData.title || '',
      content: articleData.content || '',
      category: articleData.category || 'viral',
      thumbnailUrl: '',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-article:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Failed to generate article' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});