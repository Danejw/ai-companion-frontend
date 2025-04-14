import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github.css" // or any other highlight theme
import { cn } from "@/lib/utils"

export function MarkdownRenderer({ 
    children, 
    content, 
    className = "" 
}: { 
    children?: React.ReactNode;
    content?: string;
    className?: string 
}) {
    // Use content prop if provided, otherwise convert children to string
    const markdownContent = content || (typeof children === 'string' ? children : '');
    
    return (
        <div className={cn("prose prose-neutral dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                children={markdownContent}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
            />
        </div>
    )
}
