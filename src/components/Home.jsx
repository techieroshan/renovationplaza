import { useEffect, useState } from 'react'

export default function Home() {
    const [loading, setLoading] = useState(true)

    return (
        <div className="page-container">
            <div className="responsive-iframe-container fade-in">
                {loading && (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        Loading Latest Newsletter...
                    </div>
                )}
                <iframe
                    src="https://pages.rasa.io/newsbrief/b74efcba-ec5f-5f34-8baf-6321e400e9b6?"
                    title="Latest Newsletter"
                    onLoad={() => setLoading(false)}
                    allow="clipboard-read; clipboard-write"
                />
            </div>
        </div>
    )
}
