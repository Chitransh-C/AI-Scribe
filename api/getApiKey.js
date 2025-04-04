export default function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    res.status(200).json({ apiKey: process.env.OPENROUTER_API_KEY });
}
