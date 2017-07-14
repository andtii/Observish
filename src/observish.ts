
class Observish {

  static subscribeTo(obj: Object, changeCallback: (newVal: any, oldVal: any, path: string) => void) {

    for (let key in obj) {

      if (key == '__observish__')
        return;

      if (obj[key] instanceof Object) {
        obj[key]['__observish__'] = obj['__observish__'] ? obj['__observish__'] + '.' + key : key;

        //  obj[key]['__path__'] = key;

        //console.dir('paaa:' + key);
        //console.dir(obj[key]['__observish__']);

        //If property is object the recursively subscribe
        Observish.subscribeTo(obj[key], changeCallback);
      }
      else
      {
        var s = key;
        //obj[key]['__observish__'] = obj['__observish__'] ? obj['__observish__'] + '.' + key : key;
         // console.dir(key);
      }

      const property = Object.getOwnPropertyDescriptor(obj, key)
      if (property && property.configurable === false) {
        return
      }

      // cater for pre-defined getter/setters
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
          //this['test__'] = key;
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

         
          changeCallback(newVal, value, obj['__observish__'] + '.' + key);
        }
      });
    }
  }
}
