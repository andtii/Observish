
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
model.Level1.Level2.Level3Number = 11;
model.s = "setting on root prop";







