"use client";

import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

type CodeSnippetProps = {
  title: string;
  code: string;
  language?: string;
};

export function CodeSnippet({ title, code, language = "tsx" }: CodeSnippetProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="snippet">
      <div className="snippet-head">
        <div>
          <p className="snippet-title">{title}</p>
          <p className="snippet-lang">{language}</p>
        </div>
        <button type="button" className="snippet-copy" onClick={handleCopy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} snippet-code`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="snippet-line-no">{i + 1}</span>
                <span className="snippet-line-content">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
