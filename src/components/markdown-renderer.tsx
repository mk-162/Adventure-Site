import React from "react";

export function MarkdownRenderer({ content }: { content: string }) {
  // Simple markdown parser - converts markdown to JSX
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];
    let inList = false;
    let key = 0;

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${key++}`} className="list-disc list-inside space-y-2 mb-6">
            {listItems.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: parseInline(item) }} />
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3 key={`h3-${idx}`} className="text-2xl font-bold text-primary mt-8 mb-4">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={`h2-${idx}`} className="text-3xl font-bold text-primary mt-10 mb-6">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        flushList();
        elements.push(
          <h1 key={`h1-${idx}`} className="text-4xl font-bold text-primary mt-12 mb-8">
            {line.substring(2)}
          </h1>
        );
      }
      // List items
      else if (line.match(/^[\-\*]\s/)) {
        inList = true;
        listItems.push(line.substring(2));
      }
      // Empty line
      else if (line.trim() === "") {
        flushList();
      }
      // Paragraph
      else if (line.trim() !== "") {
        flushList();
        elements.push(
          <p
            key={`p-${idx}`}
            className="mb-6 text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseInline(line) }}
          />
        );
      }
    });

    flushList(); // Flush any remaining list

    return elements;
  };

  const parseInline = (text: string) => {
    // Bold **text**
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
    
    // Italic *text*
    text = text.replace(/\*(.+?)\*/g, '<em class="italic">$1</em>');
    
    // Links [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^\)]+)\)/g,
      '<a href="$2" class="text-accent-hover hover:underline font-semibold">$1</a>'
    );
    
    // Code `text`
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-slate-100 px-2 py-1 rounded text-sm font-mono">$1</code>'
    );
    
    return text;
  };

  return <div className="prose prose-lg max-w-none">{parseMarkdown(content)}</div>;
}
