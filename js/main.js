'use strict';
const $urlLinkInput = document.querySelector('#photo-url');
const $titleInput = document.querySelector('#title');
const $notesInput = document.querySelector('#notes');
const $tagsInput = document.querySelector('#tags');
const $entryForm = document.querySelector('#entry-form');
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
const $search = document.querySelector('#search-bar');
const $tagList = document.querySelector('#tagList');
const $tagSort = document.querySelector('#tag-sort');
const $warning = document.querySelector('.warning');
const $entriesContainer = document.querySelector('.entries-container');
let currentTags = [];
const $entriesSort = document.querySelector('#entries-sort');
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
$urlLinkInput.addEventListener('input', (event) => {
  const eventTarget = event.target;
  if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
    $previewPhoto?.setAttribute('src', eventTarget.value);
  }
});
$tagsInput.addEventListener('keydown', (event) => {
  $warning?.classList.add('hidden');
  if (event.key !== ' ') {
    return;
  }
  event.preventDefault();
  const tag = $tagsInput.value.trim();
  if (tag === '') {
    return;
  }
  if (currentTags.includes(tag)) {
    $tagsInput.value = '';
    $warning.textContent = `${tag} has already been added`;
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
$entryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $entryForm.elements;
  if (data.editing === null) {
    const $formObject = {
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
    const $formObject = {
      title: $formElements.title.value,
      url: $formElements.url.value,
      notes: $formElements.notes.value,
      entryID: data.editing.entryID,
      tags: currentTags,
    };
    let updatingEntry = data.entries.find(
      (entry) => entry.entryID === $formObject.entryID
    );
    const updatingIndex = data.entries.findIndex(
      (entry) => updatingEntry === entry
    );
    const $oldEntry = document.querySelector(
      `[data-id='${updatingEntry?.entryID}']`
    );
    updatingEntry = $formObject;
    data.entries[updatingIndex] = updatingEntry;
    const $newEntry = renderEntry(updatingEntry);
    $ul.replaceChild($newEntry, $oldEntry);
    data.editing = null;
    $deleteButton.classList.add('hide');
  }
  for (const tagMaster of currentTags) {
    if (!data.tags.includes(tagMaster)) {
      data.tags.push(tagMaster);
      const $tagOption = document.createElement('option');
      $tagOption.value = tagMaster;
      $tagOption.textContent = tagMaster;
      $tagList.appendChild($tagOption);
      const $tagSelectOption = $tagOption.cloneNode(true);
      $tagSort.appendChild($tagSelectOption);
    }
  }
  viewSwap('entries');
});
function renderEntry(entry) {
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
  const options = $entriesSort.children;
  for (const option of options) {
    if (option.getAttribute('value') === data.sort) {
      option.defaultSelected = true;
    }
  }
  toggleNoEntries();
});
function DOMLoadHandler() {
  $ul.textContent = '';
  data.entries.forEach((entry) => {
    const $newEntry = renderEntry(entry);
    $ul.append($newEntry);
  });
  data.tags.sort();
  data.tags.forEach((tag) => {
    const $tagOption = document.createElement('option');
    $tagOption.value = tag;
    $tagOption.textContent = tag;
    $tagList.appendChild($tagOption);
    const $tagSelectOption = $tagOption.cloneNode(true);
    $tagSort.appendChild($tagSelectOption);
  });
}
function toggleNoEntries() {
  const $noEntries = document.querySelector('.no-entries');
  if (data.entries.length > 0) {
    $noEntries?.classList.add('hidden');
  } else {
    $noEntries?.classList.remove('hidden');
  }
}
function viewSwap(view) {
  const $views = document.querySelectorAll('[data-view]');
  $views.forEach((div) => {
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
  $deleteButton.classList.add('hide');
  $entriesTitle.textContent = 'Entries';
  $entryTitle.textContent = 'New Entry';
  $entriesSort.classList.remove('hidden');
  $tagContainer.textContent = '';
}
const $anchors = document.querySelectorAll('a');
$anchors.forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const $eventTarget = event.target;
    const $switchValue = $eventTarget.dataset.switch;
    viewSwap($switchValue);
  });
});
$ul.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  const $li = $eventTarget.closest('li');
  if (!$li) throw new Error('$li query failed');
  if (!$eventTarget.className.includes('fa-pencil')) {
    return;
  }
  viewSwap('entry-form');
  $deleteButton.classList.remove('hide');
  const $dataID = +$li.dataset.id;
  data.entries.forEach((entry) => {
    if ($dataID === entry.entryID) {
      data.editing = entry;
    }
  });
  for (const tag of data.editing.tags) {
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
  currentTags = data.editing.tags;
  $urlLinkInput.value = data.editing.url;
  $previewPhoto?.setAttribute('src', data.editing.url);
  $titleInput.value = data.editing.title;
  $notesInput.value = data.editing.notes;
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
  for (const $tagText of data.editing.tags) {
    let count = 0;
    data.entries.forEach((entry) => {
      if (entry.tags.includes($tagText)) {
        count++;
      }
    });
    if (count === 1) {
      const masterTagIndex = data.tags.indexOf($tagText);
      const $selectedOptions = document.querySelectorAll(
        `option[value=${$tagText}]`
      );
      $tagList.removeChild($selectedOptions[0]);
      $tagSort?.removeChild($selectedOptions[1]);
      data.tags.splice(masterTagIndex, 1);
    }
  }
  data.entries = data.entries.filter((entry) => entry !== data.editing);
  const $oldEntry = document.querySelector(
    `[data-id='${data.editing.entryID}']`
  );
  $ul.removeChild($oldEntry);
  toggleNoEntries();
  viewSwap('entries');
  data.editing = null;
});
$search.addEventListener('submit', (event) => {
  event.preventDefault();
  for (const entry of data.entries) {
    const $entry = document.querySelector(`[data-id='${entry.entryID}']`);
    $entry?.classList.remove('hidden');
  }
  const $formElements = $search.elements;
  const $searchQuery = $formElements.search.value;
  const $searchSelector = $formElements['search-select'].value;
  $search.reset();
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
    $entriesTitle.textContent = `Results: ${$searchSelector} - ${$searchQuery}`;
    if (!prop.includes($searchQuery)) {
      const $oldEntry = document.querySelector(`[data-id='${entry.entryID}']`);
      $oldEntry?.classList.add('hidden');
    }
  }
});
$entriesSort?.addEventListener('input', (event) => {
  const $eventTarget = event.target;
  const $sortValue = $eventTarget.value;
  if ($sortValue !== data.sort) {
    data.entries = data.entries.reverse();
    DOMLoadHandler();
    data.sort = $sortValue;
  }
});
$tagContainer?.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  const $tagDiv = $eventTarget.closest('div');
  const $tagText = $tagDiv?.textContent;
  if (data.editing !== null) {
    let count = 0;
    data.entries.forEach((entry) => {
      if (entry.tags.includes($tagText)) {
        count++;
      }
    });
    if (count === 1) {
      const masterTagIndex = data.tags.indexOf($tagText);
      const $selectedOptions = document.querySelectorAll(
        `option[value=${$tagText}]`
      );
      $tagList.removeChild($selectedOptions[0]);
      $tagSort?.removeChild($selectedOptions[1]);
      data.tags.splice(masterTagIndex, 1);
    }
  }
  $tagContainer.removeChild($tagDiv);
  const currentTagIndex = currentTags.indexOf($tagText);
  currentTags.splice(currentTagIndex, 1);
});
$tagSort?.addEventListener('input', (event) => {
  const $eventTarget = event.target;
  const $sortByTag = $eventTarget.value;
  data.entries.forEach((entry) => {
    const $oldEntry = document.querySelector(`[data-id='${entry.entryID}']`);
    $oldEntry?.classList.remove('hidden');
  });
  if ($sortByTag === '') {
    $entriesTitle.textContent = 'Entries';
    $entriesSort.classList.remove('hidden');
    return;
  }
  $entriesTitle.textContent = `Results: Tag - ${$sortByTag}`;
  $entriesSort.classList.add('hidden');
  for (const entry of data.entries) {
    if (!entry.tags.includes($sortByTag)) {
      const $oldEntry = document.querySelector(`[data-id='${entry.entryID}']`);
      $oldEntry?.classList.add('hidden');
    }
  }
});
$entriesContainer?.addEventListener('click', (event) => {
  const $eventTarget = event.target;
  const $closestDiv = $eventTarget.closest('div');
  if ($closestDiv?.classList.contains('tag-wrapper')) {
    const $sortByTag = $closestDiv.textContent;
    data.entries.forEach((entry) => {
      const $oldEntry = document.querySelector(`[data-id='${entry.entryID}']`);
      $oldEntry?.classList.remove('hidden');
    });
    $entriesTitle.textContent = `Results: Tag - ${$sortByTag}`;
    $entriesSort.classList.add('hidden');
    for (const entry of data.entries) {
      if (!entry.tags.includes($sortByTag)) {
        const $oldEntry = document.querySelector(
          `[data-id='${entry.entryID}']`
        );
        $oldEntry?.classList.add('hidden');
      }
    }
  }
});
