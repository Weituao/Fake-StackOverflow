function parseContent(text) {
  const parser = /\[(.*?)\]\((.*?)\)/g;
  const issame = text.split(parser);
  let timer = 0;

  const answers = issame.map((match, index) => 
    index % 3 === 0 
      ? <span key={timer++}>{match}</span>
      : index % 3 === 1 
        ? <a href={issame[index + 1]} key={timer} target="_blank" rel="noreferrer">{match}</a>
        : null
  );

  return <>{answers}</>;
}

export default parseContent;
