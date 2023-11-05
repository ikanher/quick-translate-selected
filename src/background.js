const extensionId = 'quick-translate-selected'
const notificationId = 'quick-translate-selected-notification'
const translationURL = 'https://translate.googleapis.com'

notify = (shortTranslation, fullTranslation) => {
    console.log(`Notify with message ${shortTranslation}`);
    browser.notifications.create(notificationId, {
        'type': 'basic',
        'title': 'Translation',
        'message': shortTranslation
    }).then(() => {
        // Store the full translation in local storage for later retrieval
        browser.storage.local.set({ [notificationId]: fullTranslation });
    });
};

displayTranslation = (query) => {
    browser.storage.local.get({ 'src-lang': 'auto', 'dst-lang': 'fi' }).then((res) => {
        let url = translationURL + '/translate_a/single?client=gtx'
        url += '&sl=' + res['src-lang']
        url += '&tl=' + res['dst-lang']
        url += '&dt=t&q='
        url += encodeURI(query)

        fetch(url, { headers: { 'Content-Type': 'application/json' } })
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        // The full translation is the first element of the first array
                        const fullTranslation = data[0][0][0];
                        // For the notification, we might want to show a shorter message
                        // If the full translation is too long for the notification, we truncate it
                        const shortTranslation = fullTranslation.length > 100 ? fullTranslation.substring(0, 97) + '...' : fullTranslation;
                        notify(shortTranslation, fullTranslation);
                    });
                } else {
                    notify('Error: ' + response.status);
                }

        });
    });
};

translateSelection = () => {
    browser.tabs.executeScript({ code: 'window.getSelection().toString();' })
    .then((selection) => {
        displayTranslation(selection[0])
    });
};

browser.notifications.onClicked.addListener((id) => {
  if (id === notificationId) {
    // Retrieve the translation from storage
    browser.storage.local.get(notificationId).then((res) => {
      const translationText = res[notificationId];
      if (translationText) {
        // Save the translation to local storage with a new key
        browser.storage.local.set({ 'lastTranslation': translationText }).then(() => {
          // Create the popup window after successfully saving the translation
          browser.windows.create({
            url: browser.runtime.getURL('translationPopup.html'),
            type: 'popup',
            width: 400,
            height: 300
          });
        });
      }
    });
  }
});

const menuItem = {
    id: extensionId,
    title: 'Quick Translate Selected',
    contexts: ['selection'],
    onclick: translateSelection
}

browser.menus.create(menuItem)
