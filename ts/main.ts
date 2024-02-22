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
  tags: string[];
}

const $urlLinkInput = document.querySelector('#photo-url') as HTMLInputElement;
const $titleInput = document.querySelector('#title') as HTMLInputElement;
const $notesInput = document.querySelector('#notes') as HTMLTextAreaElement;
const $tagsInput = document.querySelector('#tags') as HTMLInputElement;
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
const $tagContainer = document.querySelector('.tag-container');
const $search = document.querySelector('#search-bar') as HTMLFormElement;
const $tagList = document.querySelector('#tagList');
const $warning = document.querySelector('.warning');
let currentTags: string[] = [];
const $entriesSort = document.querySelector(
  '#entries-sort'
) as HTMLSelectElement;
if (
  !$entryTitle ||
  !$entriesTitle ||
  !$urlLinkInput ||
  !$entryForm ||
  !$ul ||
  !$notesInput ||
  !$deleteButton ||
  !$search ||
  !$tagsInput ||
  !$tagList
)
  throw new Error(
    '$urlLinkInput, $entryForm, $ul, $tagList, $entryTitle, $deleteButton, $search, $tagsInput or $notesInput query failed'
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

$tagsInput.addEventListener('keydown', (event: KeyboardEvent) => {
  $warning?.classList.add('hidden');
  if (event.key !== ' ') {
    return;
  }
  const tag = $tagsInput.value.trim();
  if (currentTags.includes(tag)) {
    $tagsInput.value = '';
    $warning!.textContent = `${tag} has already been added`;
    $warning?.classList.remove('hidden');
    return;
  }
  $tagsInput.focus();
  $tagsInput.value = '';
  $tagsInput.placeholder = '';
  const $tagWrapper = document.createElement('div');
  $tagWrapper.classList.add('column', 'tag-wrapper');
  const $icon = document.createElement('i');
  $icon.classList.add('fa-solid', 'fa-tag');
  const $tagText = document.createElement('p');
  currentTags.push(tag);
  $tagText.textContent = tag;
  $tagWrapper.appendChild($icon);
  $tagWrapper.appendChild($tagText);
  $tagContainer?.appendChild($tagWrapper);
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
      tags: currentTags,
    };
    data.nextEntryId++;
    const $newEntry = renderEntry($formObject);
    if (data.sort === 'newest-down') {
      data.entries.unshift($formObject);
      $ul.prepend($newEntry);
    } else {
      data.entries.push($formObject);
      $ul.appendChild($newEntry);
    }
    toggleNoEntries();
  } else {
    const $formObject: FormObject = {
      title: $formElements.title.value,
      url: $formElements.url.value,
      notes: $formElements.notes.value,
      entryID: data.editing.entryID,
      tags: currentTags,
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
  for (const tagMaster of currentTags) {
    if (!data.tags.includes(tagMaster)) {
      data.tags.push(tagMaster);
      const $tagOption = document.createElement('option');
      $tagOption.value = tagMaster;
      $tagOption.textContent = tagMaster;
      $tagList.appendChild($tagOption);
    }
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
  const $tagEntriesContainer = document.createElement('div');
  $tagEntriesContainer.classList.add('row', 'tag-container');
  for (const tag of entry.tags) {
    const $tagWrapper = document.createElement('div');
    $tagWrapper.classList.add('column', 'tag-wrapper');
    const $tagIcon = document.createElement('i');
    $tagIcon.classList.add('fa-solid', 'fa-tag');
    const $tagText = document.createElement('p');
    $tagText.textContent = tag;
    $tagWrapper.appendChild($tagIcon);
    $tagWrapper.appendChild($tagText);
    $tagEntriesContainer.appendChild($tagWrapper);
  }
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
  $textColDiv.appendChild($tagEntriesContainer);
  $containingLi.appendChild($containingRowDiv);
  return $containingLi;
}

document.addEventListener('DOMContentLoaded', () => {
  DOMLoadHandler();
  viewSwap(data.view);
  const options = $entriesSort.children as HTMLCollectionOf<HTMLOptionElement>;
  for (const option of options) {
    if (option.getAttribute('value') === data.sort) {
      option.defaultSelected = true;
    }
  }
  toggleNoEntries();
});

function DOMLoadHandler(): void {
  $ul!.textContent = '';
  data.entries.forEach((entry: FormObject) => {
    const $newEntry = renderEntry(entry);
    $ul!.append($newEntry);
  });
}

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
  currentTags = [];
  $previewPhoto?.setAttribute('src', 'images/placeholder-image-square.jpg');
  $deleteButton!.classList.add('hide');
  $entriesTitle!.textContent = 'Entries';
  $entryTitle!.textContent = 'New Entry';
  $entriesSort.classList.remove('hidden');
  $tagContainer!.textContent = '';
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
  if (!$eventTarget.className.includes('fa-pencil')) {
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
  for (const tag of data.editing!.tags) {
    const $tagWrapper = document.createElement('div');
    $tagWrapper.classList.add('column', 'tag-wrapper');
    const $icon = document.createElement('i');
    $icon.classList.add('fa-solid', 'fa-tag');
    const $tagText = document.createElement('p');
    $tagText.textContent = tag;
    $tagWrapper.appendChild($icon);
    $tagWrapper.appendChild($tagText);
    $tagContainer?.appendChild($tagWrapper);
  }
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
  for (const entry of data.entries) {
    const $entry = document.querySelector(`[data-id='${entry.entryID}']`);
    $entry?.classList.remove('hidden');
  }
  const $formElements = $search.elements as SearchFormElements;
  const $searchQuery: string = $formElements.search.value;
  const $searchSelector: string = $formElements['search-select'].value;
  $search.reset();
  $entriesTitle!.textContent = 'Results:';
  $entriesSort.classList.add('hidden');
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

$entriesSort?.addEventListener('input', (event: Event) => {
  const $eventTarget = event.target as HTMLSelectElement;
  const $sortValue = $eventTarget.value;
  if ($sortValue !== data.sort) {
    data.entries = data.entries.reverse();
    DOMLoadHandler();
    data.sort = $sortValue;
  }
});

$tagContainer?.addEventListener('click', (event: Event) => {
  const $eventTarget = event.target as HTMLDivElement;
  if (data.editing === null) {
    console.log($eventTarget);
    // $tagContainer.removeChild($eventTarget);
  }
});
