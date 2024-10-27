import * as React from "react"
import { Button } from "@/components/ui/button"
import { GitHubLogoIcon } from "@radix-ui/react-icons"

interface GitHubButtonProps {
  href: string
  children: React.ReactNode
}

export function GitHubButton({ href, children }: GitHubButtonProps) {
  return (
    <Button asChild className="inline-flex items-center gap-2">
      <a href={href} target="_blank">
        <GitHubLogoIcon className="h-4 w-4" />
        {children}
      </a>
    </Button>
  )
} 