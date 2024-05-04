import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GenerateHtmlForTags({ tagIds, qid }) {
  const [isthetgs, getthetags] = useState([]);

  useEffect(() => {
    const getthed = async () => {
      const getthet = tagIds.map((tagId) => getTagById(tagId));
      Promise.all(getthet)
        .then((fetchedTags) => {
          getthetags(fetchedTags);
        })
        .catch((error) => {
          console.error('Error fetching tags:', error);
          getthetags([]);
        });
    };
    getthed();
  }, [tagIds]);

  return (
    <ul key={qid} id="question-tags">
      {isthetgs.length
        ? isthetgs.map((tag, index) => <li key={qid + tagIds[index]}>{tag}</li>)
        : <li>No tags found</li>
      }
    </ul>
  );
}

async function getTagById(tagId) {
  const defaulturl = 'http://localhost:8000/posts/tags/tag_id/';
  const url = defaulturl + tagId;
  const getanswer = await axios.get(url);
  return getanswer.data.name;
}

export { getTagById };
export default GenerateHtmlForTags;
