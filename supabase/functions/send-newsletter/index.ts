import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { articleId } = await req.json()

    if (!articleId) {
      return new Response(
        JSON.stringify({ error: 'Article ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get article details
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('id', articleId)
      .eq('published', true)
      .single()

    if (articleError || !article) {
      return new Response(
        JSON.stringify({ error: 'Article not found or not published' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get active subscribers from database
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('email, preferences')
      .eq('active', true)

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch subscribers' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active subscribers found' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send newsletter emails to all subscribers
    const emailResults = await Promise.allSettled(
      subscribers.map(subscriber => 
        sendNewPostEmail(subscriber.email, article)
      )
    )

    const successCount = emailResults.filter(result => result.status === 'fulfilled').length
    const failureCount = emailResults.filter(result => result.status === 'rejected').length

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Newsletter sent to ${successCount} subscribers`,
        stats: {
          totalSubscribers: subscribers.length,
          emailsSent: successCount,
          emailsFailed: failureCount
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function sendNewPostEmail(email: string, article: any) {
  const siteUrl = 'https://famous-monstera-a56e77.netlify.app'
  const articleUrl = `${siteUrl}/article/${article.id}`
  
  // Create excerpt from content
  const plainTextContent = article.content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  const excerpt = plainTextContent.length > 200 
    ? plainTextContent.substring(0, 200) + '...' 
    : plainTextContent

  const emailContent = {
    to: [{ email }],
    from: {
      email: 'noreply@techpulse.com',
      name: 'TechPulse'
    },
    subject: `📱 New ${article.category}: ${article.title}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Article from TechPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; color: white; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
          .content { padding: 30px; }
          .article-image { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px; }
          .category { background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; display: inline-block; margin-bottom: 15px; }
          .article-title { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 15px; line-height: 1.3; }
          .article-excerpt { color: #6b7280; margin-bottom: 20px; line-height: 1.6; }
          .cta { text-align: center; margin: 30px 0; }
          .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; }
          .footer { background: #f8fafc; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb; }
          .unsubscribe { font-size: 12px; color: #9ca3af; }
          .unsubscribe a { color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ TechPulse</div>
            <p style="margin: 0; opacity: 0.9; font-size: 14px;">New article just published!</p>
          </div>
          
          <div class="content">
            <img src="${article.image_url}" alt="${article.title}" class="article-image" />
            <span class="category">${article.category}</span>
            <h1 class="article-title">${article.title}</h1>
            <p class="article-excerpt">${excerpt}</p>
            
            <div class="cta">
              <a href="${articleUrl}" class="cta-button">Read Full Article</a>
            </div>
          </div>
          
          <div class="footer">
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 15px;">
              You're receiving this because you subscribed to TechPulse newsletter.
            </p>
            <p class="unsubscribe">
              <a href="${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}">Unsubscribe here</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
New ${article.category} from TechPulse! 📱

${article.title}

${excerpt}

Read the full article: ${articleUrl}

---
You're receiving this because you subscribed to TechPulse newsletter.
Unsubscribe: ${siteUrl}/unsubscribe?email=${encodeURIComponent(email)}
    `
  }

  // Try multiple email services for reliability
  const emailServices = [
    { name: 'Resend', url: 'https://api.resend.com/emails', key: Deno.env.get('RESEND_API_KEY') },
    { name: 'SendGrid', url: 'https://api.sendgrid.com/v3/mail/send', key: Deno.env.get('SENDGRID_API_KEY') }
  ]

  for (const service of emailServices) {
    if (!service.key) continue

    try {
      let requestBody, headers

      if (service.name === 'Resend') {
        requestBody = emailContent
        headers = {
          'Authorization': `Bearer ${service.key}`,
          'Content-Type': 'application/json'
        }
      } else if (service.name === 'SendGrid') {
        requestBody = {
          personalizations: [{ to: emailContent.to }],
          from: emailContent.from,
          subject: emailContent.subject,
          content: [
            { type: 'text/html', value: emailContent.html },
            { type: 'text/plain', value: emailContent.text }
          ]
        }
        headers = {
          'Authorization': `Bearer ${service.key}`,
          'Content-Type': 'application/json'
        }
      }

      const response = await fetch(service.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        console.log(`Email sent successfully to ${email} via ${service.name}`)
        return
      }
    } catch (error) {
      console.error(`${service.name} error for ${email}:`, error)
    }
  }

  throw new Error(`Failed to send email to ${email}`)
}