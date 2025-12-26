"use client"

import * as React from "react"
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFilename,
  CodeBlockFiles,
  CodeBlockHeader,
  CodeBlockItem,
  type CodeBlockData,
} from "@/registry/new-york/ui/codeblock"

interface SimpleCodeblockProps {
  code: string
  language?: string
  filename?: string
  className?: string
  showCopy?: boolean
  showLineNumbers?: boolean
}

export function SimpleCodeblock({
  code,
  language = "tsx",
  filename,
  className,
  showCopy = true,
  showLineNumbers = false,
}: SimpleCodeblockProps) {
  const data: CodeBlockData[] = React.useMemo(
    () => [
      {
        value: language,
        filename: filename,
        code: code,
        language: language,
      },
    ],
    [code, language, filename]
  )

  return (
    <CodeBlock
      data={data}
      defaultValue={language}
      showLineNumbers={showLineNumbers}
      className={className}
    >
      {(filename || showCopy) && (
        <CodeBlockHeader>
          {filename && (
            <CodeBlockFiles>
              {(item) => (
                <CodeBlockFilename key={item.value} value={item.value}>
                  {item.filename}
                </CodeBlockFilename>
              )}
            </CodeBlockFiles>
          )}
          {!filename && <div />}
          {showCopy && <CodeBlockCopyButton />}
        </CodeBlockHeader>
      )}
      <CodeBlockBody>
        {(item) => (
          <CodeBlockItem key={item.value} value={item.value}>
            <CodeBlockContent />
          </CodeBlockItem>
        )}
      </CodeBlockBody>
    </CodeBlock>
  )
}
