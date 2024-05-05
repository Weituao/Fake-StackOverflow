function validateHyperLinks(text){
  return (text.match(/\[[^\]]*\]\([^)]*\)/g) ?? []).length !== (text.match(/\[[^\]]*\]\((https?:\/\/[^)]*)\)/g) ?? []).length ? true : false;
} 

export default validateHyperLinks;
