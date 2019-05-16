const objectUtils = (function() {
    const toString = Object.prototype.toString;
    return {
        isString: v => toString.call(v) === '[object String]',
        isNumber: v => toString.call(v) === '[object Number]',
        isBoolean: v => toString.call(v) === '[object Boolean]',
        isObject: v => toString.call(v) === '[object Object]',
        isArray: v => toString.call(v) === '[object Array]',
        isFunction: v => toString.call(v) === '[object Function]',
        isPromise: v => toString.call(v) === '[object Promise]'
    }
}());

const appUtils = (function(){
    return {
        watchData: function(data, loadFtn) {
            let obj = {  };
            let properties = {};
            let keys = Object.keys(data);
            keys.forEach(key => {
                properties[key] = {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return data[key];
                    },
                    set: function(newValue) {
                        data[key] = newValue;
                        loadFtn({ [key]: newValue }, true);
                    }
                };
            });

            Object.defineProperties(obj, properties);
            return obj;
        },

        history: function () {
            let chain = [];
            let get = function (index) {
                return index < 0 ? undefined : index > chain.length - 1 ? undefined : chain[index];
            };
            return {
                push: function (page) {
                    chain.push(page);
                },
                current: function () {
                    return get(chain.length - 1);
                },
                prev: function () {
                    return get(chain.length - 2);
                },
                chain: function () {
                    return [...chain];
                }
            }
        }
    };
}());

const lifeCycleUtils = (function () {
    const __life_cycle__ = function (ftnName, pageName) {
        let page = this.pages[pageName];
        let ftn = (page && page[ftnName]) || function () {};
        ftn.call(page);
    };

    return {
        destroy: function (pageName) {
            __life_cycle__.call(this, 'destroyed', pageName);
            console.log('[life-circle] '+ pageName +' page is destroyed at ' + Date.now());
        },
        create: function (pageName) {
            __life_cycle__.call(this, 'created', pageName);
            console.log('[life-circle] '+ pageName +' page is created at ' + Date.now());
        },
        mount: function (pageName) {
            __life_cycle__.call(this, 'mounted', pageName);
            console.log('[life-circle] '+ pageName +' page is mounted at ' + Date.now());
        },
        unmount: function (pageName) {
            __life_cycle__.call(this, 'unmounted', pageName);
            console.log('[life-circle] '+ pageName +' page is unmounted at ' + Date.now());
        }
    };
}());

export default Object.assign({}, objectUtils, appUtils, lifeCycleUtils)
