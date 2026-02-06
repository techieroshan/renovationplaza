import { useEffect, useState } from 'react'
import SEO from './SEO'

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [iframeSrc, setIframeSrc] = useState(null)
    const RASA_URL = "https://pages.rasa.io/newsbrief/b74efcba-ec5f-5f34-8baf-6321e400e9b6?";

    useEffect(() => {
        const checkCache = async () => {
            try {
                // First get the meta information for cache busting
                const metaRes = await fetch(window.location.origin + "/cache/meta.json?t=" + Date.now());
                let cacheBuster = "";
                if (metaRes.ok) {
                    const meta = await metaRes.json();
                    cacheBuster = "?v=" + encodeURIComponent(meta.lastUpdated);
                }

                const cacheUrl = window.location.origin + "/cache/latest.html" + cacheBuster;
                const response = await fetch(cacheUrl, { method: 'GET' });

                if (response.ok) {
                    const text = await response.text();
                    // If it contains "id=\"root\"", it's likely the SPA fallback, not the newsletter
                    if (text.includes('id="root"') || text.length < 5000) {
                        console.warn('Cache file seems to be the SPA fallback, using live URL');
                        setIframeSrc(RASA_URL);
                    } else {
                        console.log('Valid cache found, using local version');
                        setIframeSrc(cacheUrl);
                    }
                } else {
                    console.warn('Cache not found, using live URL');
                    setIframeSrc(RASA_URL);
                }
            } catch (error) {
                console.error('Error checking cache:', error);
                setIframeSrc(RASA_URL);
            }
        };

        checkCache();
    }, []);

    return (
        <div className="page-container">
            <SEO
                title="RenovationPlaza"
                description="The premier weekly newsletter for DIY enthusiasts and home renovation experts. Get curated articles on remodeling, repairs, and interior design every Tuesday."
                schema={{
                    "@type": "WebSite",
                    "name": "RenovationPlaza",
                    "potentialAction": {
                        "@type": "SubscribeAction",
                        "target": {
                            "@type": "EntryPoint",
                            "urlTemplate": `${window.location.origin}/subscribe`
                        }
                    }
                }}
            />
            <div className="responsive-iframe-container fade-in">
                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        Loading Latest Newsletter...
                    </div>
                )}
                {iframeSrc && (
                    <iframe
                        src={iframeSrc}
                        title="Latest Newsletter"
                        onLoad={() => {
                            console.log('Newsletter loaded into iframe');
                            setLoading(false);
                        }}
                        allow="clipboard-read; clipboard-write"
                    />
                )}
            </div>
        </div>
    )
}
