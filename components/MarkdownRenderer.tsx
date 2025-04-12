import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github.css" // or any other highlight theme
import { cn } from "@/lib/utils"

export function MarkdownRenderer({ content, className = "" }: { content: string, className?: string }) {
    return (
        <div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                children={content}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
            />
        </div>
    )
}
