import axios from 'axios';

export async function fetchRobotsTxt(domain) {
  try {
    const url = `https://${domain}/robots.txt`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching robots.txt:', error);
    throw error;
  }
}

export function extractSitemapUrl(robotsTxt) {
  const lines = robotsTxt.split('\n');
  const sitemapLine = lines.find(line => line.toLowerCase().startsWith('sitemap:'));
  return sitemapLine ? sitemapLine.split(': ')[1].trim() : null;
}