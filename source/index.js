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
            } else {
                options = {
                    duration: options
                }
                if (options2) options.easing = options2;
                if (callback) options.done = callback;
            }
        }
        if (Array.isArray(properties)) {
            return properties.map((p) => {
                return animate(element, p, options || {});
            });
        } else {
            return animate(element, properties, options || {});
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
