---
title: Internationalization
tags: i18n, next-intl, translations, localization
---

## Internationalization

### Configuration

| Setting | Value |
|---------|-------|
| Library | `next-intl` |
| Default locale | `en` (English) |
| Supported | `en`, `de` (German) |
| Strategy | Cookie-based (`NEXT_LOCALE`) |

### Translation Files

```
messages/
├── en.json    # English (default)
└── de.json    # German
```

**Structure:**

```json
{
  "Common": {
    "save": "Save",
    "cancel": "Cancel",
    "loading": "Loading..."
  },
  "Auth": {
    "signIn": "Sign In",
    "welcome": "Welcome, {name}!"
  },
  "Gallery": {
    "itemCount": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
  }
}
```

### Usage Patterns

**Server Components:**

```typescript
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');

  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('stats.totalFiles')}</p>
    </div>
  );
}
```

**Client Components:**

```typescript
'use client';

import { useTranslations } from 'next-intl';

export function WelcomeMessage({ name }: { name: string }) {
  const t = useTranslations('Auth');

  return <p>{t('welcome', { name })}</p>;
}
```

### Formatting

**Numbers:**

```typescript
import { useFormatter } from 'next-intl';

function StorageDisplay({ bytes }: { bytes: number }) {
  const format = useFormatter();

  return (
    <span>
      {format.number(bytes / 1_000_000, {
        style: 'unit',
        unit: 'megabyte',
        maximumFractionDigits: 1
      })}
    </span>
  );
}
```

**Dates:**

```typescript
const format = useFormatter();
format.dateTime(date, { dateStyle: 'medium' })
format.relativeTime(date)
```

### Pluralization

```json
{
  "Gallery": {
    "itemCount": "{count, plural, =0 {No items} =1 {1 item} other {# items}}"
  }
}
```

```typescript
t('itemCount', { count: 0 })   // "No items"
t('itemCount', { count: 1 })   // "1 item"
t('itemCount', { count: 5 })   // "5 items"
```

### Rules

```typescript
// ❌ Never hardcode text
<button>Save Changes</button>

// ✅ Always use translations
<button>{t('Common.save')}</button>
```

### Locale Switching

```typescript
'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = (newLocale: string) => {
    Cookies.set('NEXT_LOCALE', newLocale, { expires: 365 });
    router.refresh();
  };

  return (
    <select
      value={locale}
      onChange={(e) => switchLocale(e.target.value)}
    >
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
```
