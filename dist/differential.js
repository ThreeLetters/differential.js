/*
 Differential.js: JS HTML Animation/movement engine

 Author: Andrews54757
 License: MIT (https://github.com/ThreeLetters/differential.js/blob/master/LICENSE)
 Source: https://github.com/ThreeLetters/differential.js
 Build: v0.0.1
 Built on: 07/12/2017
*/

// init.js
var Easings = {},
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
    },
    Now = Date.now(),
    Stop = true;

function convertOptions(options) {
    return {
        easing: options.easing || 'swing',
        done: options.done || function () {},
        queue: options.queue !== undefined ? options.queue : true,
        specialEasing: options.specialEasing,
        step: options.step,
        progress: options.progress,
        start: options.start || function () {},
        duration: options.duration || 400
    }
}
// easings/custom.js
/*
Easing bezier curves. Velocity.js

The MIT License

Copyright (c) 2014 Julian Shapiro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var curves = {
    "ease": [0.25, 0.1, 0.25, 1],
    "ease-in": [0.42, 0, 1, 1],
    "ease-out": [0, 0, 0.58, 1],
    "ease-in-out": [0.42, 0, 0.58, 1],
    "easeInSine": [0.47, 0, 0.745, 0.715],
    "easeOutSine": [0.39, 0.575, 0.565, 1],
    "easeInOutSine": [0.445, 0.05, 0.55, 0.95],
    "easeInQuad": [0.55, 0.085, 0.68, 0.53],
    "easeOutQuad": [0.25, 0.46, 0.45, 0.94],
    "easeInOutQuad": [0.455, 0.03, 0.515, 0.955],
    "easeInCubic": [0.55, 0.055, 0.675, 0.19],
    "easeOutCubic": [0.215, 0.61, 0.355, 1],
    "easeInOutCubic": [0.645, 0.045, 0.355, 1],
    "easeInQuart": [0.895, 0.03, 0.685, 0.22],
    "easeOutQuart": [0.165, 0.84, 0.44, 1],
    "easeInOutQuart": [0.77, 0, 0.175, 1],
    "easeInQuint": [0.755, 0.05, 0.855, 0.06],
    "easeOutQuint": [0.23, 1, 0.32, 1],
    "easeInOutQuint": [0.86, 0, 0.07, 1],
    "easeInExpo": [0.95, 0.05, 0.795, 0.035],
    "easeOutExpo": [0.19, 1, 0.22, 1],
    "easeInOutExpo": [1, 0, 0, 1],
    "easeInCirc": [0.6, 0.04, 0.98, 0.335],
    "easeOutCirc": [0.075, 0.82, 0.165, 1],
    "easeInOutCirc": [0.785, 0.135, 0.15, 0.86]
}

for (var name in curves) {
    var curve = curves[name];
    Easings[name] = generateBezier(curve[0], curve[1], curve[2], curve[3]);
}
// easings/easings.js
Easings.linear = function (x) {
    return x;
}
Easings.swing = function (x) {
    return 0.5 - Math.cos(x * Math.PI) / 2;
}
// easings/generators.js
/*
Velocity.js Generators

The MIT License

Copyright (c) 2014 Julian Shapiro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/



/* Bezier curve function generator. Copyright Gaetan Renaudeau. MIT License: http://en.wikipedia.org/wiki/MIT_License */
function generateBezier(mX1, mY1, mX2, mY2) {
    var NEWTON_ITERATIONS = 4,
        NEWTON_MIN_SLOPE = 0.001,
        SUBDIVISION_PRECISION = 0.0000001,
        SUBDIVISION_MAX_ITERATIONS = 10,
        kSplineTableSize = 11,
        kSampleStepSize = 1.0 / (kSplineTableSize - 1.0),
        float32ArraySupported = "Float32Array" in window;

    /* Must contain four arguments. */
    if (arguments.length !== 4) {
        return false;
    }

    /* Arguments must be numbers. */
    for (var i = 0; i < 4; ++i) {
        if (typeof arguments[i] !== "number" || isNaN(arguments[i]) || !isFinite(arguments[i])) {
            return false;
        }
    }

    /* X values must be in the [0, 1] range. */
    mX1 = Math.min(mX1, 1);
    mX2 = Math.min(mX2, 1);
    mX1 = Math.max(mX1, 0);
    mX2 = Math.max(mX2, 0);

    var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

    function A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
    }

    function B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
    }

    function C(aA1) {
        return 3.0 * aA1;
    }

    function calcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
    }

    function getSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function newtonRaphsonIterate(aX, aGuessT) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
            var currentSlope = getSlope(aGuessT, mX1, mX2);

            if (currentSlope === 0.0) {
                return aGuessT;
            }

            var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }

        return aGuessT;
    }

    function calcSampleValues() {
        for (var i = 0; i < kSplineTableSize; ++i) {
            mSampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
        }
    }

    function binarySubdivide(aX, aA, aB) {
        var currentX, currentT, i = 0;

        do {
            currentT = aA + (aB - aA) / 2.0;
            currentX = calcBezier(currentT, mX1, mX2) - aX;
            if (currentX > 0.0) {
                aB = currentT;
            } else {
                aA = currentT;
            }
        } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);

        return currentT;
    }

    function getTForX(aX) {
        var intervalStart = 0.0,
            currentSample = 1,
            lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
            intervalStart += kSampleStepSize;
        }

        --currentSample;

        var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample + 1] - mSampleValues[currentSample]),
            guessForT = intervalStart + dist * kSampleStepSize,
            initialSlope = getSlope(guessForT, mX1, mX2);

        if (initialSlope >= NEWTON_MIN_SLOPE) {
            return newtonRaphsonIterate(aX, guessForT);
        } else if (initialSlope === 0.0) {
            return guessForT;
        } else {
            return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize);
        }
    }

    var _precomputed = false;

    function precompute() {
        _precomputed = true;
        if (mX1 !== mY1 || mX2 !== mY2) {
            calcSampleValues();
        }
    }

    var f = function (aX) {
        if (!_precomputed) {
            precompute();
        }
        if (mX1 === mY1 && mX2 === mY2) {
            return aX;
        }
        if (aX === 0) {
            return 0;
        }
        if (aX === 1) {
            return 1;
        }

        return calcBezier(getTForX(aX), mY1, mY2);
    };

    f.getControlPoints = function () {
        return [{
            x: mX1,
            y: mY1
        }, {
            x: mX2,
            y: mY2
        }];
    };

    var str = "generateBezier(" + [mX1, mY1, mX2, mY2] + ")";
    f.toString = function () {
        return str;
    };

    return f;
}
/* Runge-Kutta spring physics function generator. Adapted from Framer.js, copyright Koen Bok. MIT License: http://en.wikipedia.org/wiki/MIT_License */
/* Given a tension, friction, and duration, a simulation at 60FPS will first run without a defined duration in order to calculate the full path. A second pass
 then adjusts the time delta -- using the relation between actual time and duration -- to calculate the path for the duration-constrained animation. */

var generateSpringRK4 = (function () {
    function springAccelerationForState(state) {
        return (-state.tension * state.x) - (state.friction * state.v);
    }

    function springEvaluateStateWithDerivative(initialState, dt, derivative) {
        var state = {
            x: initialState.x + derivative.dx * dt,
            v: initialState.v + derivative.dv * dt,
            tension: initialState.tension,
            friction: initialState.friction
        };

        return {
            dx: state.v,
            dv: springAccelerationForState(state)
        };
    }

    function springIntegrateState(state, dt) {
        var a = {
                dx: state.v,
                dv: springAccelerationForState(state)
            },
            b = springEvaluateStateWithDerivative(state, dt * 0.5, a),
            c = springEvaluateStateWithDerivative(state, dt * 0.5, b),
            d = springEvaluateStateWithDerivative(state, dt, c),
            dxdt = 1.0 / 6.0 * (a.dx + 2.0 * (b.dx + c.dx) + d.dx),
            dvdt = 1.0 / 6.0 * (a.dv + 2.0 * (b.dv + c.dv) + d.dv);

        state.x = state.x + dxdt * dt;
        state.v = state.v + dvdt * dt;

        return state;
    }

    return function springRK4Factory(tension, friction, duration) {

        var initState = {
                x: -1,
                v: 0,
                tension: null,
                friction: null
            },
            path = [0],
            time_lapsed = 0,
            tolerance = 1 / 10000,
            DT = 16 / 1000,
            have_duration, dt, last_state;

        tension = parseFloat(tension) || 500;
        friction = parseFloat(friction) || 20;
        duration = duration || null;

        initState.tension = tension;
        initState.friction = friction;

        have_duration = duration !== null;

        /* Calculate the actual time it takes for this animation to complete with the provided conditions. */
        if (have_duration) {
            /* Run the simulation without a duration. */
            time_lapsed = springRK4Factory(tension, friction);
            /* Compute the adjusted time delta. */
            dt = time_lapsed / duration * DT;
        } else {
            dt = DT;
        }

        while (true) {
            /* Next/step function .*/
            last_state = springIntegrateState(last_state || initState, dt);
            /* Store the position. */
            path.push(1 + last_state.x);
            time_lapsed += 16;
            /* If the change threshold is reached, break. */
            if (!(Math.abs(last_state.x) > tolerance && Math.abs(last_state.v) > tolerance)) {
                break;
            }
        }

        /* If duration is not defined, return the actual time required for completing this animation. Otherwise, return a closure that holds the
         computed path and returns a snapshot of the position according to a given percentComplete. */
        return !have_duration ? time_lapsed : function (percentComplete) {
            return path[(percentComplete * (path.length - 1)) | 0];
        };
    };
}());

/* Step easing generator. */
function generateStep(steps) {
    return function (p) {
        return Math.round(p * steps) * (1 / steps);
    };
}
// css.js
function getProperty(element, propData) {
    if (element.style[propData.nameJS]) return element.style[propData.nameJS];
    var styles = window.getComputedStyle(element);
    return styles.getPropertyValue(propData.nameCSS);
}

function getCssString(property) {
    return property.replace(/[A-Z]/g, function (a) {
        return '-' + a.toLowerCase();
    });
}

function getJsString(name) {

    return name.split('-').map((n, i) => {
        if (i !== 0) return capitalizeFirstLetter(n);
        return n;
    }).join('');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// animate.js
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
// index.js
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
        return animate(element, properties, options || {});
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
