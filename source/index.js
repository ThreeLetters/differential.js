window.D = function D(element, properties, options, options2, callback) {

    if (typeof element === 'string') {
        return D[element].apply(Array.from(arguments).slice(1));
    } else {
        if (options && typeof options !== 'object') {
            if (typeof options === 'function') {
                options = {
                    done: options
                };
                if (options2) options.duration = options2
                if (callback) options.easing = callback;
            } else if (typeof options === 'number') {
                options = {
                    duration: options
                }
                if (options2) options.easing = options2;
                if (callback) options.done = callback;
            }
        }

        options = convertOptions(options || {});
        if (Array.isArray(properties)) {
            var start = false,
                done = false;
            if (options.start) {
                start = options.start;
                options.start = function () {};
            }
            if (options.done) {
                done = options.done;
                options.done = function () {};
            }

            return properties.map((p, i) => {

                if (start && i === 0) {
                    var newoptions = convertOptions(options);
                    newoptions.start = start;
                    return animate(element, p, newoptions);
                } else if (done && i === properties.length - 1) {
                    var newoptions = convertOptions(options);
                    newoptions.done = done;
                    return animate(element, p, newoptions);
                } else {
                    return animate(element, p, options);
                }
            });
        } else {
            return animate(element, properties, options);
        }
    }
}

D.addEase = function (name, easing) {
    if (typeof easing === 'function') {
        Easings[name] = easing;
    } else if (typeof easing === 'object') {
        Easings[name] = (easing.length === 4) ? generateBezier(easing[0], easing[1], easing[2], easing[3]) : generateSpringRK4(easing[0], easing[1]);
    } else {
        Easings[name] = generateStep(easing);
    }
}

D.stop = function () {
    Stop = true;
}
D.start = function () {
    Stop = false;
    run();
}

D.clear = function () {
    Queues = {
        main: {
            list: [],
            active: false,
            parrallel: false
        },
        parrallel: {
            list: [],
            active: false,
            parrallel: true
        }
    }
}

HTMLElement.prototype.D = function (properties, options, options2, callback) {
    return D(this, properties, options, options2, callback)
}
