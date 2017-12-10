/*
 Differential.js: JS HTML Animation/movement engine

 Author: Andrews54757
 License: MIT (https://github.com/ThreeLetters/differential.js/blob/master/LICENSE)
 Source: https://github.com/ThreeLetters/differential.js
 Build: v0.0.1
 Built on: 10/12/2017
*/

window.D = (function (window) {
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
    Stop = true,
    Running = false,
    frameDur = 15;
var CSSSetHooks = {},
    CSSGetHooks = {};

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


var Colors = {
    "aliceblue": "240,248,255",
    "antiquewhite": "250,235,215",
    "aquamarine": "127,255,212",
    "aqua": "0,255,255",
    "azure": "240,255,255",
    "beige": "245,245,220",
    "bisque": "255,228,196",
    "black": "0,0,0",
    "blanchedalmond": "255,235,205",
    "blueviolet": "138,43,226",
    "blue": "0,0,255",
    "brown": "165,42,42",
    "burlywood": "222,184,135",
    "cadetblue": "95,158,160",
    "chartreuse": "127,255,0",
    "chocolate": "210,105,30",
    "coral": "255,127,80",
    "cornflowerblue": "100,149,237",
    "cornsilk": "255,248,220",
    "crimson": "220,20,60",
    "cyan": "0,255,255",
    "darkblue": "0,0,139",
    "darkcyan": "0,139,139",
    "darkgoldenrod": "184,134,11",
    "darkgray": "169,169,169",
    "darkgrey": "169,169,169",
    "darkgreen": "0,100,0",
    "darkkhaki": "189,183,107",
    "darkmagenta": "139,0,139",
    "darkolivegreen": "85,107,47",
    "darkorange": "255,140,0",
    "darkorchid": "153,50,204",
    "darkred": "139,0,0",
    "darksalmon": "233,150,122",
    "darkseagreen": "143,188,143",
    "darkslateblue": "72,61,139",
    "darkslategray": "47,79,79",
    "darkturquoise": "0,206,209",
    "darkviolet": "148,0,211",
    "deeppink": "255,20,147",
    "deepskyblue": "0,191,255",
    "dimgray": "105,105,105",
    "dimgrey": "105,105,105",
    "dodgerblue": "30,144,255",
    "firebrick": "178,34,34",
    "floralwhite": "255,250,240",
    "forestgreen": "34,139,34",
    "fuchsia": "255,0,255",
    "gainsboro": "220,220,220",
    "ghostwhite": "248,248,255",
    "gold": "255,215,0",
    "goldenrod": "218,165,32",
    "gray": "128,128,128",
    "grey": "128,128,128",
    "greenyellow": "173,255,47",
    "green": "0,128,0",
    "honeydew": "240,255,240",
    "hotpink": "255,105,180",
    "indianred": "205,92,92",
    "indigo": "75,0,130",
    "ivory": "255,255,240",
    "khaki": "240,230,140",
    "lavenderblush": "255,240,245",
    "lavender": "230,230,250",
    "lawngreen": "124,252,0",
    "lemonchiffon": "255,250,205",
    "lightblue": "173,216,230",
    "lightcoral": "240,128,128",
    "lightcyan": "224,255,255",
    "lightgoldenrodyellow": "250,250,210",
    "lightgray": "211,211,211",
    "lightgrey": "211,211,211",
    "lightgreen": "144,238,144",
    "lightpink": "255,182,193",
    "lightsalmon": "255,160,122",
    "lightseagreen": "32,178,170",
    "lightskyblue": "135,206,250",
    "lightslategray": "119,136,153",
    "lightsteelblue": "176,196,222",
    "lightyellow": "255,255,224",
    "limegreen": "50,205,50",
    "lime": "0,255,0",
    "linen": "250,240,230",
    "magenta": "255,0,255",
    "maroon": "128,0,0",
    "mediumaquamarine": "102,205,170",
    "mediumblue": "0,0,205",
    "mediumorchid": "186,85,211",
    "mediumpurple": "147,112,219",
    "mediumseagreen": "60,179,113",
    "mediumslateblue": "123,104,238",
    "mediumspringgreen": "0,250,154",
    "mediumturquoise": "72,209,204",
    "mediumvioletred": "199,21,133",
    "midnightblue": "25,25,112",
    "mintcream": "245,255,250",
    "mistyrose": "255,228,225",
    "moccasin": "255,228,181",
    "navajowhite": "255,222,173",
    "navy": "0,0,128",
    "oldlace": "253,245,230",
    "olivedrab": "107,142,35",
    "olive": "128,128,0",
    "orangered": "255,69,0",
    "orange": "255,165,0",
    "orchid": "218,112,214",
    "palegoldenrod": "238,232,170",
    "palegreen": "152,251,152",
    "paleturquoise": "175,238,238",
    "palevioletred": "219,112,147",
    "papayawhip": "255,239,213",
    "peachpuff": "255,218,185",
    "peru": "205,133,63",
    "pink": "255,192,203",
    "plum": "221,160,221",
    "powderblue": "176,224,230",
    "purple": "128,0,128",
    "red": "255,0,0",
    "rosybrown": "188,143,143",
    "royalblue": "65,105,225",
    "saddlebrown": "139,69,19",
    "salmon": "250,128,114",
    "sandybrown": "244,164,96",
    "seagreen": "46,139,87",
    "seashell": "255,245,238",
    "sienna": "160,82,45",
    "silver": "192,192,192",
    "skyblue": "135,206,235",
    "slateblue": "106,90,205",
    "slategray": "112,128,144",
    "snow": "255,250,250",
    "springgreen": "0,255,127",
    "steelblue": "70,130,180",
    "tan": "210,180,140",
    "teal": "0,128,128",
    "thistle": "216,191,216",
    "tomato": "255,99,71",
    "turquoise": "64,224,208",
    "violet": "238,130,238",
    "wheat": "245,222,179",
    "whitesmoke": "245,245,245",
    "white": "255,255,255",
    "yellowgreen": "154,205,50",
    "yellow": "255,255,0"
}
for (var name in Colors) {
    Colors[name] = Colors[name].split(',').map((num) => {
        return parseInt(num)
    })
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

if (!window.requestAnimationFrame) window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;

var Timer = (function () {
    if (window.performance && window.performance.now) {
        return window.performance;
    } else {
        return Date;
    }
})();

var Now = Timer.now();
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
// css/builder.js
function buildCSS(obj) {
    var out = [];

    function recurse(arr) {

        arr.forEach((property) => {
            switch (property[0]) {
                case 0:
                    out.push(property[1], property[2], ' ')
                    break;
                case 1:
                    out.push(property[1], '(');
                    property[2].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        recurse(prop);
                    })
                    out.push(')', ' ');
                    break;
                case 2:
                    out.push('rgb(');
                    property[1].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        out.push(prop);
                    })
                    out.push(')', ' ');
                    break;
                case 3:
                    out.push(property[1], ' ');
                    break;
            }
        })
    }
    recurse(obj)
    out.pop();
    return out.join('')
}
// css/converter.js
var convertUnits = (function () {

    var Map = {};
    var test = document.createElement("div");
    test.style.visibility = test.style.overflow = "hidden";
    var baseline = 150;

    function populateMap() {
        var Units = ['px', 'in', 'cm', 'mm', 'pt', 'pc'];
        document.body.appendChild(test);
        Units.forEach((unit) => {
            test.style.width = baseline + unit;
            Map[unit] = baseline / test.offsetWidth;
        })
        document.body.removeChild(test)
    }
    window.addEventListener('load', function () {
        populateMap();
    });

    function converter(element, value, from, to) {

        var fromRatio = Map[from]; // [unit]/px
        var toRatio = Map[to]; // [unit]/px

        if (!fromRatio || !toRatio) {
            element.appendChild(test);
            if (!fromRatio) {
                test.style.width = baseline + from;
                fromRatio = baseline / test.offsetWidth;
            }
            if (!toRatio) {
                test.style.width = baseline + to;
                toRatio = baseline / test.offsetWidth;
            }
            element.removeChild(test);
        }
        return ((value / fromRatio) * toRatio); // [u1] * 1/([u1]/px) * [u2]/px;
    }
    return converter;
})();
// css/css.js
function getProperty(element, propData) {
    if (CSSGetHooks[propData.nameJS]) return CSSGetHooks[propData.nameJS](element, propData)
    if (element.style[propData.nameJS]) return element.style[propData.nameJS];
    var styles = window.getComputedStyle(element);
    return styles.getPropertyValue(propData.nameCSS);
}

function setProperty(element, propData, value) {
    if (CSSSetHooks[propData.nameJS]) {
        var dt = CSSSetHooks[propData.nameJS](element, propData, value);
        if (dt) element.style[dt[0]] = dt[1];
    } else {
        element.style[propData.nameJS] = value;
    }
    return;
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
// css/manipulator.js
function operate(value, value2, operator) {
    switch (operator) {
        case '+':
            return value + value2;
            break;
        case '-':
            return value - value2;
            break;
        case '*':
            return value * value2;
            break;
        case '/':
            return value / value2;
            break;
        case '^':
            return Math.pow(value, value2);
            break;
        default:
            return value;
            break;
    }

}

function operateCSS(css1, css2, operator) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i]) throw 'Fail';
        switch (css2[i][0]) {

            case 0: // number
                if (css2[i][3] === false) css2[i][1] = 0;
                css2[i][1] = operate(css1[i][1], css2[i][1], operator);
                break;
            case 1: // function
                css2[i][2].forEach((prop, ind) => {
                    operateCSS(css1[i][2][ind], css2[i][2][ind], operator);
                });
                break;
            case 2: // color
                if (css2[i][2] === false) {
                    css2[i][1].forEach((prop, ind) => {
                        css2[i][1][ind] = parseInt(operate(0, prop, operator))
                    })
                } else {
                    css2[i][1].forEach((prop, ind) => {
                        css2[i][1][ind] = parseInt(operate(css1[i][1][ind], prop, operator))
                    })
                }
                break;
            case 3: // string

                break;
        }
    }
}

function setUnitsCSS(element, css1, css2) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i]) {
            css1[i] = css2[i].slice(0);
            css1[i].push(false)
            continue;
        }
        switch (css2[i][0]) {
            case 0: // number
                if (css2[i][2]) {
                    if (!css1[i][2]) css1[i][2] = css2[i][2];
                    else if (css1[i][2] !== css2[i][2]) {
                        if (css2[i][2] === '%') {
                            css2[i][2] = css1[i][2];
                            css2[i][1] = css1[i][1] * (css2[i][1] / 100);
                        } else {

                            css1[i][1] = convertUnits(element, css1[i][1], css1[i][2], css2[i][2])
                            css1[i][2] = css2[i][2];
                        }
                    }

                }
                css1[i][2] = css2[i][2];
                break;
            case 1: // function
                css2[i][2].forEach((prop, ind) => {
                    if (!css1[i][2][ind]) css1[i][2][ind] = [];
                    setUnitsCSS(element, css1[i][2][ind], css2[i][2][ind]);
                });
                break;
        }
    }
}

function setDiffCSS(css1, css2) {
    for (var i = 0; i < css2.length; ++i) {
        if (!css1[i]) throw "Fail";
        switch (css2[i][0]) {
            case 0: // number
                css1[i][3] = css2[i][1] - css1[i][1];
                break;
            case 2: // color
                css1[i][2] = [];
                css2[i][1].forEach((prop, ind) => {
                    css1[i][2][ind] = prop - css1[i][1][ind];
                })
                break;
            case 1: // function
                css2[i][2].forEach((prop, ind) => {
                    setDiffCSS(css1[i][2][ind], css2[i][2][ind]);
                });
                break;
            case 3: // string
                css1[i][1] = css2[i][1];
                break;
        }
    }
}

function setCSSFrac(item, property, fraction) {
    var out = [];

    function recurse(arr) {
        arr.forEach((property) => {
            switch (property[0]) {
                case 0:
                    out.push(property[1] + property[3] * fraction, property[2], ' ')
                    break;
                case 1:
                    out.push(property[1], '(');
                    property[2].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        recurse(prop);
                    })
                    out.push(')', ' ');
                    break;
                case 2:
                    out.push('rgb(');
                    property[1].forEach((prop, i) => {
                        if (i !== 0) out.push(',');
                        out.push(Math.floor(prop + property[2][i] * fraction));
                    })
                    out.push(')', ' ');
                    break;
                case 3:
                    out.push(property[1], ' ');
                    break;
            }
        })
    }
    recurse(property.originalValue)
    out.pop();
    setProperty(item.element, property, out.join(''));

}
// css/parser.js
function splitSafe(str) {

    str = str.split('');
    var current = [];
    var out = [];
    var i = 0;
    var len = str.length;
    var char;
    var level = 0;

    function skip(match) {
        var backslash = false;
        for (++i; i < len; i++) {
            char = str[i];
            current.push(char);
            if (char === "\\") backslash = true;
            else if (char === match && !backslash) {
                break;
            } else if (backslash) {
                backslash = false;
            }
        }
    }

    for (i = 0; i < len; ++i) {
        char = str[i];
        current.push(char);
        if (char === '"' || char === "'") skip(char);
        else if (char === '(') {
            level++;
        } else if (char === ')') {
            level--;
            if (level < 0) throw 'Fail';
        } else if (level === 0 && char === ',') {
            out.push(current.join(''))
            current = [];
        }
    }
    if (current.length) out.push(current.join(''))
    return out;
}

function parseCSS(string, obj) {
    if (!obj) obj = []
    if (!string) return obj;
    if (string.charAt(0) === '"') {
        var match = string.match(/("(?:[^"\\]|\\.)*")(?: (.*))?/);
        obj.push([3, match[1]]);
        parseCSS(match[2], obj);
    } else if (string.charAt(0) === "'") {
        var match = string.match(/('(?:[^'\\]|\\.)*')(?: (.*))?/);
        obj.push([3, match[1]]);
        parseCSS(match[2], obj);
    } else {
        var number = string.match(/^([0-9\.]*)(em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax|s|ms|deg|grad|rad|turn|Q)?(?: (.*))?/);
        if (number[1]) { // number
            obj.push([0, parseFloat(number[1]), number[2] || '']);
            parseCSS(number[3], obj);
        } else {
            var func = string.match(/^([a-z\-]*?)\(([^\)]*)\)(?: (.*))?/)

            if (func && func[1]) {

                if (func[1] === 'rgb') {
                    obj.push([2, splitSafe(func[2]).map((arg) => {
                        return parseInt(arg);
                    })]);
                } else {
                    var args = splitSafe(func[2]).map((arg) => {
                        return parseCSS(arg);
                    });
                    obj.push([1, func[1], args]);
                }
                parseCSS(func[3], obj);
            } else {

                if (string.charAt(0) === '#') {
                    var results = string.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})(?: (.*))?/);
                    obj.push([2, hexToRgb(results[1])]);

                    parseCSS(results[2], obj);
                } else {
                    var res = string.match(/^([a-z\-]*?)(?: (.*))/);
                    if (res && res[1]) {
                        if (Colors[res[1]]) {
                            obj.push([2, Colors[res[1]].slice(0)])
                        } else {
                            obj.push([3, res[1]]);
                        }
                        parseCSS(res[2], obj);
                    } else {
                        if (Colors[string]) {
                            obj.push([2, Colors[string].slice(0)])
                        } else {
                            obj.push([3, string]);
                        }
                    }
                }
            }
        }
    }
    return obj;
}
// animate.js
function animate(element, properties, options) {
    var animateProperties = {};
    for (var name in properties) {
        (function (properties, name) {
            var property = properties[name];
            var easing = options.easing;
            if (typeof property === 'object') {
                easing = property.easing || options.easing;
                property = property.value;
            }
            property = property.toString();
            var operator = false;
            if (property.charAt(1) === '=') {
                operator = property.charAt(0);
                property = property.substr(2);
            }
            var obj = {
                nameJS: getJsString(name),
                nameCSS: getCssString(name),
                toValue: null,
                toValueRaw: null,
                originalValue: null,
                originalValueRaw: null,
                init: function () {
                    this.originalValueRaw = getProperty(element, this);

                    if (!this.originalValueRaw || this.originalValueRaw === this.toValueRaw) {
                        setProperty(element, this, this.toValueRaw);
                        return false;
                    }
                    //   console.log(this.originalValueRaw)
                    this.originalValue = parseCSS(this.originalValueRaw);
                    setUnitsCSS(element, this.originalValue, this.toValue)
                    if (operator) {
                        operateCSS(this.originalValue, this.toValue, operator);
                    }
                    setDiffCSS(this.originalValue, this.toValue);
                    //  console.log(this.originalValue, this.toValue)
                    return true;
                }
            }
            obj.toValueRaw = property;
            obj.toValue = parseCSS(obj.toValueRaw);
            if (!animateProperties[easing]) animateProperties[easing] = [];

            if (!options.queue) {
                if (obj.init()) animateProperties[easing].push(obj);
            } else {
                animateProperties[easing].push(obj);
            }
        })(properties, name);
    }
    var Data = {
        element: element,
        options: options,
        properties: animateProperties,
        duration: options.duration,
        init: function () {
            var run = false;
            for (var name in animateProperties) {
                animateProperties[name] = animateProperties[name].filter((property) => {
                    if (property.init()) {
                        run = true;
                        return true;
                    } else return false;
                });
            }
            return run;
        }
    };

    if (!options.queue) options.start();
    Queues[options.queue ? 'main' : 'parrallel'].list.splice(0, 0, Data);
    startLoop();
}

function step(item, diff) {
    var fraction = diff / item.duration;
    for (var easing in item.properties) {
        var frac = Easings[easing](fraction);
        item.properties[easing].forEach((property) => {
            setCSSFrac(item, property, fraction)
        });
    }
}

function end(item, queueName) {
    for (var easing in item.properties) {
        item.properties[easing].forEach((property) => {
            setProperty(item.element, property, buildCSS(property.toValue));
        });
    }
    var queue = Queues[queueName]
    if (queue.parrallel) {
        var ind = queue.list.indexOf(item);
        queue.list.splice(ind, 1);
    } else {
        queue.active = false;
    }
    item.options.done();
}

function startLoop() {
    if (!Running) {
        Stop = false;
        timerLoop(false);
    }
}

function timerLoop(animationFrame) {
    if (Stop) return Running = false;
    else Running = true;
    window.requestAnimationFrame(function () {
        timerLoop(false)
    });
    let currentTime = Timer.now(),
        diffTime = currentTime - Now;


    Now = currentTime;
    process();
}

function process() {
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
                Queues[name].active.options.start();
                if (!Queues[name].active.init()) {
                    Queues[name].active.done();
                    Queues[name].active = false;
                };
                stop = false;
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
// index.js
function D(element, properties, options, options2, callback) {

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

            var i = 0;

            function loop() {
                var p = properties[i];
                if (!p) return;
                var newoptions = convertOptions(options);
                if (start && i === 0) {
                    newoptions.start = start;
                }
                newoptions.done = function () {
                    i++;
                    if (i === properties.length) {
                        done();
                        return;
                    }
                    loop();
                }

                animate(element, p, newoptions);

            }

            loop();
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
    startLoop();
}

D.fps = function (value) {
    if (value) frameDur
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

return D;
})(window)