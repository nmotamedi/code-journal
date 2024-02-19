'use strict';
/* exported data */
let data = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
};
window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('journal-local-storage', dataJSON);
});
const previousDataJSON = localStorage.getItem('journal-local-storage');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}
