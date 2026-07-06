# Data Directory

This directory contains generated data files extracted from the
Production/niu-dash source of truth.

## Regenerating

```bash
node scripts/extract-data.mjs
```

This reads `../../Production/niu-dash/index.html` (relative to the script)
and writes `projects.json`.

## Why?

The Production/niu-dash project maintains the canonical project database
(112+ projects, 5 categories). This extraction pipeline makes the same
data available to the Next.js dashboard at build time while keeping
Production/niu-dash as the single source of truth.
