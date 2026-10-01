// hooks/useSemanticColors.ts

import { useColorScheme } from "react-native";

import { semanticTokens } from "@/tokens/semantic";

export function useSemanticColors() {
  const scheme =
    useColorScheme() === "dark"
      ? "dark"
      : "light";

  return semanticTokens(scheme);
}