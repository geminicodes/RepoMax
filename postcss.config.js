import { fileURLToPath } from "node:url";

const tailwindConfigPath = fileURLToPath(new URL("./tailwind.config.ts", import.meta.url));

export default {
  plugins: {
    // Explicit path so Vite (running from /client) still loads root config.
    tailwindcss: { config: tailwindConfigPath },
    autoprefixer: {}
  }
};
