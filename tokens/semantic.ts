// tokens/semantic.ts
import { Colors } from "@/constants/theme";

export const semanticTokens = (scheme: "light" | "dark") => {
  const c = Colors[scheme];

  return {
    // Texto
    textPrimary: c.text,
    textSecondary: c.foreground400,
    textInverse: c.foreground50,
    textMuted: c.foreground500,

    // Superficies
    surface: c.card,
    surfaceAlt: scheme === "light" ? c.foreground50 : c.background700,
    backdrop: c.background,
    backdropAlt: scheme === "light" ? c.background600 : c.background800,

    // Bordes
    border: scheme === "light" ? c.foreground200 : c.foreground400,

    // Acciones
    primary: c.tint,
    primaryContrast: scheme === "light" ? c.background : c.text, // texto encima del primary
    secondary: scheme === "light" ? c.background : c.card,
    secondaryContrast: scheme === "light" ? c.tint : c.foreground50,

    // Estados (por si los usas)
    success: "#1DB954",
    warning: "#F59E0B",
    danger: "#EF4444",
  };
};
