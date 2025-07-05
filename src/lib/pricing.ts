export interface PricingConfig {
  currency: string;
  amount: number;
  symbol: string;
  name: string;
}

export const PRICING_CONFIG: Record<string, PricingConfig> = {
  US: {
    currency: 'usd',
    amount: 49.99,
    symbol: '$',
    name: 'USD'
  },
  MX: {
    currency: 'mxn',
    amount: 899.00,
    symbol: '$',
    name: 'MXN'
  },
  PA: {
    currency: 'usd',
    amount: 49.99,
    symbol: '$',
    name: 'USD'
  },
  // Default fallback
  default: {
    currency: 'clp',
    amount: 39990,
    symbol: '$',
    name: 'CLP'
  }
};

export function getPricingForCountry(countryCode: string): PricingConfig {
  const country = countryCode?.toUpperCase();
  return PRICING_CONFIG[country] || PRICING_CONFIG.default;
}

export function formatPrice(price: number, currency: string, symbol: string): string {
  switch (currency.toLowerCase()) {
    case 'usd':
    case 'mxn':
      return `${symbol}${price.toFixed(2)}`;
    case 'clp':
      return `${symbol}${price.toLocaleString('es-CL')}`;
    default:
      return `${symbol}${price}`;
  }
}

export function getStripeAmount(price: number, currency: string): number {
  // Stripe expects amounts in cents/smallest currency unit
  switch (currency.toLowerCase()) {
    case 'usd':
    case 'mxn':
      return Math.round(price * 100); // Convert to cents
    case 'clp':
      return Math.round(price); // CLP is already in smallest unit
    default:
      return Math.round(price);
  }
} 