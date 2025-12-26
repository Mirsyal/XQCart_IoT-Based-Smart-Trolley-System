import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["xqcart_icon.png"],
      manifest: {
        name: "Smart Trolley",
        short_name: "XQCart",
        description: "IoT Smart Trolley System App",
        theme_color: "#ff9800",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "xqcart_icon.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "xqcart_icon.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ]
})
