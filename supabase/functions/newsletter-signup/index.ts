import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const { email, preferences } = await req.json()

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email is required' }),
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

    // Store subscription in database
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email,
          preferences: preferences || {},
          subscribed_at: new Date().toISOString(),
          active: true
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to subscribe' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send confirmation email
    try {
      await sendConfirmationEmail(email)
    } catch (emailError) {
      console.error('Email sending failed:', emailError)
      // Don't fail the subscription if email fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Successfully subscribed to newsletter! Check your email for confirmation.' 
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

async function sendConfirmationEmail(email: string) {
  const emailContent = {
    to: [{ email }],
    from: {
      email: 'noreply@techpulse.com',
      name: 'TechPulse'
    },
    subject: 'Welcome to TechPulse Newsletter! 🚀',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TechPulse</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 40px 30px; text-align: center; color: white; }
          .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .content { padding: 40px 30px; }
          .welcome-text { font-size: 24px; font-weight: bold; color: #1f2937; margin-bottom: 20px; }
          .description { font-size: 16px; color: #6b7280; margin-bottom: 30px; }
          .features { background: #f8fafc; border-radius: 8px; padding: 25px; margin: 30px 0; }
          .feature { display: flex; align-items: flex-start; margin-bottom: 15px; }
          .feature:last-child { margin-bottom: 0; }
          .feature-icon { width: 20px; height: 20px; background: #3b82f6; border-radius: 50%; margin-right: 15px; margin-top: 2px; flex-shrink: 0; }
          .feature-text { font-size: 14px; color: #4b5563; }
          .cta { text-align: center; margin: 30px 0; }
          .cta-button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; }
          .footer { background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-text { font-size: 14px; color: #6b7280; margin-bottom: 15px; }
          .unsubscribe { font-size: 12px; color: #9ca3af; }
          .unsubscribe a { color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">⚡ TechPulse</div>
            <p style="margin: 0; opacity: 0.9;">Making complex technology accessible to everyone</p>
          </div>
          
          <div class="content">
            <h1 class="welcome-text">Welcome to TechPulse! 🎉</h1>
            <p class="description">
              Thank you for subscribing to our newsletter! You're now part of a growing community of tech enthusiasts who value clear, insightful content.
            </p>
            
            <div class="features">
              <h3 style="margin-top: 0; color: #1f2937;">What you can expect:</h3>
              <div class="feature">
                <div class="feature-icon"></div>
                <div class="feature-text"><strong>3-minute reads</strong> - Digestible tech stories that respect your time</div>
              </div>
              <div class="feature">
                <div class="feature-icon"></div>
                <div class="feature-text"><strong>AI Deep Dives</strong> - Complex AI concepts explained simply</div>
              </div>
              <div class="feature">
                <div class="feature-icon"></div>
                <div class="feature-text"><strong>Visual Stories</strong> - Infographics that make tech accessible</div>
              </div>
              <div class="feature">
                <div class="feature-icon"></div>
                <div class="feature-text"><strong>Weekly Wraps</strong> - Curated summaries of important developments</div>
              </div>
            </div>
            
            <div class="cta">
              <a href="https://famous-monstera-a56e77.netlify.app" class="cta-button">Explore TechPulse</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              We're currently preparing amazing content for you. You'll receive your first newsletter update as soon as new articles are published!
            </p>
          </div>
          
          <div class="footer">
            <p class="footer-text">
              You're receiving this because you subscribed to TechPulse newsletter.
            </p>
            <p class="unsubscribe">
              Don't want these emails? <a href="#">Unsubscribe here</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Welcome to TechPulse! 🎉

Thank you for subscribing to our newsletter! You're now part of a growing community of tech enthusiasts who value clear, insightful content.

What you can expect:
• 3-minute reads - Digestible tech stories that respect your time
• AI Deep Dives - Complex AI concepts explained simply  
• Visual Stories - Infographics that make tech accessible
• Weekly Wraps - Curated summaries of important developments

We're currently preparing amazing content for you. You'll receive your first newsletter update as soon as new articles are published!

Visit TechPulse: https://famous-monstera-a56e77.netlify.app

---
You're receiving this because you subscribed to TechPulse newsletter.
Don't want these emails? Reply with "unsubscribe" to opt out.
    `
  }

  // Try multiple email services for better reliability
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
        console.log(`Email sent successfully via ${service.name}`)
        return
      } else {
        console.error(`${service.name} failed:`, await response.text())
      }
    } catch (error) {
      console.error(`${service.name} error:`, error)
    }
  }

  // Fallback: Log the email (for development/testing)
  console.log('Email would be sent to:', email)
  console.log('Email content:', emailContent.subject)
}