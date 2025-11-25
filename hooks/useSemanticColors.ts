// hooks/useSemanticColors.ts
import { useColorScheme } from "react-native";
import { semanticTokens } from "@/tokens/semantic";

export function useSemanticColors() {
  const scheme = useColorScheme() ?? "light";
  return semanticTokens(scheme);
}
