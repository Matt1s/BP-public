const URL = "http://localhost:3000";

var dataGlobal = [];

$(document).ready(function () {
    fetchData();
});

function showModules(data) {
    dataGlobal = data;
    for (module of data) {
        $('.aoi-modules').append(
            `<div class="aoi-module">
            <h4>${module.name}</h4>
            <p><span id="${module.name}-count">${module.images.length}</span> images</p>
            </div>`
        )
        console.log(module)
    }
    $("#module-name").text(data[0].name);
    $("#image-count-total").text(data[0].images.length);
    showImages(data[0].images);
    activateClickers();
}


function updateAOI(x, y, w, h) {
    // update the coordinates in globalData 
    var currentModule = $('#module-name').text();
    var currentImage = $('#image-name').text();
    console.log(currentModule, currentImage, x, y, w, h);

    dataGlobal.filter(module => module.name == currentModule)[0].images.filter(image => image.src.split('/').pop() == currentImage)[0].aoi = {
        x: x,
        y: y,
        width: w,
        height: h
    };
    console.log("updated data: ", dataGlobal);

}

async function saveAOI() {
    // save the coordinates to the database
    console.log("DATA GLOBAL BEFORE SAVE: ", dataGlobal);
    await fetch(`http://localhost:3000/saveAOI`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataGlobal)
    })

}

function activateClickers() {
    $('.aoi-module').click(function () {
        $('.aoi-module').removeClass('active');
        $(this).addClass('active');
        let name = $(this).find('h4').text();
        $("#module-name").text(name);
        let images = dataGlobal.filter(module => module.name == name)[0].images;
        console.log("images: ", images)
        $('#image-count').text(1);
        showImages(images);
        $("#image-count-total").text(images.length);
    })
}


function showImages(images) {
    $('.module-swiper > .swiper-wrapper').empty();
    $('.aoi-image-area-image > img').attr('src', `./assets/data${images[0].src}`);
    $('#image-name').text(images[0].src.split('/').pop());
    for (image of images) {
        $('.module-swiper > .swiper-wrapper').append(
            `<div class="swiper-slide">
            <img src="./assets/data${image.src}" alt="Module image">
        </div>`
        )
    }
    // make first image active
    $('.module-swiper > .swiper-wrapper > .swiper-slide').first().addClass('active');
    activateImages();
    showCurrentAOI();
}

function activateImages() {
    $('.module-swiper > .swiper-wrapper img').click(function () {
        $('.module-swiper > .swiper-wrapper > .swiper-slide').removeClass('active');
        $(this).parent().addClass('active');
        $('.aoi-image-area-image > img').attr('src', $(this).attr('src'));
        $('#image-name').text($(this).attr('src').split('/').pop());
        $('#image-count').text($(this).parent().index() + 1);
        startXY = 0;
        endXY = 0;
        imageDrawn = false;

        // find the image in the data
        showCurrentAOI()
    })
}

function showCurrentAOI() {
    $('#rectangle').css('display', 'none');
    let currentModule = $('#module-name').text();
    let currentImage = $('#image-name').text();
    let currentImageObject = dataGlobal.filter(module => module.name == currentModule)[0].images.filter(image => image.src.split('/').pop() == currentImage)[0];
    console.log("current aoi: ", currentImageObject.aoi);
    if (currentImageObject.aoi) {
        var aoi = currentImageObject.aoi;
        if ((aoi.x == 0 && aoi.y == 0 && aoi.width == 0 && aoi.height == 0)) {
            return
        } else {
            currentImageObject.aoi = aoi;
            startXY = [aoi.x, aoi.y]
            endXY = [aoi.x + aoi.width, aoi.y + aoi.height]
            imageDrawn = true;
            drawRectangle(aoi.x, aoi.y, aoi.width, aoi.height, false);
            $('.window-close').css('display', 'flex')
        }
    }
}

$('.btn-nav.back').click(function () {
    window.location.href = './index.html';
})


async function fetchData() {
    await fetch('http://localhost:3000/loadChecked')
        .then((serverPromise) =>
            serverPromise.json()
                .then((j) => showModules(j))
                .catch((e) => console.log(e))
        )
        .catch((e) => console.log(e));
}

