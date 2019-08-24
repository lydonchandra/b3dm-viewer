chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({color: "#00ff00"}, function() {
        console.log("The color is #aabbcc")
    })

    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'localhost'},
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
})

