import type React from "react";
import type { DatePickerTheme } from "./types";

const THEME_VAR_MAP: Record<keyof DatePickerTheme, string> = {
  background: "--ezdp-bg",
  surface: "--ezdp-surface",
  border: "--ezdp-border",
  text: "--ezdp-text",
  muted: "--ezdp-muted",
  primary: "--ezdp-primary",
  primaryStrong: "--ezdp-primary-strong",
  primarySoft: "--ezdp-primary-soft",
  shadow: "--ezdp-shadow",
  fontFamily: "--ezdp-font-family",
  inputRadius: "--ezdp-input-radius",
  panelRadius: "--ezdp-panel-radius",
  dayRadius: "--ezdp-day-radius"
};

export function buildThemedStyle(
  theme?: Partial<DatePickerTheme>,
  style?: React.CSSProperties
): React.CSSProperties | undefined {
  if (!theme) return style;

  const nextStyle: React.CSSProperties = { ...(style ?? {}) };
  (Object.keys(THEME_VAR_MAP) as Array<keyof DatePickerTheme>).forEach((token) => {
    const value = theme[token];
    if (!value) return;
    const varName = THEME_VAR_MAP[token];
    (nextStyle as Record<string, string>)[varName] = value;
  });

  return nextStyle;
}
