// tokens/semantic.ts

import { Colors } from "@constants/theme";

/* ========================================================================== */
/*                              SEMANTIC TOKENS                               */
/* ========================================================================== */

export const semanticTokens = (
  scheme: "light" | "dark"
) => {
  const c = Colors[scheme];

  return {
    /* ---------------------------------------------------------------------- */
    /* TEXTO                                                                  */
    /* ---------------------------------------------------------------------- */

    textPrimary: c.text,

    textSecondary: c.foreground400,

    textInverse: c.foreground50,

    textMuted: c.foreground500,

    /* ---------------------------------------------------------------------- */
    /* SUPERFICIES                                                            */
    /* ---------------------------------------------------------------------- */

    surface: c.card,

    surfaceAlt:
      scheme === "light"
        ? c.foreground50
        : c.background700,

    backdrop: c.background,

    backdropAlt:
      scheme === "light"
        ? c.background600
        : c.background800,

    /* ---------------------------------------------------------------------- */
    /* BORDES                                                                 */
    /* ---------------------------------------------------------------------- */

    border:
      scheme === "light"
        ? c.foreground200
        : c.foreground400,

    /* ---------------------------------------------------------------------- */
    /* ACCIONES                                                               */
    /* ---------------------------------------------------------------------- */

    primary: c.tint,

    primaryContrast:
      scheme === "light"
        ? c.background
        : c.text,

    secondary:
      scheme === "light"
        ? c.background
        : c.card,

    secondaryContrast:
      scheme === "light"
        ? c.tint
        : c.foreground50,

    /* ---------------------------------------------------------------------- */
    /* ESTADOS                                                                */
    /* ---------------------------------------------------------------------- */

    success: "#1DB954",

    warning: "#F59E0B",

    danger: "#EF4444",

    violet: "#8B5CF6",
  };
};

/* ========================================================================== */
/*                                   TYPE                                     */
/* ========================================================================== */

export type SemanticTokens =
  ReturnType<typeof semanticTokens>;