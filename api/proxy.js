export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(200).send("Service Active");

    try {
        const targetUrl = new URL(url);
        const response = await fetch(targetUrl.href, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36' }
        });

        const contentType = response.headers.get('content-type');
        const data = await response.arrayBuffer();

        // Форсируем правильный тип контента для браузера
        res.setHeader('Content-Type', contentType || 'text/html');
        res.setHeader('Access-Control-Allow-Origin', '*');

        if (contentType && contentType.includes('text/html')) {
            let text = new TextDecoder().decode(data);
            const proxyBase = `https://${req.headers.host}/?url=`;
            // Rewriting links so they don't break
            text = text.replace(/href="https?:\/\/([\w\-\.]+)/g, `href="${proxyBase}https://$1`);
            return res.send(text);
        }

        res.send(Buffer.from(data));
    } catch (e) {
        res.status(500).send("Error: " + e.message);
    }
}
