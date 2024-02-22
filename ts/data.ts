/* exported data */

let data: {
  view: string;
  entries: FormObject[];
  editing: null | FormObject;
  nextEntryId: number;
  sort: string;
  tags: string[];
} = {
  view: 'entry-form',
  entries: [],
  editing: null,
  nextEntryId: 1,
  sort: 'newest-down',
  tags: [],
};

window.addEventListener('beforeunload', () => {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('journal-local-storage', dataJSON);
});

const previousDataJSON = localStorage.getItem('journal-local-storage');
if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
}
