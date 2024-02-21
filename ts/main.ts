/* global data */
interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  url: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

interface SearchFormElements extends HTMLFormControlsCollection {
  search: HTMLInputElement;
  'search-select': HTMLSelectElement;
}

interface FormObject {
  title: string;
  url: string;
  notes: string;
  entryID: number;
}

const $urlLinkInput = document.querySelector('#photo-url') as HTMLInputElement;
const $titleInput = document.querySelector('#title') as HTMLInputElement;
const $notesInput = document.querySelector('#notes') as HTMLTextAreaElement;
const $entryForm = document.querySelector('#entry-form') as HTMLFormElement;
const $previewPhoto = document.querySelector('.preview');
const $ul = document.querySelector('ul');
const $entryTitle = document.querySelector('.entry-title');
const $entriesTitle = document.querySelector('.entries-title > h2');
const $deleteButton = document.querySelector('.delete-col');
const $openModal = document.querySelector('.open-modal');
const $closeModal = document.querySelector('.dismiss-modal');
const $dialog = document.querySelector('dialog');
const $confirmDelete = document.querySelector('.confirm-delete');
const $searchBar = document.querySelector('.search-col');
const $search = document.querySelector('#search-bar') as HTMLFormElement;
if (
  !$entryTitle ||
  !$entriesTitle ||
  !$urlLinkInput ||
  !$entryForm ||
  !$ul ||
  !$notesInput ||
  !$deleteButton ||
  !$search
)
  throw new Error(
    '$urlLinkInput, $entryForm, $ul, $entryTitle, $deleteButton, $search or $notesInput query failed'
  );
if (!$openModal || !$closeModal || !$dialog || !$confirmDelete) {
  throw new Error(
    '$openModal, $closeModal, $dialog, $confirmDelete query failed'
  );
}

$urlLinkInput.addEventListener('input', (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
    $previewPhoto?.setAttribute('src', eventTarget.value);
  }
});

$entryForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $entryForm.elements as FormElements;
  if (data.editing === null) {
    const $formObject: FormObject = {
      title: $formElements.title.value,
      url: $formElements.url.value,
      notes: $formElements.notes.value,
      entryID: data.nextEntryId,
    };
    data.nextEntryId++;
    data.entries.unshift($formObject);
    const $newEntry = renderEntry($formObject);
    $ul.prepend($newEntry);
    toggleNoEntries();
  } else {
    const $formObject: FormObject = {
      title: $formElements.title.value,
      url: $formElements.url.value,
      notes: $formElements.notes.value,
      entryID: data.editing.entryID,
    };
    let updatingEntry = data.entries.find(
      (entry: FormObject) => entry.entryID === $formObject.entryID
    );
    const updatingIndex = data.entries.findIndex(
      (entry: FormObject) => updatingEntry === entry
    );
    const $oldEntry = document.querySelector(
      `[data-id='${updatingEntry?.entryID}']`
    ) as Node;
    updatingEntry = $formObject;
    data.entries[updatingIndex] = updatingEntry;
    const $newEntry = renderEntry(updatingEntry);
    $ul.replaceChild($newEntry, $oldEntry);
    data.editing = null;
    $deleteButton!.classList.add('hide');
  }
  viewSwap('entries');
});

function renderEntry(entry: FormObject): HTMLLIElement {
  const $containingLi = document.createElement('li');
  $containingLi.setAttribute('data-id', `${entry.entryID}`);
  const $containingRowDiv = document.createElement('div');
  $containingRowDiv.classList.add('row');
  const $imgColDiv = document.createElement('div');
  $imgColDiv.classList.add('column-full', 'column-half');
  const $textColDiv = document.createElement('div');
  $textColDiv.classList.add('column-full', 'column-half');
  const $titleRowDiv = document.createElement('div');
  $titleRowDiv.classList.add('row');
  const $titleColDiv = document.createElement('div');
  $titleColDiv.classList.add('column-full');
  const $titleIconRow = document.createElement('div');
  $titleIconRow.classList.add('row', 'icon-row');
  const $parRowDiv = document.createElement('div');
  $parRowDiv.classList.add('row');
  const $parColDiv = document.createElement('div');
  $parColDiv.classList.add('column-full');
  const $image = document.createElement('img');
  $image.setAttribute('src', entry.url);
  $image.setAttribute('alt', entry.title);
  const $title = document.createElement('h4');
  $title.textContent = entry.title;
  const $icon = document.createElement('i');
  $icon.classList.add('fa-solid', 'fa-pencil');
  const $paragraph = document.createElement('p');
  $paragraph.textContent = entry.notes;
  $parColDiv.appendChild($paragraph);
  $parRowDiv.appendChild($parColDiv);
  $titleIconRow.appendChild($title);
  $titleIconRow.appendChild($icon);
  $titleColDiv.appendChild($titleIconRow);
  $titleRowDiv.appendChild($titleColDiv);
  $textColDiv.appendChild($titleRowDiv);
  $textColDiv.appendChild($parRowDiv);
  $imgColDiv.appendChild($image);
  $containingRowDiv.appendChild($imgColDiv);
  $containingRowDiv.appendChild($textColDiv);
  $containingLi.appendChild($containingRowDiv);
  return $containingLi;
}

document.addEventListener('DOMContentLoaded', () => {
  data.entries.forEach((entry: FormObject) => {
    const $newEntry = renderEntry(entry);
    $ul.append($newEntry);
  });
  viewSwap(data.view);
  toggleNoEntries();
});

function toggleNoEntries(): void {
  const $noEntries = document.querySelector('.no-entries');
  if (data.entries.length > 0) {
    $noEntries?.classList.add('hidden');
  } else {
    $noEntries?.classList.remove('hidden');
  }
}

function viewSwap(view: string): void {
  const $views = document.querySelectorAll(
    '[data-view]'
  ) as NodeListOf<HTMLDivElement>;
  $views.forEach((div: HTMLDivElement) => {
    if (view === div.dataset.view) {
      div.classList.remove('hidden');
    } else {
      div.classList.add('hidden');
    }
  });
  if (view === 'entries') {
    $searchBar?.classList.remove('hidden');
  } else if (view === 'entry-form') {
    $searchBar?.classList.add('hidden');
  }
  for (const entry of data.entries) {
    const $entry = document.querySelector(`[data-id='${entry.entryID}']`);
    $entry?.classList.remove('hidden');
  }
  data.view = view;
  $entryForm.reset();
  $previewPhoto?.setAttribute('src', 'images/placeholder-image-square.jpg');
  $deleteButton!.classList.add('hide');
  $entriesTitle!.textContent = 'Entries';
  $entryTitle!.textContent = 'New Entry';
}

const $anchors = document.querySelectorAll('a');
$anchors.forEach((anchor: HTMLAnchorElement) => {
  anchor.addEventListener('click', (event: Event): void => {
    const $eventTarget = event.target as HTMLAnchorElement;
    const $switchValue: string = $eventTarget.dataset.switch!;
    viewSwap($switchValue);
  });
});

$ul.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLElement;
  const $li = $eventTarget.closest('li');
  if (!$li) throw new Error('$li query failed');
  if ($eventTarget.tagName !== 'I') {
    return;
  }
  viewSwap('entry-form');
  $deleteButton!.classList.remove('hide');
  const $dataID: number = +$li.dataset.id!;
  data.entries.forEach((entry: FormObject) => {
    if ($dataID === entry.entryID) {
      data.editing = entry;
    }
  });
  $urlLinkInput.value = data.editing!.url;
  $previewPhoto?.setAttribute('src', data.editing!.url);
  $titleInput.value = data.editing!.title;
  $notesInput.value = data.editing!.notes;
  $entryTitle.textContent = 'Edit Entry';
});

$openModal.addEventListener('click', () => {
  $dialog.showModal();
});

$closeModal.addEventListener('click', () => {
  $dialog.close();
});

$confirmDelete.addEventListener('click', () => {
  $dialog.close();
  data.entries = data.entries.filter(
    (entry: FormObject) => entry !== data.editing
  );
  const $oldEntry = document.querySelector(
    `[data-id='${data.editing!.entryID}']`
  ) as Node;
  $ul.removeChild($oldEntry);
  toggleNoEntries();
  viewSwap('entries');
  data.editing = null;
});

$search.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $search.elements as SearchFormElements;
  const $searchQuery: string = $formElements.search.value;
  const $searchSelector: string = $formElements['search-select'].value;
  $search.reset();
  $entriesTitle!.textContent = 'Search Results:';
  console.log($searchQuery);
  console.log($searchSelector);
  for (const entry of data.entries) {
    let prop = '';
    switch ($searchSelector) {
      case 'title':
        prop = entry.title;
        break;
      case 'notes':
        prop = entry.notes;
        break;
    }
    if (!prop.includes($searchQuery)) {
      const $oldEntry = document.querySelector(`[data-id='${entry.entryID}']`);
      $oldEntry?.classList.add('hidden');
    }
  }
});
