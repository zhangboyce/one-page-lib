const NO_FUNC = function () {};

function Router() {
    this.routes = {};
    this.currentUrl = '';
    this.query = {};
}

Router.prototype.route = function(path, callback) {
    this.routes[path] = callback || NO_FUNC;
};

Router.prototype.refresh = function() {
    let hashUrl = location.hash.slice(1) || '';
    let hashUrlSplit = hashUrl.split('\?');

    this.currentUrl = '/' + hashUrlSplit[0];
    if (hashUrlSplit.length > 1) {
        (hashUrlSplit[1].split('\&') || []).forEach(it => {
            this.query[it.split('=')[0]] = it.split('=')[1];
        });
    }
    (this.routes[this.currentUrl] || NO_FUNC)(this.query);
};

Router.prototype.init = function() {
    window.addEventListener('load', this.refresh.bind(this), false);
    window.addEventListener('hashchange', this.refresh.bind(this), false);
};

let router = new Router();
router.init();

export default router;