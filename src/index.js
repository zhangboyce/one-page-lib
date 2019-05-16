import * as  defaultFilters from './filters';
import utils from './utils';
import request from './request';
import Router from './Router';

export default function App() {
    const __load__ = function (__template__, originData, filters) {
        const app = this;

        return function (newData, refresh) {
            if (refresh) {
                app.utils.unmount.call(app, app.history.current());
            } else {
                let prev = app.history.prev();
                if (prev) {
                    app.utils.destroy.call(app, prev);
                    app.utils.unmount.call(app, prev);
                }
                app.utils.create.call(app, app.history.current());
            }

            const data = Object.assign({ }, originData, newData, filters);
            const html = __template__({ ...data });
            app.$app.innerHTML = html;

            app.utils.mount.call(app, app.history.current());

            console.log('[app] refreshed: ', originData, newData, data);
        }
    };

    const NO_FUNC = function () {};
    const filters = [];

    return {
        env: 'dev',
        data: {},
        $app: null,
        pages: {},
        history: utils.history(),
        template: NO_FUNC,
        filters: filters.concat(defaultFilters),
        utils: utils,

        registerFilter: function(filter) {
            if (!filter || !utils.isFunction(filter)) {
                return;
            }
            filters.push(filter);
        },

        mock: function(path, func, method = 'get') {
            method === 'get' ?
                this.request.routers.__get__(path, func):
                this.request.routers.__post__(path, func);
        },

        init: function (domId, pages, template) {
            if (!domId || !domId.trim()) {
                throw new Error('[system] init a app must have a no empty domId.');
            }

            if (!pages || !this.utils.isArray(pages)) {
                throw new Error('[system] init a app must have a no empty pages array.');
            }

            if (!template || !this.utils.isFunction(template)) {
                throw new Error('[system] init a app must have a template function.');
            }

            this.$app = document.getElementById(domId);
            let app = this;

            for (let i = 0; i < pages.length; i++) {
                let page = pages[i];
                if (!page || !this.utils.isFunction(page)) {
                    throw new Error('[system] pages element must be a function.');
                }
                let pageResult = page.call(this, this);
                let name = pageResult.name;
                this.pages[name] = pageResult;

                Router.route('/' + name, function (params) {
                    app.go(name, params);
                });
                if (i === 0) {
                    Router.route('/', function (params) {
                        app.go(name, params);
                    });
                }
            }
            this.request = request(this);
            this.template = template;
        },

        go: function (path, params) {
            const page = this.pages[path];
            this.history.push(path);

            // 将page页面定义的data和参数合并成一个新的data对象传给页面
            let pageData = (page && page['data']) || {};
            let data = Object.assign({}, pageData, params);

            // 对全部data进行变化监听，如果发生变化，执行__refresh__重新刷新页面
            let loadFtn = __load__.call(this, this.template(path), data, {filters: this.filters || {}});
            page.data = this.utils.watchData(data, loadFtn);

            // 加载当前页面
            loadFtn({}, false);
        }
    }
};