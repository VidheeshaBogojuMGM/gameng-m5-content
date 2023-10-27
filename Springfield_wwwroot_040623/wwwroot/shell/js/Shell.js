export default class Shell {
    constructor(url, urlMap, statusMap, m5ConfigUrl, ngxSubscriptionUrl) {
        import(/* webpackIgnore: true */ "/lib/shell-core-logic/dist/ShellCoreLogic.bundle.js").then(function() {
            new ShellCoreLogic.default(url, urlMap, statusMap, m5ConfigUrl, ngxSubscriptionUrl);
        });
    }
}