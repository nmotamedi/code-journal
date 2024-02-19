'use strict';
// /* global data */
const $urlLinkInput = document.querySelector('#photo-url');
if (!$urlLinkInput) throw new Error('$urlLinkInput query failed');
$urlLinkInput.addEventListener('input', (event) => {
  $urlLinkInput.addEventListener('blur', () => {
    let eventTarget = event.target;
    if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
      let $previewPhoto = document.querySelector('.preview');
      $previewPhoto?.setAttribute('src', eventTarget.value);
    }
  });
});
