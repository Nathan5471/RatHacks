export default function LinkDetectedText({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  const linkRegex = /\b((https?:\/\/)?[\w.-]+\.[a-z]{2,})(\/\S*)?\b/gi;
  const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/gi;
  const combinedRegex = new RegExp(
    `${linkRegex.source}|${emailRegex.source}`,
    "gi"
  );

  const parts = [];
  let lastIndex = 0;

  text.replace(combinedRegex, (match, _, __, ___, index) => {
    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    if (emailRegex.test(match)) {
      parts.push(
        <a
          key={index}
          href={`mailto:${match}`}
          className="text-primary-a0 spooky:text-spooky-a0 hover:underline"
        >
          {match}
        </a>
      );
    } else {
      const href = match.startsWith("http") ? match : `https://${match}`;
      parts.push(
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-a0 spooky:text-spooky-a0 hover:underline"
        >
          {match}
        </a>
      );
    }

    lastIndex = index + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <p className={className}>{parts}</p>;
}
