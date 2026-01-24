import React from 'react';

export default function StructuredData() {
    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Weekend Travellers',
        url: 'https://weekendtravellers.com',
        logo: 'https://weekendtravellers.com/logo.png',
        description: 'AI-powered weekend trip planner for discovering perfect getaways in India',
        sameAs: [
            'https://twitter.com/weekendtravellers',
            'https://facebook.com/weekendtravellers',
            'https://instagram.com/weekendtravellers',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'support@weekendtravellers.com',
        },
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Weekend Travellers',
        url: 'https://weekendtravellers.com',
        description: 'AI-powered weekend trip planner for India',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: 'https://weekendtravellers.com/?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://weekendtravellers.com',
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
        </>
    );
}
