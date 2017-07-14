
class Observish {

  static subscribeTo(obj: Object, changeCallback: (newVal: any, oldVal: any, path: string) => void) {

    for (let key in obj) {

      if (key == '__observish__')
        return;

      if (obj[key] instanceof Object) {
        obj[key]['__observish__'] = obj['__observish__'] ? obj['__observish__'] + '.' + key : key;

        //If property is object the recursively subscribe
        Observish.subscribeTo(obj[key], changeCallback);
      }

      const property = Object.getOwnPropertyDescriptor(obj, key)
      if (property && property.configurable === false) {
        return
      }

      const getter = property && property.get;
      const setter = property && property.set;

      Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function observishGet() {
          const value = getter ? getter.call(obj) : property.value;
          return value;
        },
        set: function observishSet(newVal) {

          const value = getter ? getter.call(obj) : property.value;
          if (newVal === value || (newVal !== newVal && value !== value)) {
            return
          }

          if (!newVal['__observish__'] && newVal instanceof Object) {
            Observish.subscribeTo(newVal, changeCallback);
          }

          if (setter) {
            setter.call(obj, newVal);
          } else {
            property.value = newVal;
          }

          var propPath = key;
          if (obj['__observish__']) {
            propPath = obj['__observish__'] + '.' + key;
          }

          changeCallback(newVal, value, propPath);
        }
      });
    }
  }
}
