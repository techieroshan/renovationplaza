import { useEffect, useState } from 'react'
import SEO from './SEO'

export default function Home() {
    const [loading, setLoading] = useState(true)

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
                <iframe
                    src="/cache/latest.html"
                    title="Latest Newsletter"
                    onLoad={() => setLoading(false)}
                    onError={(e) => {
                        console.warn('Cache load issue, falling back to live URL');
                        e.target.src = "https://pages.rasa.io/newsbrief/b74efcba-ec5f-5f34-8baf-6321e400e9b6?";
                    }}
                    allow="clipboard-read; clipboard-write"
                />
            </div>
        </div>
    )
}
