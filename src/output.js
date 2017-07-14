var Observish = (function () {
    function Observish() {
    }
    Observish.subscribeTo = function (obj, changeCallback) {
        var _loop_1 = function (key) {
            if (key == '__observish__')
                return { value: void 0 };
            if (obj[key] instanceof Object) {
                obj[key]['__observish__'] = obj['__observish__'] ? obj['__observish__'] + '.' + key : key;
                //  obj[key]['__path__'] = key;
                //console.dir('paaa:' + key);
                //console.dir(obj[key]['__observish__']);
                //If property is object the recursively subscribe
                Observish.subscribeTo(obj[key], changeCallback);
            }
            else {
                s = key;
                //obj[key]['__observish__'] = obj['__observish__'] ? obj['__observish__'] + '.' + key : key;
                // console.dir(key);
            }
            var property = Object.getOwnPropertyDescriptor(obj, key);
            if (property && property.configurable === false) {
                return { value: void 0 };
            }
            // cater for pre-defined getter/setters
            var getter = property && property.get;
            var setter = property && property.set;
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function observishGet() {
                    var value = getter ? getter.call(obj) : property.value;
                    return value;
                },
                set: function observishSet(newVal) {
                    //this['test__'] = key;
                    var value = getter ? getter.call(obj) : property.value;
                    if (newVal === value || (newVal !== newVal && value !== value)) {
                        return;
                    }
                    if (!newVal['__observish__'] && newVal instanceof Object) {
                        Observish.subscribeTo(newVal, changeCallback);
                    }
                    if (setter) {
                        setter.call(obj, newVal);
                    }
                    else {
                        property.value = newVal;
                    }
                    changeCallback(newVal, value, obj['__observish__'] + '.' + key);
                }
            });
        };
        var s;
        for (var key in obj) {
            var state_1 = _loop_1(key);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    return Observish;
}());
var TestModel = (function () {
    function TestModel() {
        this.Level1 = {
            Level2: {
                Level3String: "Im a third level value",
                Level3Number: 43
            }
        };
        this.s = "";
    }
    return TestModel;
}());
var model = new TestModel();
Observish.subscribeTo(model, function (newVal, oldVal, path) {
    console.dir("oldval:" + oldVal);
    console.dir("newval:" + newVal);
    console.dir('path:' + path);
});
model.Level1.Level2.Level3String = "Updating value";
model.Level1.Level2.Level3String = "Updating value again";
model.Level1.Level2.Level3Number = 11;
model.s = "setting on root prop";
