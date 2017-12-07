Easings.linear = function (x) {
    return x;
}
Easings.swing = function (x) {
    return 0.5 - Math.cos(x * Math.PI) / 2;
}
