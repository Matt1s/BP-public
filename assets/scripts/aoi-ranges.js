// global range
const startGlobal = document.getElementById('global-start');
const endGlobal = document.getElementById('global-end');
const rangeStartGlobal = document.getElementById('range-start-global');
const rangeEndGlobal = document.getElementById('range-end-global');

// module range
const startModule = document.getElementById('module-start');
const endModule = document.getElementById('module-end');
const rangeStartModule = document.getElementById('range-start-module');
const rangeEndModule = document.getElementById('range-end-module');

// image range
const startImage = document.getElementById('image-start');
const endImage = document.getElementById('image-end');
const rangeStartImage = document.getElementById('range-start-image');
const rangeEndImage = document.getElementById('range-end-image');

const MODULE_MAX_VALUE = endModule.value;
const IMAGE_MAX_VALUE = endImage.value;


startGlobal.addEventListener('input', () => {
    if (parseInt(startGlobal.value) >= parseInt(endGlobal.value)) {
        startGlobal.value = parseInt(endGlobal.value) - 1;
    }
    updateRange();
});

endGlobal.addEventListener('input', () => {
    if (parseInt(endGlobal.value) <= parseInt(startGlobal.value)) {
        endGlobal.value = parseInt(startGlobal.value) + 1;
    }
    updateRange();
});

startModule.addEventListener('input', () => {
    if (parseInt(startModule.value) >= parseInt(endModule.value)) {
        startModule.value = parseInt(endModule.value) - 1;
    }
    updateRange();
});

endModule.addEventListener('input', () => {
    if (parseInt(endModule.value) <= parseInt(startModule.value)) {
        endModule.value = parseInt(startModule.value) + 1;
    }
    updateRange();
});

startImage.addEventListener('input', () => {
    if (parseInt(startImage.value) >= parseInt(endImage.value)) {
        startImage.value = parseInt(endImage.value) - 1;
    }
    updateRange();
});

endImage.addEventListener('input', () => {
    if (parseInt(endImage.value) <= parseInt(startImage.value)) {
        endImage.value = parseInt(startImage.value) + 1;
    }
    updateRange();
});

var overridingModule = false;
var overridingImage = false;

$('#override-module').click(function () {
    if (overridingModule) {
        overridingModule = false;
        $('#module-settings > .blocker').css('display', 'block');
        $('#override-module').text('Not overriding')
        $('#override-module').removeClass('btn-positive');
    } else {
        overridingModule = true;
        $('#module-settings > .blocker').css('display', 'none');
        $('#override-module').text('Overriding')
        $('#override-module').addClass('btn-positive');
    }
});

$('#override-image').click(function () {
    if (overridingImage) {
        overridingImage = false;
        $('#image-settings > .blocker').css('display', 'block');
        $('#override-image').text('Not overriding')
        $('#override-image').removeClass('btn-positive');
    } else {
        overridingImage = true;
        $('#image-settings > .blocker').css('display', 'none');
        $('#override-image').text('Overriding')
        $('#override-image').addClass('btn-positive');
    }
});


function updateRange() {
    rangeStartGlobal.textContent = startGlobal.value + " ms";
    rangeEndGlobal.textContent = endGlobal.value + " ms";

    if ($('#module-settings > .blocker').css('display') == 'none' && $('#image-settings > .blocker').css('display') == 'block') {
        // use module to set image
        rangeStartImage.textContent = startModule.value + " ms"
        startImage.value = startModule.value;
        rangeStartModule.textContent = startModule.value + " ms"
        rangeEndModule.textContent = endModule.value + " ms"
        console.log("endImage.value: " + endImage.value)
        console.log("endModule.value: " + endModule.value)
        console.log("IMAGE_MAX_VALUE: " + IMAGE_MAX_VALUE)

        if (parseInt(IMAGE_MAX_VALUE) >= parseInt(endModule.value)) {
            console.log("IMAGE_MAX_VALUE >= endModule.value")
            rangeEndImage.textContent = endModule.value + " ms"
            endImage.value = endModule.value;
        }
    } else {
        if ($('#module-settings > .blocker').css('display') == 'block') {
            rangeStartModule.textContent = startGlobal.value + " ms"
            startModule.value = startGlobal.value;
            if (parseInt(MODULE_MAX_VALUE) >= parseInt(endGlobal.value)) {
                rangeEndModule.textContent = endGlobal.value + " ms"
                endModule.value = endGlobal.value;
            }
        } else {
            rangeStartModule.textContent = startModule.value + " ms"
            rangeEndModule.textContent = endModule.value + " ms"
        }
        if ($('#image-settings > .blocker').css('display') == 'block') {
            rangeStartImage.textContent = startGlobal.value + " ms"
            startImage.value = startGlobal.value;
            if (parseInt(IMAGE_MAX_VALUE) >= parseInt(endModule.value)) {
                rangeEndImage.textContent = endModule.value + " ms"
                endImage.value = endModule.value;
            }
        } else {
            rangeStartImage.textContent = startImage.value + " ms"
            rangeEndImage.textContent = endImage.value + " ms"
        }
    }
}