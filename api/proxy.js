export default async function handler(req, res) {
    const targetUrl = req.query.url; 

    if (!targetUrl) {
        return res.status(200).send("Система активна. Жду белый шум...");
    }

    try {
        const response = await fetch(targetUrl, {
            method: req.method,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });

        const data = await response.arrayBuffer();
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.send(Buffer.from(data));
    } catch (error) {
        res.status(500).send("Error: " + error.message);
    }
}
