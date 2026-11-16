# React + TypeScript + Vite

## Cloudinary media integration

The dashboard keeps the existing `/api/upload/image` upload contract. A compatible
backend should authenticate staff uploads, validate image MIME/size, store images in
Cloudinary, and return `{ url, public_id }` (or those fields inside `data`). Never put
Cloudinary credentials in this Vite app. The Media Library additionally expects:

- `GET /api/media?search=&category=` returning `{ data: MediaAsset[] }`.
- `POST /api/media/:public_id/replace` as multipart field `image`, returning the
  replacement `{ url, public_id, ... }`.
- `DELETE /api/media/:public_id`, restricted to explicitly selected Cloudinary assets.

These server endpoints are not included in this frontend-only repository. Existing
product gallery records and review image arrays keep their URL-based compatibility.

### Safe copy migration

The scripts below only upload copies from `public/` (or directories listed in
`MEDIA_SCAN_DIRS`) through the authenticated backend. They do not edit original
files, PostgreSQL, or application URLs. The JSON manifest records old URL, Cloudinary
URL, `public_id`, SHA-256, and per-file errors. Uploading requires the backend to
deduplicate by `sha256`/`source_path` to avoid duplicate assets when a run is retried.

```powershell
$env:MEDIA_MIGRATION_TOKEN = "<authorized staff token>"
$env:MEDIA_API_ORIGIN = "http://localhost:5000"
npm run media:migrate
npm run media:verify
```

Set `MEDIA_SCAN_DIRS` to a path-separated list to include additional existing image
directories. Verification checks each reported Cloudinary URL via HTTP HEAD. No SQL
URL migration is provided by this frontend repository; database backup, rollback,
and URL replacement must be implemented and reviewed alongside the actual backend
schema after successful verification.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
