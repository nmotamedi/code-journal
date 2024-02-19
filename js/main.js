'use strict';
const $urlLinkInput = document.querySelector('#photo-url');
const $entryForm = document.querySelector('#entry-form');
const $previewPhoto = document.querySelector('.preview');
if (!$urlLinkInput || !$entryForm)
  throw new Error('$urlLinkInput or $entryForm query failed');
$urlLinkInput.addEventListener('input', (event) => {
  $urlLinkInput.addEventListener('blur', () => {
    const eventTarget = event.target;
    if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
      $previewPhoto?.setAttribute('src', eventTarget.value);
    }
  });
});
$entryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const $formElements = $entryForm.elements;
  const $formObject = {
    title: $formElements.title.value,
    url: $formElements.url.value,
    notes: $formElements.notes.value,
    entryID: data.nextEntryId,
  };
  data.nextEntryId++;
  data.entries.unshift($formObject);
  $entryForm.reset();
  $previewPhoto?.setAttribute('src', 'images/placeholder-image-square.jpg');
});
