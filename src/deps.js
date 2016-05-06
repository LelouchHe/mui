
function defineDeps(option) {
    var o = {};

    var data = option.data;
    var funcs = {};
    var callstacks  = [];
    var obs = {};

    var notify = function (key) {
        if (!obs[key]) {
            return;
        }
        let keys = Object.keys(obs[key]);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            let value = funcs[key].call(o);
            if (data[key] != value) {
                data[key] = value;
                notify(key);
            }
        }
    };

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
                if (callstacks.length > 0) {
                    let last = callstacks[callstacks.length - 1];
                    if (!obs[key]) {
                        obs[key] = {};
                    }
                    obs[key][last] = true;
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
                    if (callstacks.length > 0) {
                        let last = callstacks[callstacks.length - 1];
                        if (!obs[key]) {
                            obs[key] = {};
                        }
                        obs[key][last] = true;
                    }

                    callstacks.push(key);
                    data[key] = funcs[key].call(this);
                    callstacks.pop();
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

export { defineDeps };

