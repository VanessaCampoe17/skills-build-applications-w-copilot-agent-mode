# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## API configuration

The frontend requests the OctoFit API on port `8000`. In Codespaces, define
`VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` using your
Codespace name (the value after `https://` and before `-5173.app.github.dev`):

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

Vite reads this variable when it starts, so restart the frontend after changing
`.env.local`. When the variable is unset, the frontend uses
`http://localhost:8000` for local development.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
