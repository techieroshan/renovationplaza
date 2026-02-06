import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Calendar, ChevronRight, ArrowLeft } from 'lucide-react'
import SEO from './SEO'
import './Archive.css'

export default function Archive() {
    const [searchParams, setSearchParams] = useSearchParams()
    const dateParam = searchParams.get('date')
    const [dates, setDates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const datesList = []
        let d = new Date()

        // Find last Tuesday
        while (d.getDay() !== 2) {
            d.setDate(d.getDate() - 1)
        }

        // Generate last 20 Tuesdays
        for (let i = 0; i < 20; i++) {
            const year = d.getFullYear()
            const month = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')

            datesList.push({
                value: `${year}-${month}-${day}`,
                display: d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            })
            d.setDate(d.getDate() - 7)
        }
        setDates(datesList)
    }, [])

    const handleSelectDate = (date) => {
        setSearchParams({ date })
        setLoading(true)
    }

    const handleBack = () => {
        setSearchParams({})
    }

    const selectedDateDisplay = dates.find(d => d.value === dateParam)?.display;
    const pageTitle = dateParam ? `Newsletter: ${selectedDateDisplay || dateParam}` : 'Archives';
    const pageDesc = dateParam
        ? `Read the RenovationPlaza newsletter from ${selectedDateDisplay || dateParam}. Curated DIY and renovation tips.`
        : 'Browse past editions of the RenovationPlaza weekly newsletter. Explore a wealth of DIY projects and renovation guides.';

    return (
        <div className="page-container archive-page">
            <SEO
                title={pageTitle}
                description={pageDesc}
                type="article"
                publishedTime={dateParam}
                schema={{
                    "@type": "CollectionPage",
                    "name": pageTitle,
                    "description": pageDesc,
                    "hasPart": dates.map(d => ({
                        "@type": "PublicationIssue",
                        "datePublished": d.value,
                        "name": `RenovationPlaza Issue ${d.value}`,
                        "url": `${window.location.origin}/archive?date=${d.value}`
                    }))
                }}
            />
            <div className={`archive-sidebar ${dateParam ? 'mobile-hidden' : ''}`}>
                <div className="archive-header">
                    <h2>Archive</h2>
                    <p>Browse past editions</p>
                </div>
                <div className="date-list">
                    {dates.map((d) => (
                        <button
                            key={d.value}
                            className={`date-item ${dateParam === d.value ? 'active' : ''}`}
                            onClick={() => handleSelectDate(d.value)}
                        >
                            <div className="date-Left">
                                <Calendar size={18} className="date-icon" />
                                <span>{d.display}</span>
                            </div>
                            <ChevronRight size={16} className="arrow" />
                        </button>
                    ))}
                </div>
            </div>

            <div className={`archive-content ${!dateParam ? 'mobile-hidden' : ''}`}>
                {dateParam ? (
                    <div className="archive-iframe-wrapper fade-in">
                        <div className="mobile-header">
                            <button onClick={handleBack} className="back-btn">
                                <ArrowLeft size={16} /> Back
                            </button>
                            <span>{dates.find(d => d.value === dateParam)?.display || dateParam}</span>
                        </div>
                        {loading && (
                            <div className="loading-spinner iframe-loader">
                                <div className="spinner"></div>
                            </div>
                        )}
                        <iframe
                            key={dateParam}
                            src={`https://pages.rasa.io/newsbrief/b74efcba-ec5f-5f34-8baf-6321e400e9b6?date=${dateParam}`}
                            title={`Newsletter ${dateParam}`}
                            onLoad={() => setLoading(false)}
                        />
                    </div>
                ) : (
                    <div className="placeholder-state">
                        <div className="placeholder-icon">
                            <Calendar size={64} strokeWidth={1} />
                        </div>
                        <h3>Select a date to view the newsletter</h3>
                        <p>Choose from the list on the left to view past editions of RenovationPlaza.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
