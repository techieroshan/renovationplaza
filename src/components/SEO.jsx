import { Helmet } from 'react-helmet-async';

export default function SEO({
    title,
    description,
    canonical,
    type = 'website',
    publishedTime,
    schema
}) {
    const siteName = 'RenovationPlaza';
    const fullTitle = title === siteName ? title : `${title} | ${siteName}`;

    // Default structured data for the organization
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "NewsMediaOrganization",
        "name": "RenovationPlaza",
        "url": window.location.origin,
        "logo": "https://image-api.rasa.io/image/self-service-logos/path/2024-01-27/files/78fe1ab5-3ea9-41f7-bfc5-dbcb7a3b72df",
        "description": "Weekly DIY and home renovation newsletter curating the best articles for homeowners and enthusiasts.",
        "publishingPrinciples": "https://renovationplaza.com/principles" // Placeholder for AIO credibility
    };

    // Merge custom schema with default or use custom as primary if provided
    const jsonLd = schema ? { ...defaultSchema, ...schema } : defaultSchema;

    return (
        <Helmet>
            {/* Standard SEO */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical || window.location.href} />

            {/* Open Graph / Facebook (Visuals for Socials) */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content="https://image-api.rasa.io/image/self-service-logos/path/2024-01-27/files/78fe1ab5-3ea9-41f7-bfc5-dbcb7a3b72df?h=200" />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}

            {/* Twitter Cards */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />

            {/* AIO / AEO: Structured Data for AI context */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLd)}
            </script>
        </Helmet>
    );
}
