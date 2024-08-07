import express from 'express';
import cors from 'cors';
import { fetchXML, findProductSitemap } from './xmlUtils.js';
import { fetchRobotsTxt, extractSitemapUrl } from './robotsUtils.js';
import { scrapeProductPage, summarizeWithLLM } from './scrapeUtils.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 8080;

const extractDomain = (input) => {
    let domain;
    try {
        const parsedUrl = new URL(input);
        domain = parsedUrl.hostname;
    } catch (e) {
        domain = input;
    }
    return domain;
};

app.post('/scrape', async (req, res) => {
  try {
    const { domain: temp } = req.body;
    const inputDomain = temp.trim();
    const domain = extractDomain(inputDomain);
    const robotsTxt = await fetchRobotsTxt(domain);
    const mainSitemapUrl = extractSitemapUrl(robotsTxt);
    const productSitemapUrl = await findProductSitemap(mainSitemapUrl);
    const productSitemap = await fetchXML(productSitemapUrl);
    const products = [];
    for (let i = 0; i < Math.min(productSitemap.urlset.url.length, 6); i++) {
      const url = productSitemap.urlset.url[i];
      if (url['image:image'] && url['image:image'][0]) {
        products.push({
          link: url.loc[0],
          image: url['image:image'][0]['image:loc'] ? url['image:image'][0]['image:loc'][0] : 'No Image',
          imageTitle: url['image:image'][0]['image:title'] ? url['image:image'][0]['image:title'][0] : 'No Title',
        });
      }
    }
    for (let product of products) {
      const pageContent = await scrapeProductPage(product.link);
      product.summary = await summarizeWithLLM(pageContent);
    }

    res.json(products);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});