'use strict';
const $urlLinkInput = document.querySelector('#photo-url');
const $entryForm = document.querySelector('#entry-form');
const $previewPhoto = document.querySelector('.preview');
if (!$urlLinkInput || !$entryForm)
  throw new Error('$urlLinkInput or $entryForm query failed');
$urlLinkInput.addEventListener('input', (event) => {
  const eventTarget = event.target;
  if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
    $previewPhoto?.setAttribute('src', eventTarget.value);
  }
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
function renderEntry(entry) {
  const containingLi = document.createElement('li');
  const containingRowDiv = document.createElement('div');
  containingRowDiv.classList.add('row');
  const imgColDiv = document.createElement('div');
  imgColDiv.classList.add('column-full', 'column-half');
  const textColDiv = document.createElement('div');
  textColDiv.classList.add('column-full', 'column-half');
  const titleRowDiv = document.createElement('div');
  titleRowDiv.classList.add('row');
  const titleColDiv = document.createElement('div');
  titleColDiv.classList.add('column-full');
  const parRowDiv = document.createElement('div');
  parRowDiv.classList.add('row');
  const parColDiv = document.createElement('div');
  parColDiv.classList.add('column-full');
  const image = document.createElement('img');
  image.setAttribute('src', entry.url);
  const title = document.createElement('h4');
  title.textContent = entry.title;
  const paragraph = document.createElement('p');
  paragraph.textContent = entry.notes;
  parColDiv.appendChild(paragraph);
  parRowDiv.appendChild(parColDiv);
  titleColDiv.appendChild(title);
  titleRowDiv.appendChild(titleColDiv);
  textColDiv.appendChild(titleRowDiv);
  textColDiv.appendChild(parRowDiv);
  imgColDiv.appendChild(image);
  containingRowDiv.appendChild(imgColDiv);
  containingRowDiv.appendChild(textColDiv);
  containingLi.appendChild(containingRowDiv);
  return containingLi;
}
document.addEventListener('DOMContentLoaded', () => {
  data.entries.forEach((entry) => {
    const newEntry = renderEntry(entry);
    const $ul = document.querySelector('ul');
    $ul?.append(newEntry);
  });
});
