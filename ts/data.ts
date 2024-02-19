/* exported data */

const data: {
  view: string;
  entries: unknown[];
  editing: null;
  nextEntryId: number;
} = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
};

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.set('journal-local-storage', dataJSON);
});
