function generateDate(time1, time2) {
  time1 = new Date(time1);
  let gapbetween = time2 - time1;
  let gapbtweensec = gapbetween / 1000;

  return Math.round(gapbtweensec) < 60
    ? `${Math.round(gapbtweensec)} seconds ago`
    : Math.round(gapbtweensec) < 3600
    ? `${Math.round(gapbtweensec / 60)} minutes ago`
    : Math.round(gapbtweensec) < 86400
    ? `${Math.round(gapbtweensec / 3600)} hours ago`
    : gapbtweensec / 86400 < 365
    ? `${time1.toLocaleString('default', { month: 'short' })} ${time1.getDate()} at ${('0' + time1.getHours()).slice(-2)}:${('0' + time1.getMinutes()).slice(-2)}`
    : `${time1.toLocaleString('default', { month: 'short' })} ${time1.getDate()}, ${time1.getFullYear()} at ${('0' + time1.getHours()).slice(-2)}:${('0' + time1.getMinutes()).slice(-2)}`;
}

export default generateDate;
