const extensionId = 'quick-translate-selected'
const notificationId = 'quick-translate-selected-notification'
const translationURL = 'https://translate.googleapis.com'

notify = (translation) => {
    browser.notifications.create(notificationId, {
        'type': 'basic',
        'title': 'Translation',
        'message': translation
    });
}

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
                        notify(data[0][0][0])
                    })
                } else {
                    notify('Error: ' + response.status())
                }
            })
        })
}

translateSelection = () => {
    browser.tabs.executeScript({ code: 'window.getSelection().toString();' })
    .then((selection) => {
        displayTranslation(selection[0])
    })
}


const menuItem = {
    id: extensionId,
    title: 'Quick Translate Selected',
    contexts: ['selection'],
    onclick: translateSelection
}

browser.menus.create(menuItem)
