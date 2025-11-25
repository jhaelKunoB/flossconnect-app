/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

// tokens/base.ts
export const Colors = {
  light: {
    text: "#34444b",
    background: "#ffffffff",
    secodbackground: "#1F2937",
    tint: "#516067",
    icon: "#707f86",
    tabIconDefault: "#aab7bc",
    tabIconSelected: "#516067",
    card: "#ffffff",
    foreground50: "#e6f0f5",
    foreground100: "#c7d3d9",
    foreground200: "#aab7bc",
    foreground300: "#8d9ba1",
    foreground400: "#707f86",
    foreground500: "#516067",
    background600: "#34444b",
    background700: "#1d2e35",
    background800: "#081921",
    background900: "#00080f",
    background950: "#000102",
  },
  dark: {
    text: "#e6f0f5",
    background: "#34444b",
    tint: "#aab7bc",
    icon: "#8d9ba1",
    tabIconDefault: "#707f86",
    tabIconSelected: "#e6f0f5",
    card: "#1d2e35",
    foreground50: "#e6f0f5",
    foreground100: "#c7d3d9",
    foreground200: "#aab7bc",
    foreground300: "#8d9ba1",
    foreground400: "#707f86",
    foreground500: "#516067",
    background600: "#34444b",
    background700: "#1d2e35",
    background800: "#081921",
    background900: "#00080f",
    background950: "#000102",
  },
};


export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
