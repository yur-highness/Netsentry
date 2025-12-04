
# steps to launch the project


Clone the Repository: Start by cloning the repository from GitHub. You can do this by running the following command in your terminal:
git clone https://github.com/yur-highness/Netsentry.git

Navigate to the Project Directory: Navigate to the project directory by running the following command:
cd netsentry

Install Dependencies: Install the project dependencies by running the following command:
pnpm install

Compile TypeScript: Compile the TypeScript code by running the following command:
pnpm build

Launch the Development Server: Launch the development server by running the following command:
pnpm dev

Open the Application: Open your browser and navigate to http://localhost:3000 to see the application in action.

or forget about setting up the project  
live link of the project- https://netsentry-taupe.vercel.app/


# features

Landing Page: This is the initial page that users see when they access the app. It includes a hero section with a title and a description, as well as a grid background.

Dashboard: This is the main page of the app where users can access various network scanning tools. It is accessible from the landing page.

Network Tools: This section of the app provides several network scanning tools, including:
Scanner: This tool allows users to perform network scans on a target IP or domain.

Map: This tool visualizes network data on a world map.

DNS: This tool allows users to check DNS records for a given domain.

AI Analyst: This tool analyzes network data and provides security insights.

Profile Settings: This tool allows users to manage their profile settings.

Subnet Calculator: This tool allows users to calculate subnet details, such as the number of hosts and subnets.

SSL Inspector: This tool allows users to inspect SSL certificates of a given domain.

Config Generator: This tool generates network configuration files based on user input.

MAC Lookup: This tool allows users to lookup MAC address information.

DNS Propagation: This tool simulates DNS propagation by checking DNS records from different locations.

Bot Automation: This tool allows users to automate network scanning tasks.

Geolocation Tracker: This tool tracks the geolocation of DNS requests.
The app is built using React, TypeScript, Vite, and Lucide React icons. It also uses GSAP for animations.



# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

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

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

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

