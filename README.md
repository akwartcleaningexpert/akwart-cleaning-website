# A-Kwart Cleaning Website + AI Chatbot

This website includes a basic AI-powered chatbot for customer enquiries.

## Quick start

1. Install dependencies:
   npm install
2. Create a local environment file:
   cp .env.example .env
3. Add your OpenAI API key in `.env`
4. Start the server:
   npm start
5. Open http://localhost:3000

## What the chatbot does

- Answers questions about services
- Explains availability and booking
- Captures customer enquiries in chat
- Uses OpenAI when `OPENAI_API_KEY` is present
- Falls back to a local support script if no API key is configured

## Notes

- This setup is designed for a Node.js server, not GitHub Pages alone.
- For a live production website, deploy the app to a host that supports Node.js (such as Render, Railway, Vercel serverless functions, or a VPS).
