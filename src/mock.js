export default function () {
    const __non_func__ = function () {};
    const __handleUrl__ = function(url) {
        return url.replace(/(.*)+?\??.*/, "$1");
    };
    const __gen__ = function(prefix) {
        return function (url, func) {
            let __url__ =__handleUrl__(url);
            this.urls[prefix + '_' + __url__] = func;
        }
    };

    const __gen2__ = function(prefix){
        return function (url, data) {
            let __url__ =__handleUrl__(url) ;
            let func = routers.urls[prefix + '_' + __url__] || __non_func__;
            let result = func(data);
            return Promise.resolve(result);
        }
    };

    const routers = {
        urls: {  },
        __post__: __gen__('post'),
        __get__: __gen__('get'),
    };

    return {
        post: __gen2__('post'),
        get: __gen2__('get'),
        routers: routers
    }
}