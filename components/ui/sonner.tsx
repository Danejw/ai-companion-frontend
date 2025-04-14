"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group max-w-[42vw] sm:max-w-[260px] text-sm p-2"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--primary-foreground)",
          "--success-text": "var(--primary)",
          "--success-border": "var(--border)",
          "--error-bg": "var(--primary-foreground)",
          "--error-text": "var(--primary)",
          "--error-border": "var(--destructive)",
          "--border-radius": "var(--radius)",
          "--info-bg": "var(--primary-foreground)",
          "--info-text": "var(--primary)",
          "--info-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
