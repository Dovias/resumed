import type {Config} from "tailwindcss";

export default {
  "content": ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  "theme": {
    "extend": {
      "borderWidth": {
        "2": "0.178rem",
        "4": "0.2rem"
      },
      "fontSize": {		
        "heading-100": "var(--size-text-heading-100)",
        "heading-200": "var(--size-text-heading-200)",
        "heading-300": "var(--size-text-heading-300)",

        "paragraph": "var(--size-text-paragraph)"
      },
      "colors": {
        "primary": "rgba(var(--color-primary))",
        "secondary": "rgba(var(--color-secondary))",
        "foreground": "rgba(var(--color-foreground))",
        "background": "rgba(var(--color-background))",
        "selection": "rgba(var(--color-selection))",
        "contour": "rgba(var(--color-contour))"
      },

      "textColor": {
        "primary": "rgba(var(--color-text-primary))",
        "secondary": "rgba(var(--color-text-secondary))",
        "foreground": "rgba(var(--color-text-foreground))",
        "background": "rgba(var(--color-text-background))",
        "selection": "rgba(var(--color-text-selection))"
      }
    }
  }
} satisfies Config;
