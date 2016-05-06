'use strict';

function initDeps(o, data) {
    var funcs = {};
    var callstack = [];
    var deps = {};

    var notify = function notify(key) {
        if (!deps[key]) {
            return;
        }
        var keys = Object.keys(deps[key]);
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var v = funcs[k].call(o);
            if (data[k] !== v) {
                data[k] = v;
                notify(k);
            }
        }
    };

    var keys = Object.keys(data);

    var _loop = function _loop(i) {
        var key = keys[i];
        if (typeof data[key] === "function") {
            funcs[key] = data[key];
            delete data[key];
        }
        Object.defineProperty(o, key, {
            configurable: false,
            enumerable: true,
            get: function get() {
                if (callstack.length > 0) {
                    var last = callstack[callstack.length - 1];
                    if (!deps[key]) {
                        deps[key] = {};
                    }
                    deps[key][last] = true;
                }

                if (!(key in data)) {
                    callstack.push(key);
                    data[key] = funcs[key].call(o);
                    callstack.pop();
                }

                return data[key];
            },
            set: function set(value) {
                if (!(key in data)) {
                    console.log("this is not allowed");
                }
                data[key] = value;
                notify(key);
            }
        });
    };

    for (var i = 0; i < keys.length; i++) {
        _loop(i);
    }

    return o;
}

function defineComponent(option) {
    var o = {};
    initDeps(o, option.data);

    return o;
}

exports.defineComponent = defineComponent;