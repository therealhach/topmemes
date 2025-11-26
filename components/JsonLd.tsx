export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TopMemes.io',
    url: 'https://www.topmemes.io',
    description: 'Track trending Solana memecoins with real-time prices, market caps, and interactive charts.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.topmemes.io/?search={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TopMemes.io',
    url: 'https://www.topmemes.io',
    logo: 'https://www.topmemes.io/logo.png',
    sameAs: [
      'https://twitter.com/topmemes_io',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface TokenJsonLdProps {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  price?: number;
  url: string;
}

export function TokenJsonLd({ name, symbol, description, image, price, url }: TokenJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${name} (${symbol})`,
    description: description || `${name} is a cryptocurrency token on Solana blockchain.`,
    image: image,
    url: url,
    category: 'Cryptocurrency',
    brand: {
      '@type': 'Brand',
      name: name,
    },
    ...(price && {
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function FAQJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is TopMemes.io?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TopMemes.io is a real-time memecoin tracking platform for Solana tokens. It provides live prices, market caps, interactive charts, and integrated trading via Jupiter DEX.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I swap memecoins on TopMemes.io?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Connect your Phantom wallet, navigate to any token page, and use the built-in swap interface powered by Jupiter DEX to buy or sell tokens instantly.',
        },
      },
      {
        '@type': 'Question',
        name: 'What memecoins can I track?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'TopMemes.io tracks popular Solana memecoins including dog coins, cat coins, AI tokens, and other trending meme tokens with real-time price data from DexScreener.',
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
