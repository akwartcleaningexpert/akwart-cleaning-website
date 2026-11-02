const express = require('express');
const path = require('path');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));

const fallbackReply = (message) => {
  const question = message.toLowerCase();

  if (question.includes('hello') || question.includes('hi')) {
    return 'Hello! I can help with our cleaning services, quoting, availability and booking. Ask me anything about A-Kwart Cleaning Expert Ltd.';
  }

  if (question.includes('service') || question.includes('offer') || question.includes('clean')) {
    return 'We offer domestic cleaning, office cleaning, commercial cleaning, end of tenancy cleaning, deep cleaning, window cleaning, school cleaning, carpet cleaning and retail cleaning.';
  }

  if (question.includes('quote') || question.includes('price') || question.includes('cost') || question.includes('estimate')) {
    return 'You can get a free quote by phone, WhatsApp, or by sending us your requirements via the contact form on the website. We will advise on the best service for your needs.';
  }

  if (question.includes('office') || question.includes('commercial') || question.includes('business')) {
    return 'Yes, we provide office and commercial cleaning services for businesses throughout Slough and surrounding areas. We can work around your schedule and business hours.';
  }

  if (question.includes('book') || question.includes('appointment') || question.includes('schedule')) {
    return 'You can book by calling 07858 015558, WhatsApp us, or sending an enquiry through the contact form on this website.';
  }

  if (question.includes('area') || question.includes('cover') || question.includes('location')) {
    return 'We serve Slough and surrounding areas across England and Wales, including Maidenhead, Windsor, Reading, Guildford, Oxford, Bristol, Cardiff, and London.';
  }

  if (question.includes('domestic') || question.includes('home')) {
    return 'Yes, we provide reliable domestic cleaning for kitchens, bathrooms, bedrooms, living spaces and regular home maintenance cleaning.';
  }

  if (question.includes('tenancy') || question.includes('move')) {
    return 'Yes, we offer end-of-tenancy cleaning to help prepare a property for handover, inspection or new tenants.';
  }

  if (question.includes('window') || question.includes('carpet') || question.includes('deep')) {
    return 'Yes, we also provide window cleaning, carpet cleaning and deep cleaning services tailored to the condition and needs of your property.';
  }

  if (question.includes('contact') || question.includes('email') || question.includes('phone') || question.includes('whatsapp')) {
    return 'Contact us on 07858 015558, email 2aa.kwart@gmail.com, or WhatsApp us directly for a fast response.';
  }

  if (question.includes('thank')) {
    return 'You’re welcome! We’re happy to help. Contact us for a free quote or to book your cleaning service.';
  }

  return 'Thanks for your message. For the quickest response, please call 07858 015558 or send a WhatsApp message. We can help with pricing, scheduling and the right cleaning service for your property.';
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'A message is required.' });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.json({ reply: fallbackReply(message) });
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      input: [
        {
          role: 'system',
          content: `You are A-Kwart AI, a friendly assistant for A-Kwart Cleaning Expert Ltd. Your job is to answer questions about cleaning services, pricing, availability, bookings, and customer support for the company. Be warm, helpful, concise, and professional. Mention the business phone number 07858 015558 and email 2aa.kwart@gmail.com when relevant. If asked about pricing, do not make up exact fees; instead advise that a free quote can be arranged.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_output_tokens: 300
    });

    const reply = response.output_text || fallbackReply(message);

    return res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return res.json({ reply: fallbackReply(req.body?.message || '') });
  }
});

app.listen(port, () => {
  console.log(`A-Kwart AI chatbot running on http://localhost:${port}`);
});
