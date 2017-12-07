function animate(element, properties, options) {
    options = convertOptions(options);
    var animateProperties = {};
    for (var name in properties) {
        var property = properties[name];
        var easing = options.easing;
        if (typeof property === 'object') {
            easing = property.easing || options.easing;
            property = property.value;
        }
        var operator = false;
        if (property.charAt(1) === '=') {
            operator = property.charAt(0);
            property = property.substr(2);
        }
        var obj = {
            nameJS: getJsString(name),
            nameCSS: getCssString(name),
            ending: null,
            toValue: null,
            originalValue: null,
            originalValueRaw: null,
            diffValue: null,
            init: function () {
                this.originalValueRaw = getProperty(element, this);
                this.originalValue = parseFloat(this.originalValueRaw);
                if (operator) {
                    switch (operator) {
                        case '+':
                            this.toValue = this.originalValue + this.toValue;
                            break;
                        case '-':
                            this.toValue = this.originalValue - this.toValue;
                            break;
                        case '*':
                            this.toValue = this.originalValue * this.toValue;
                            break;
                        case '/':
                            this.toValue = this.originalValue / this.toValue;
                            break;
                        case '^':
                            this.toValue = Math.pow(this.originalValue, this.toValue);
                            break;
                    }
                }
                this.diffValue = this.toValue - this.originalValue;
                if (!this.ending.trim()) {

                    this.ending = this.originalValueRaw.substr(this.originalValue.toString().length);
                }
            }
        }

        var toFloat = parseFloat(property);
        obj.ending = property.substr(toFloat.toString().length);
        obj.toValue = toFloat;

        if (!options.queue) obj.init();

        if (!animateProperties[easing]) animateProperties[easing] = [];
        animateProperties[easing].push(obj);
    }
    var Data = {
        element: element,
        options: options,
        properties: animateProperties,
        duration: options.duration,
        init: function () {
            for (var name in animateProperties) {
                animateProperties[name].forEach((property) => {
                    property.init();
                })
            }
        }
    };
    Queues[options.queue ? 'main' : 'parrallel'].list.push(Data);
    Stop = false;
    run();
}

function step(item, diff) {
    var fraction = diff / item.duration;
    for (var easing in item.properties) {
        var frac = Easings[easing](fraction);
        item.properties[easing].forEach((property) => {
            var value = property.diffValue * frac + property.originalValue
            item.element.style[property.nameJS] = value.toString() + property.ending;
        });
    }
}

function end(item, queueName) {
    for (var easing in item.properties) {
        item.properties[easing].forEach((property) => {
            item.element.style[property.nameJS] = property.toValue.toString() + property.ending;
        });
    }
    var queue = Queues[queueName]
    if (queue.parrallel) {
        var ind = Queue.list.indexOf(item);
        Queue.list.splice(ind, 1);
    } else {
        queue.active = false;
    }

}


function run() {
    if (Stop) return;
    window.requestAnimationFrame(run);
    let currentTime = Date.now(),
        diffTime = currentTime - Now;

    Now = currentTime;
    if (diffTime >= 1) {
        var stop = true;
        for (var name in Queues) {
            if (Queues[name].parrallel) {
                Queues[name].list.forEach((item) => {
                    if (item.startTime === undefined) {
                        item.startTime = Now;
                    } else {
                        var diff = Now - item.startTime;

                        if (diff >= item.duration) {
                            end(item, name);
                        } else {
                            step(item, diff, name);
                        }
                    }
                    stop = false;
                })
            } else {
                if (!Queues[name].active && Queues[name].list.length) {
                    Queues[name].active = Queues[name].list.pop();
                    Queues[name].active.init();
                }
                var item = Queues[name].active;
                if (item) {
                    if (item.startTime === undefined) {
                        item.startTime = Now;
                    } else {
                        var diff = Now - item.startTime;

                        if (diff >= item.duration) {
                            end(item, name);
                        } else {
                            step(item, diff, name);
                        }
                    }
                    stop = false;
                }
            }
        }
        if (stop) Stop = stop;
    }
}
