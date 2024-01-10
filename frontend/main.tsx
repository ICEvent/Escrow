import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"

import { createRoot } from 'react-dom/client';
import { ChosenThemeProvider, ThemeProvider } from './providers'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
      <ChosenThemeProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ChosenThemeProvider>
  </React.StrictMode>
)
