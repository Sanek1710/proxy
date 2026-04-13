export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send("<html><body><h1>Service Active</h1></body></html>");
    }

    try {
        const targetUrl = new URL(url);
        const response = await fetch(targetUrl.href, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': targetUrl.origin,
                'Accept': '*/*'
            }
        });

        const contentType = response.headers.get('content-type') || '';
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-cache');

        if (contentType.includes('text/html')) {
            let text = new TextDecoder().decode(buffer);
            const proxyBase = `https://${req.headers.host}/api/proxy?url=`;
            // Rewriting links to pass through proxy
            text = text.replace(/(https?:\/\/[\w\-\.\/]+)/g, (match) => {
                if (match.includes(req.headers.host)) return match;
                return proxyBase + encodeURIComponent(match);
            });
            return res.send(new TextEncoder().encode(text));
        }

        res.send(Buffer.from(buffer));

    } catch (e) {
        res.status(500).json({ error: "Connection failed", status: "fail" });
    }
}
