import ShellCoreLogic from '../../lib/shell-core-logic/dist/ShellCoreLogic.bundle';

export default class Shell{
    constructor(url, urlMap, statusMap, m5ConfigUrl, ngxSubscriptionUrl){
        new ShellCoreLogic(url, urlMap, statusMap, m5ConfigUrl, ngxSubscriptionUrl);
    }
}