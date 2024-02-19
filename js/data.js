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
  localStorage.set('journal-local-storage', dataJSON);
});
