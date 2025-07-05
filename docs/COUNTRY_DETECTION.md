# Country Detection System

This document explains how the country and language detection system works in the SmartInvite application.

## Overview

The application runs on the subdomain `app.smartinvite.me` but needs to detect the country and language based on the main domain `smartinvite.me` and its path segments (/, /mx, /pa, etc.).

## How It Works

### 1. Domain Detection
- **Main Domain**: `smartinvite.me` (with paths like `/mx`, `/pa`, `/us`)
- **App Subdomain**: `app.smartinvite.me` (where the application runs)

### 2. Detection Methods (in order of priority)

1. **Referrer Detection**: If the user came from the main domain, we check the referrer URL
2. **URL Parameters**: Check for a `?country=XX` parameter
3. **Path Segments**: Check if the current path contains country codes
4. **Browser Language**: Fallback to browser language detection

### 3. Country to Language Mapping

- `US` → `en` (English)
- `MX` → `es` (Spanish)
- `PA` → `es` (Spanish)
- Default → `es` (Spanish)

## Usage

### Basic Usage

```typescript
import { detectCountryFromURL, detectLanguageFromCountry } from '../lib/countryDetection';

// Detect country
const country = detectCountryFromURL(); // Returns 'US', 'MX', 'PA', or ''

// Detect language based on country
const language = detectLanguageFromCountry(country); // Returns 'en' or 'es'
```

### Using the Hook

```typescript
import { useCountryDetection } from '../hooks/useCountryDetection';

function MyComponent() {
  const { country, language, detected, refreshDetection } = useCountryDetection();
  
  return (
    <div>
      <p>Country: {country}</p>
      <p>Language: {language}</p>
      <p>Detected: {detected ? 'Yes' : 'No'}</p>
      <button onClick={refreshDetection}>Refresh</button>
    </div>
  );
}
```

### Complete Information

```typescript
import { getCountryAndLanguage } from '../lib/countryDetection';

const info = getCountryAndLanguage();
// Returns: { country: 'US', language: 'en', detected: true }
```

## Files

- `src/lib/countryDetection.ts` - Core detection functions
- `src/hooks/useCountryDetection.ts` - React hooks for detection
- `src/components/CountryDetectionExample.tsx` - Example component

## Examples

### URL Patterns

| URL | Detected Country | Language |
|-----|------------------|----------|
| `smartinvite.me` | `US` | `en` |
| `smartinvite.me/mx` | `MX` | `es` |
| `smartinvite.me/pa` | `PA` | `es` |
| `smartinvite.me/us` | `US` | `en` |
| `app.smartinvite.me` | `''` (empty) | `es` (default) |

### Referrer Detection

When a user navigates from `smartinvite.me/mx` to `app.smartinvite.me`, the system will:
1. Detect they're on the app subdomain
2. Check the referrer (`smartinvite.me/mx`)
3. Extract the country code (`MX`)
4. Set the language to Spanish (`es`)

## Integration with i18n

The system automatically updates the i18n language when a country is detected:

```typescript
import { updateLanguageFromCountry } from '../lib/countryDetection';

const country = detectCountryFromURL();
updateLanguageFromCountry(i18n, country);
```

## Testing

You can test the detection by:

1. Using the `CountryDetectionExample` component
2. Checking browser console logs
3. Testing different URL patterns
4. Using the refresh function to re-detect

## Troubleshooting

### Common Issues

1. **No country detected**: Check if the referrer is being passed correctly
2. **Wrong language**: Verify the country-to-language mapping
3. **Subdomain issues**: Ensure the detection logic handles `app.smartinvite.me` correctly

### Debug Information

The system logs detailed information to the console:
- Current hostname and pathname
- Referrer information
- Detection results
- Language changes 