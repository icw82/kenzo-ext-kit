(async () => {
    const path = chrome.extension.getURL('main.js');
    const { main } = await import(path);
    main('background');
})();
