# Observish

Observish lets you monitor properties for changes and lets you get the old value, updated value and the path of the updated property


```ts
class TestModel {
    Level1 = {
        Level2: {
            Level3String: "Im a third level value",
            Level3Number: 43
        }
    };
    s = "";
}

var model = new TestModel();

Observish.subscribeTo(model, (newVal, oldVal, path) => {
    console.dir("oldval:" + oldVal);
    console.dir("newval:" + newVal);
    console.dir('path:' + path);
});

model.Level1.Level2.Level3String = "Updating value";
model.Level1.Level2.Level3String = "Updating value again";
model.Level1.Level2.Level3Number = 11
model.s = "setting on root prop"

```

## Result
```
oldval:Im a third level
newval:Updating value
path:Level1.Level2.Level3String

oldval:Updating value
newval:Updating value again
path:Level1.Level2.Level3String

oldval:43
newval:11
path:Level1.Level2.Level3Number

oldval:
newval:setting on root prop
path:s
```