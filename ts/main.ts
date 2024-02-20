/* global data */
interface FormElements extends HTMLFormControlsCollection {
  title: HTMLInputElement;
  url: HTMLInputElement;
  notes: HTMLTextAreaElement;
}

interface FormObject {
  title: string;
  url: string;
  notes: string;
  entryID: number;
}

const $urlLinkInput = document.querySelector('#photo-url');
const $entryForm = document.querySelector('#entry-form') as HTMLFormElement;
const $previewPhoto = document.querySelector('.preview');
if (!$urlLinkInput || !$entryForm)
  throw new Error('$urlLinkInput or $entryForm query failed');

$urlLinkInput.addEventListener('input', (event: Event) => {
  const eventTarget = event.target as HTMLInputElement;
  if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
    $previewPhoto?.setAttribute('src', eventTarget.value);
  }
});

$entryForm.addEventListener('submit', (event: Event) => {
  event.preventDefault();
  const $formElements = $entryForm.elements as FormElements;
  const $formObject: FormObject = {
    title: $formElements.title.value,
    url: $formElements.url.value,
    notes: $formElements.notes.value,
    entryID: data.nextEntryId,
  };
  data.nextEntryId++;
  data.entries.unshift($formObject);
  const newEntry = renderEntry($formObject);
  const $ul = document.querySelector('ul');
  $ul?.prepend(newEntry);
  viewSwap('entries');
  if (data.entries.length > 0) {
    toggleNoEntries();
  }
  $entryForm.reset();
  $previewPhoto?.setAttribute('src', 'images/placeholder-image-square.jpg');
});

function renderEntry(entry: FormObject): HTMLLIElement {
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
  data.entries.forEach((entry: FormObject) => {
    const newEntry = renderEntry(entry);
    const $ul = document.querySelector('ul');
    $ul?.append(newEntry);
  });
  viewSwap(data.view);
  if (data.entries.length > 0) {
    toggleNoEntries();
  }
});

function toggleNoEntries(): void {
  const $noEntries = document.querySelector('.no-entries');
  $noEntries?.classList.toggle('hidden');
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
  data.view = view;
}

const $anchors = document.querySelectorAll('a');
$anchors.forEach((anchor: HTMLAnchorElement) => {
  anchor.addEventListener('click', (event: Event): void => {
    const $eventTarget = event.target as HTMLAnchorElement;
    const $switchValue: string = $eventTarget.dataset.switch!;
    viewSwap($switchValue);
  });
});
