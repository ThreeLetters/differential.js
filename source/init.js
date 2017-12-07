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
