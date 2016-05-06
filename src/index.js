
import { initDeps } from "./deps";

function defineComponent(option) {
    var o = {};
    initDeps(o, option.data);

    return o;
}

export { defineComponent };
