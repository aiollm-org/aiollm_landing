import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';

hljs.registerLanguage('python', python);

export function CodeBlock({ code, id }: { code: string; id?: string }) {
  const highlighted = hljs.highlight(code, { language: 'python' }).value;

  // highlight.js escapes source text before generating its own token spans.
  return (
    <code
      id={id}
      lang="en"
      className="language-python"
      dangerouslySetInnerHTML={{ __html: highlighted }}
    />
  );
}
