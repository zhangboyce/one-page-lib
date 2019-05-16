import $ from "jquery";
import mockFtn from './mock';

export default function (app) {
    let mock = mockFtn();

    const __request__ = function(method, url, data) {
        console.log('[http] access get api: ' + url);
        return new Promise((res, rej) => {
            $.ajax({
                type: method,
                url,
                data,
                dataType: 'json',
                success: function (result) {
                    res(result);
                },
                error: function (XMLHttpRequest) {
                    rej(XMLHttpRequest);
                }
            });
        });
    };
    const __mock_request__ = function(method, url, data) {
        if (method === 'get') {
            console.log('[http] access get api: ' + url);
            return mock.get(url, data);
        }
        if (method === 'post') {
            console.log('[http] access post api: ' + url);
            return mock.post(url, data);
        }
    };
    const request = function(method, url, data) {
        if (app.env === 'dev') {
            return __mock_request__(method, url, data);
        }
        else {
            return __request__(method, url, data);
        }
    };

    return {
        get: function (url, data) {
            return request('get', url, data);
        },
        post: function (url, data) {
            return request('post', url, data);
        },
        routers: mock.routers
    };
};