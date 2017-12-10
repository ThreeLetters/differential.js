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
