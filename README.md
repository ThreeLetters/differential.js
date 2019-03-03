![Differential.js](https://user-images.githubusercontent.com/13282284/33913824-6f3867e6-df69-11e7-9a70-a35a1225ac26.png)

JS HTML Animations made easy.

```js
D(element,{
    width: '100px',
    height: '10px'
});
```
## Features

* Very efficient - Faster than other libraries such as Velocity and JQuery
* Standalone - No plugins needed
* Flexible and simple - A tree could use the API
* Animations for anything! Colors, functions (eg, `calculate(100% - 10px)`), hooks, unit conversions, and more

## Example

![ezgif-5-dfc1e29c39](https://user-images.githubusercontent.com/13282284/33789353-e60ee6aa-dc45-11e7-9793-da7eb6e4cf8c.gif)


```html
<!DOCTYPE html>
<html>
<head>
    <script src='../dist/differential.js'></script>
</head>
<body>
    <div id='test'>
    </div>
    <script>
        var el = document.getElementById('test');
        el.style.backgroundColor = 'blue';
        el.style.width = '100px';
        el.style.height = '100px';

        function repeat() {
            el.D([{
                    backgroundColor: 'red',
                    border: '20px solid rgb(255,255,0)',
                    width: '-=30px',
                    height: '-=30px'
                },
                {
                    backgroundColor: 'green',
                    border: '5px solid rgb(255,0,0)',
                    width: '+=30px',
                    height: '+=30px'
                },
                {
                    backgroundColor: 'blue',
                    borderColor: 'rgb(0,255,0)'
                },
                {
                    backgroundColor: 'rgb(255,0,255)',
                    border: '20px solid blue'
                },
                {
                    backgroundColor: 'rgb(0,255,255)',
                    border: '5px solid rgb(255,0,255)'
                },
                {
                    backgroundColor: 'rgb(255,255,0)',
                    borderColor: 'rgb(255,0,255)',
                }
            ], 1000, 'swing', repeat);
        }
        repeat();
    </script>
</body>
</html>
```

## Documentation

> window.D(element, properties[, options)
> window.D(element, properties[, duration[, ease[, callback)
> window.D(element, properties[, callback[, duration[, ease)
> window.D(funcName)
> window.D.funcName()
> HTMLElement.D(properties[, options)
> HTMLElement.D(properties[, duration[, ease[, callback)
> HTMLElement.D(properties[, callback[, duration[, ease)

### Options object

```js
{
    easing: options.easing || 'swing',
    done: options.done || function () {},
    queue: options.queue !== undefined ? options.queue : true,
    specialEasing: options.specialEasing,
    step: options.step,
    progress: options.progress,
    start: options.start || function () {},
    duration: options.duration || 400
}
```

### Properties Object

The properties object can be an object or an array of objects.

```js
{
    backgroundColor: 'red', // Color works fine, also works if you put #ff0000 or rgb(255,0,0)
    border: '20px solid rgb(255,255,0)', // Multiple properties in one line works fine
    width: '-=30px', // You can do operations such as +=, -=, *=, /=, and ^=
    height: '-=30em', // different units work fine. They are automatically converted.
    padding: '120%', // If the original value is not %, then it will be automatically relative, multiplying the original by %/100.
}
```

### Functions

There are some side-functions in Differential.js. To call them, either do `D(funcname,arg1,arg2...)` or `D.funcname(arg1,arg2...)`.


Available functions

* `addEase(name, easing)` - Adds an easing. Note than the `easing` argument can be a function or an array. An array of 4 items is automatically converted to a Bezier function
* `stop()` - Stops animations. Can be resumed via `start()`
* `start()` - Restarts animations.
* `clear()` - Clear all animations including pooled.

### Multiple-elements

This feature has not been implemented yet, but the feature is available on a library called [AQuery](https://github.com/ThreeLetters/AQuery) (which uses Differential.js)