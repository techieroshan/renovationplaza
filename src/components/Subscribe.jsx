import { useState } from 'react'
import SEO from './SEO'

export default function Subscribe() {
    const [loading, setLoading] = useState(true)

    return (
        <div className="page-container">
            <SEO
                title="Subscribe"
                description="Join thousands of DIYers. Subscribe to RenovationPlaza for weekly renovation tips, guides, and inspiration delivered to your inbox."
            />
            <div className="responsive-iframe-container fade-in">
                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        Loading Subscription Form...
                    </div>
                )}
                <iframe
                    src="https://pages.rasa.io/signup/b74efcba-ec5f-5f34-8baf-6321e400e9b6?utm_source=newsbrief"
                    title="Subscribe to RenovationPlaza"
                    onLoad={() => setLoading(false)}
                />
            </div>
        </div>
    )
}
