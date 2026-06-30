# Musivue

Musivue is a modern and responsive music app built entirely with Vue 3. It features a sleek audio player UI, user-friendly navigation, and modular component-based architecture.

## Tech Stack

- Vue 3
- Vite for development/build tooling
- Vue Router for navigation
- Pinia for state management
- TailwindCSS

### Project Structure

```sh
src/
├── assets/ # Static files (images, icons, etc.)
├── components/ # Reusable components
├── includes/ # Third-party plugins / libraries
├── router/ # Vue Router configuration
├── stores/ # Global states (Pinia)
├── views/ # Main view-level components (pages)
├── App.vue # Root component
├── main.js # Entry point
```

### Project Setup

```sh
git clone <repository-url>
cd musivue
```

### Install dependencies

```sh
npm install
```

### 🔐 Firebase (Database) Configuration

To connect to your own Firebase project:

1. Create a `.env` file in the root of the project.
2. Copy the structure from `.env.example` and fill in your Firebase project values.

### Start the development server

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
