# Cloud Intellect Website

A React website for Cloud Intellect, built with [Vite](https://vite.dev/) and React 19.

## ⚠️ Important: Use Yarn

**This project has issues with npm on Windows.** Use Yarn instead:

```bash
# Install Yarn (one-time)
npm install -g yarn

# Then use yarn for everything
yarn install
yarn dev
yarn build
```

## Getting started

```bash
# Install dependencies
yarn install

# Start the development server
yarn dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- **`yarn dev`** – Start the dev server with hot reload
- **`yarn build`** – Build for production (output in `dist/`)
- **`yarn preview`** – Preview the production build locally
- **`yarn lint`** – Run ESLint

## Deployment

See **[VPS_DEPLOYMENT.md](./VPS_DEPLOYMENT.md)** for production deployment instructions.

## Project structure

- `src/App.jsx` – Main app component (landing page)
- `src/App.css` – App styles
- `src/index.css` – Global styles
- `src/main.jsx` – Entry point
- `index.html` – HTML template
- `public/` – Static assets (images, favicons, etc.)
- `src/assets/` – Component images (imported in code)

## Adding Images

See **[IMAGE_GUIDE.md](./IMAGE_GUIDE.md)** for detailed instructions on where to upload images and how to use them.

**Quick reference:**

- **`public/`** – Use `/image.jpg` in your code
- **`src/assets/`** – Import: `import img from './assets/image.jpg'`

You can add more pages, components, and routes as you grow the site. Consider adding [React Router](https://reactrouter.com/) when you need multiple pages.
