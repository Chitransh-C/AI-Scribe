export default function handler(req, res) {
  const robots = `User-agent: *
Allow: /
Sitemap: https://ai-scribe-theta.vercel.app/api/sitemap`;

  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(robots);
}
