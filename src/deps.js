
function initDeps(o, data) {
    var funcs = {};
    var callstack  = [];
    var deps = {};

    var notify = function (key) {
        if (!deps[key]) {
            return;
        }
        var keys = Object.keys(deps[key]);
        for (let i = 0; i < keys.length; i++) {
            let k = keys[i];
            let v = funcs[k].call(o);
            if (data[k] !== v) {
                data[k] = v;
                notify(k);
            }
        }
    }

    var keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (typeof data[key] == "function") {
            funcs[key] = data[key];
            delete data[key];
        }
    }

    keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        Object.defineProperty(o, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (callstack.length > 0) {
                    let last = callstack[callstack.length - 1];
                    if (!deps[key]) {
                        deps[key] = {};
                    }
                    deps[key][last] = true;
                }
                return data[key];
            },
            set: function (v) {
                data[key] = v;
                notify(key);
            }
        });
    }

    keys = Object.keys(funcs);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        Object.defineProperty(o, key, {
            configurable: false,
            enumerable: true,
            get: function () {
                if (!(key in data)) {
                    if (callstack.length > 0) {
                        let last = callstack[callstack.length - 1];
                        if (!deps[key]) {
                            deps[key] = {};
                        }
                        deps[key][last] = true;
                    }

                    callstack.push(key);
                    data[key] = funcs[key].call(o);
                    callstack.pop();
                }

                return data[key];
            },
            set: function (v) {
                console.log("this is not allowed");
            }
        });
    }

    return o;
}

export { initDeps };

