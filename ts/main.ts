// /* global data */
const $urlLinkInput = document.querySelector('#photo-url');
if (!$urlLinkInput) throw new Error('$urlLinkInput query failed');

$urlLinkInput.addEventListener('input', (event: Event) => {
  $urlLinkInput.addEventListener('blur', () => {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.value.match(/\.(jpeg|jpg|gif|png)$/)) {
      const $previewPhoto = document.querySelector('.preview');
      $previewPhoto?.setAttribute('src', eventTarget.value);
    }
  });
});
