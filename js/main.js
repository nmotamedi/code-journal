'use strict';
const $urlLinkInput = document.querySelector('#photo-url');
const $titleInput = document.querySelector('#title');
const $notesInput = document.querySelector('#notes');
const $entryForm = document.querySelector('#entry-form');
const $previewPhoto = document.querySelector('.preview');
const $ul = document.querySelector('ul');
const $entryTitle = document.querySelector('.entry-title');
if (!$entryTitle || !$urlLinkInput || !$entryForm || !$ul || !$notesInput)
  throw new Error(
    '$urlLinkInput, $entryForm, $ul, $entryTitle, or $notesInput query failed'
  );
$urlLinkInput.addEventListener('input', (event) => {
  const eventTarget = event.target;
  if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
    $previewPhoto?.setAttribute('src', eventTarget.value);
  }
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
    };
    data.nextEntryId++;
    data.entries.unshift($formObject);
    const $newEntry = renderEntry($formObject);
    $ul.prepend($newEntry);
    if (data.entries.length > 0) {
      toggleNoEntries();
    }
  } else {
    const $formObject = {
      title: $formElements.title.value,
      url: $formElements.url.value,
      notes: $formElements.notes.value,
      entryID: data.editing.entryID,
    };
    let updatingIndex = data.entries.findIndex(
      (entry) => entry.entryID === $formObject.entryID
    );
    data.entries[updatingIndex] = $formObject;
    $ul.textContent = '';
    data.entries.forEach((entry) => {
      const $newEntry = renderEntry(entry);
      $ul.append($newEntry);
      $urlLinkInput.removeAttribute('value');
      $titleInput?.removeAttribute('value');
      $notesInput.textContent = '';
      $entryTitle.textContent = 'New Entry';
      data.editing = null;
    });
  }
  $entryForm.reset();
  $previewPhoto?.setAttribute('src', 'images/placeholder-image-square.jpg');
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
  data.entries.forEach((entry) => {
    const $newEntry = renderEntry(entry);
    $ul.append($newEntry);
  });
  viewSwap(data.view);
  if (data.entries.length > 0) {
    toggleNoEntries();
  }
});
function toggleNoEntries() {
  const $noEntries = document.querySelector('.no-entries');
  $noEntries?.classList.add('hidden');
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
  data.view = view;
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
  if ($eventTarget.tagName === 'I') {
    viewSwap('entry-form');
    const $dataID = +$li.dataset.id;
    data.entries.forEach((entry) => {
      if ($dataID === entry.entryID) {
        data.editing = entry;
      }
    });
    $urlLinkInput.setAttribute('value', data.editing.url);
    $previewPhoto?.setAttribute('src', data.editing.url);
    $titleInput?.setAttribute('value', data.editing.title);
    $notesInput.textContent = data.editing.notes;
    $entryTitle.textContent = 'Edit Entry';
  }
});
