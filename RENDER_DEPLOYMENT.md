# Render Deployment Configuration

## Option 1: Deploy React/TypeScript Version (Recommended for Render)

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
npm run preview
```

### Publish Directory:
```
dist
```

### Environment Variables:
- `NODE_VERSION`: `18.x` (optional, Render usually auto-detects)

### Notes:
- The build will create a `dist` folder with the compiled React app
- The preview server will serve the built files
- Make sure `index.html` in root has `<div id="root"></div>` for React to mount

---

## Option 2: Deploy Vanilla JS Version (Simpler, Static Site)

If you want to deploy the vanilla JS version (index.html, styles.css, script.js):

### Build Command:
```bash
echo "No build needed for static site"
```

### Start Command:
```bash
npx serve -s . -l 3000
```

### Publish Directory:
```
.
```

### Alternative (Using Static Site Host):
- Render Static Site service
- Root Directory: `.` (or leave empty)
- Build Command: (leave empty)
- Publish Directory: `.`

---

## Recommended: React Version Deployment

For the React/TypeScript version, use these settings in Render:

**Service Type:** Web Service

**Settings:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run preview`
- **Environment:** Node
- **Publish Directory:** `dist` (for static sites) OR leave empty (for web service)

**Note:** For Web Service type, Render will run the start command, so you don't need a Publish Directory. For Static Site type, use `dist` as the Publish Directory.

