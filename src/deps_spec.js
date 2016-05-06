
import { defineDeps } from "./deps";

describe("test deps", function (){
    it("getter and setter", function () {
        var o = defineDeps({
            data: {
                a: 1
            }
        });

        expect(o.a).toBe(1);
        o.a = 2;
        expect(o.a).toBe(2);
    });

    it("dependency notify", function () {
        var o = defineDeps({
            data: {
                a: 1,
                b: function () {
                    return this.a + 1;
                },
                c: function () {
                    return this.b + 1;
                }
            }
        });
        expect(o.c).toBe(3);
        expect(o.b).toBe(2);
        o.a = 2;
        expect(o.b).toBe(3);
        expect(o.c).toBe(4);
    });

    it("multi dependency notify", function () {
        var o = defineDeps({
            data: {
                a: 1,
                b: function () {
                    if (this.a > 1) {
                        return this.a + 1;
                    } else {
                        return this.a - 1;
                    }
                }
            }
        });
        expect(o.b).toBe(0);
        o.a = 2;
        expect(o.b).toBe(3);
    });
});

