interface Props {
  text: string;
  keyword: string;
}

export default function KeywordHighlight({ text, keyword }: Props) {
  if (!keyword) return <>{text}</>;

  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark key={i} style={{ backgroundColor: "#ffeb3b", padding: "0 2px" }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
