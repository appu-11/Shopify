import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeProductPage(url) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);
      $('script, style').remove(); 
      let text = $('body').text().trim();
      text = text
      .split('\n')
      .filter(line => line.trim() !== '')
      .join('\n');
      return text;
    } catch (error) {
      console.error('Error scraping product page:', error);
      throw error;
    }
  }

  async function gemini(message) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`;
  
    const messagesToSend = [
      {
        role: 'user',
        parts: [
          {
            text: 'You will be provided with scraped text for a Product from a website. Give 3 bullet points for the product\'s features and it should be concise. Start each bullet point with -'
          }
        ]
      },
      {
        role: 'model',
        parts: [
          {
            text: 'sure, I will help you with that'
          }
        ]
      },
      {
        role: 'user',
        parts: [
          {
            text: message
          }
        ]
      }
    ];
  
    try {
      const response = await axios.post(url, { contents: messagesToSend }, { headers: { 'Content-Type': 'application/json' } });
      const responseMessage = response.data.candidates[0].content.parts[0].text;
      return responseMessage;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  
  export async function summarizeWithLLM(text) {
    try {
      const reply = await gemini(text);
      const replySummary = reply
      .split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^-/, '').trim()) 
      .slice(0, 3);
      return replySummary;
    }catch (error) {
      console.error('Error summarizing text with LLM:');
      return ['Error summarizing text with LLM'] 
    }
  }