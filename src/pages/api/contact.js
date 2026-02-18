import { Resend } from 'resend'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const {
    fullName = '',
    burgerPlaceName = '',
    whatsapp = '',
    email = '',
    message = ''
  } = req.body ?? {}

  const trimmed = {
    fullName: String(fullName).trim(),
    burgerPlaceName: String(burgerPlaceName).trim(),
    whatsapp: String(whatsapp).trim(),
    email: String(email).trim(),
    message: String(message).trim()
  }

  if (!trimmed.fullName || !trimmed.whatsapp || !trimmed.message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields' })
  }

  const to = process.env.CONTACT_TO || 'bruttusfornecedor@gmail.com'
  const from = process.env.CONTACT_FROM || 'Bruttus <onboarding@resend.dev>'
  const resendApiKey = process.env.RESEND_API_KEY

  if (!resendApiKey) {
    return res.status(500).json({
      ok: false,
      error: 'Server email is not configured (missing RESEND_API_KEY)'
    })
  }

  const resend = new Resend(resendApiKey)

  const subject = `Novo lead - ${trimmed.fullName}${trimmed.burgerPlaceName ? ` (${trimmed.burgerPlaceName})` : ''}`
  const text = [
    'Novo contato comercial recebido:',
    '',
    `Nome: ${trimmed.fullName}`,
    `Hamburgueria: ${trimmed.burgerPlaceName || '-'}`,
    `WhatsApp: ${trimmed.whatsapp}`,
    `E-mail: ${trimmed.email || '-'}`,
    '',
    'Mensagem:',
    trimmed.message
  ].join('\n')

  try {
    const { error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      text,
      replyTo: trimmed.email || undefined
    })

    if (error) {
      return res.status(500).json({ ok: false, error: 'Failed to send email' })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    return res.status(500).json({ ok: false, error: 'Failed to send email' })
  }
}
