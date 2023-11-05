document.addEventListener('DOMContentLoaded', () => {
  // Retrieve the translation from local storage
  browser.storage.local.get('lastTranslation').then((res) => {
    const translationText = res.lastTranslation || 'No translation available.';
    document.getElementById('translation').textContent = translationText;
  });
});
