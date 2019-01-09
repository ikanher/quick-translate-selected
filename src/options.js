saveOptions = (e) => {
    browser.storage.local.set({
        'src-lang': document.querySelector('#src-lang').value
    })
    browser.storage.local.set({
        'dst-lang': document.querySelector('#dst-lang').value
    })
    e.preventDefault()
}

restoreOptions = () => {
    restoreOption('src-lang', 'en')
    restoreOption('dst-lang', 'fi')
}

restoreOption = (option, defaultOpt) => {
    const gettingItem = browser.storage.local.get(option);
    gettingItem.then((res) =>
        document.querySelector('#' + option).value = res[option] || defaultOpt)
}

document.addEventListener('DOMContentLoaded', restoreOptions)
document.querySelector('form').addEventListener('submit', saveOptions)
