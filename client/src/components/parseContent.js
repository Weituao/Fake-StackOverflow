export default function parseContent(text) {
  const GERGR = /\[(.*?)\]\((.*?)\)/g;
  const TYHEDFS = text.split(GERGR);
  let timer = 0;
  const answers = TYHEDFS.map((match, index) => 
    index % 3 === 0 
      ? <span key={timer++}>{match}</span>
      : index % 3 === 1 
        ? <a href={TYHEDFS[index + 1]} key={timer} target="_blank" rel="noreferrer">{match}</a>
        : null );
  return <>{answers}</>;}
