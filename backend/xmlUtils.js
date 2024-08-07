import axios from 'axios';
import xml2js from 'xml2js';

export async function fetchXML(url) {
  try {
    const response = await axios.get(url);
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(response.data);
  } catch (error) {
    console.error('Error fetching XML:', error);
    throw error;
  }
}

export async function findProductSitemap(sitemapUrl) {
  try {
    const sitemap = await fetchXML(sitemapUrl);
    const sitemaps = sitemap.sitemapindex.sitemap;
    return sitemaps.find(s => s.loc[0].includes('products'))?.loc[0];
  } catch (error) {
    console.error('Error finding product sitemap:', error);
    throw error;
  }
}