/*
loadContentWorker: This is a web worker based utility for loading content.
The "urls" array can be modified to include the url(s) for the content intended to be loaded.
 */

try {
    importScripts(`${location.origin}/lib/igt-media-elements/dist/igt-media-elements.js`);
} catch (e) {
    self.postMessage(`Import error: ${e.message}`);
    console.log(`Import error: ${e.message}`);
}

//Content URL's.
const urls = [
    `https://m5/idle/index.html`,
    `https://m5/patron/index.html`,
];

for (var i = 0; i < urls.length; i++) {
    loadContent(urls[i]);
}

/**
 * loadContent: Requests specified content url.
 * @param {String} url THe content url.
 */
function loadContent(url) {
    //Provides a 5 second interval for content to load.
    setTimeout(function () {
        IGTMediaElements.loadContent(url)
            .then(() => {
                console.log(`loaded url: ${url}`)
            }, (reject) => {
                console.log(`Failed to load url: ${url}, ${reject}`)
            });
    }, 5000);
}

self.onerror = function (error) {
    self.postMessage(error);
    console.log(error);
};