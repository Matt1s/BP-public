// fetch data.json

var dataGlobal = {};

const URL = 'http://localhost:3000';

async function fetchModules() {
    await fetch(`${URL}/load`)
        .then(response => response.json())
        .then(data => {

            dataGlobal = data;
            document.querySelector('.modules > .swiper-wrapper').innerHTML = data.modules.map(module => `
            <div class="swiper-slide module">
                <div class="module-contents">
                    <div class="module-info">
                        <h2>${module.name}</h2>
                        <small>Description</small>
                        <p>${module.description}</p>
                    </div>
                    <div class="module-control">
                        <div class="module-checkbox">
                            
                        </div>
                    </div>
                </div>
                <div class="module-footer" id="${module.name}">
                    <div class="module-footer-arrow">

                    </div>
                    <div class="module-footer-info">
                        <p><span class="module-number-selected">No</span> images selected</p>
                    </div>
                    <div class="module-footer-arrow">
                        <img src="assets/images/icons/chevron-down.svg" alt="Šipka dole"/>
                    </div>
                </div>
            </div>`).join('')
        })
        .finally(() => {
            activateClickers();
            setCheckedImages();
        })
}

function setCheckedImages() {
    // count images within all modules and set the count of "checked" to ".module-number-selected"
    dataGlobal.modules.forEach(module => {
        const images = module.images;
        const checkedImages = images.filter(image => image.checked === true);
        const checkedImagesCount = checkedImages.length;
        document.querySelector(`#${module.name}`).closest('.module').querySelector('.module-number-selected').innerHTML = checkedImagesCount;

        // if all images are selected
        if (images.length === checkedImagesCount) {
            document.querySelector(`#${module.name}`).closest('.module').classList.add('selected');
            document.querySelector(`#${module.name}`).closest('.module').querySelector('.module-checkbox').innerHTML = '<img src="./assets/images/icons/check.svg" alt="Check"/>';
        } else if (checkedImagesCount !== 0) {
            document.querySelector(`#${module.name}`).closest('.module').classList.add('partially-selected');
            document.querySelector(`#${module.name}`).closest('.module').querySelector('.module-checkbox').innerHTML = '<img src="./assets/images/icons/minus.svg" alt="Partially selected"/>';
        } else {
            document.querySelector(`#${module.name}`).closest('.module').classList.remove('selected');
            document.querySelector(`#${module.name}`).closest('.module').classList.remove('partially-selected');
            document.querySelector(`#${module.name}`).closest('.module').querySelector('.module-checkbox').innerHTML = '';
        }
    })
    countAllImages();

}

// load modules on page load
fetchModules();

// on module footer click fetch images
document.querySelector('.modules').addEventListener('click', (e) => {

    if (e.target.closest('.module-footer')) {
        const moduleName = e.target.closest('.module-footer').id

        // remove selected class from all modules
        document.querySelectorAll('.module-footer').forEach(module => module.classList.remove('selected'))
        // toggle selected class
        e.target.closest('.module-footer').classList.toggle('selected')

        fetchImages(moduleName)
    }
})


function fetchImages(moduleName) {
    // from all modules find the one with the same name as the one clicked
    const module = dataGlobal.modules.find(module => module.name === moduleName)

    // get the images from the module
    const images = module.images

    // remove rotate class from all arrows
    $('.module-footer-arrow > img').removeClass('rotate')
    $('.module-footer').removeClass('selected')

    // rotate arrow in module footer
    $(`#${moduleName}`).find('.module-footer-arrow > img').toggleClass('rotate')

    if (moduleName === document.querySelector('.images > .swiper-wrapper').id) {
        document.querySelector('.images > .swiper-wrapper').innerHTML = '';
        document.querySelector('.images > .swiper-wrapper').id = '';
        $('.module-footer-arrow > img').removeClass('rotate')
        $(`#${moduleName}`).removeClass('selected')
        return;
    }

    document.querySelector('.images > .swiper-wrapper').id = moduleName
    $(`#${moduleName}`).addClass('selected')



    document.querySelector('.images > .swiper-wrapper').innerHTML = images.map(image => `
            <div class="swiper-slide image ${image.checked ? "selected" : ""}">
                <img src="assets/data${image.src}" alt="Obrázok"/>
            </div>`)

    // if parent module-checkbox is selected
    // add selected class to all images
    if (document.querySelector(`#${moduleName}`).closest('.module').querySelector('.module-checkbox').classList.contains('selected')) {
        document.querySelectorAll('.image').forEach(image => image.classList.add('selected'))
    }

    makeImagesClickable();
}

function makeImagesClickable() {
    $('.image').click(function () {
        $(this).toggleClass('selected')

        // Count selected images within the module
        const selectedImages = $(this).closest('.images').find('.image.selected')
        const selectedImagesCount = selectedImages.length

        // Get the module footer
        const moduleFooter = $('.module-footer.selected .module-number-selected')
        moduleFooter.html(selectedImagesCount)

        // update global data
        dataGlobal.modules.forEach(module => {
            if (module.name === $('.images > .swiper-wrapper').attr('id')) {
                module.images.forEach(image => {
                    if (image.src === $(this).find('img').attr('src').replace('assets/data', '')) {
                        image.checked = $(this).hasClass('selected')
                    }
                })
            }
        })

        // if all images are selected
        // select module-checkbox
        if (selectedImagesCount === $(this).closest('.images').find('.image').length) {
            $('.module-footer.selected').closest('.module').addClass('selected');
            $('.module-footer.selected').closest('.module').removeClass('partially-selected');
            $('.module-footer.selected').closest('.module').find('.module-checkbox').html('<img src="./assets/images/icons/check.svg" alt="Check"/>')
        } else if (selectedImagesCount !== 0) {
            $('.module-footer.selected').closest('.module').removeClass('selected');
            $('.module-footer.selected').closest('.module').addClass('partially-selected');
            $('.module-footer.selected').closest('.module').find('.module-checkbox').html('<img src="./assets/images/icons/minus.svg" alt="Partially selected"/>')
        } else {
            $('.module-footer.selected').closest('.module').removeClass('selected');
            $('.module-footer.selected').closest('.module').removeClass('partially-selected');
            $('.module-footer.selected').closest('.module').find('.module-checkbox').html('')
        }

        countAllImages();
    })
}

function countAllImages() {
    // Check if any image is selected by checking global data
    var allImages = dataGlobal.modules.map(module => module.images).flat()
    var checkedImages = allImages.filter(image => image.checked)
    var checkedImagesCount = checkedImages.length
    if (checkedImagesCount > 0) {
        $('#images-selected').text(checkedImagesCount)
        $('.btn-nav').addClass('positive')

    } else {
        $('#images-selected').text('No')
        $('.btn-nav').removeClass('positive')
    }
}

/*
// on image click toggle selected class
document.querySelector('.images').addEventListener('click', (e) => {
    if (e.target.closest('.image')) {
        e.target.closest('.image').classList.toggle('selected')
    }

    // Count selected images within the module
    const selectedImages = document.querySelectorAll('.image.selected')
    const selectedImagesCount = selectedImages.length

    // Get the module footer
    const moduleFooter = document.querySelector('.module-footer.selected .module-number-selected').innerHTML = selectedImagesCount
})
*/
function activateClickers() {
    $('.module-checkbox').click(function () {

        var nearestModule = $(this).closest('.module')
        var nearestModuleFooter = $(this).closest('.module').find('.module-footer')
        var id = nearestModuleFooter.attr('id')
        const moduleNumberSelected = $(this).closest('.module').find('.module-number-selected')

        // if module is selected
        if (nearestModule.hasClass('selected') || nearestModule.hasClass('partially-selected')) {
            // remove selected class from module
            nearestModule.removeClass('selected')
            nearestModule.removeClass('partially-selected')
            moduleNumberSelected.html('No')
            // remove check from module-checkbox
            $(this).html('')
            // remove selected class from all images

            if ($('.images > .swiper-wrapper').attr("id") === id) {
                $('.images').find('.image').removeClass('selected')

                // update global data
                dataGlobal.modules.forEach(module => {
                    if (module.name === id) {
                        module.images.forEach(image => {
                            image.checked = false;
                        })
                    }
                })
            } else {
                $(this).closest('.module').find('.images').find('.image').removeClass('selected')

                // update global data
                dataGlobal.modules.forEach(module => {
                    if (module.name === id) {
                        module.images.forEach(image => {
                            image.checked = false;
                        })
                    }
                })
            }
        } else {
            // add selected class to module
            nearestModule.addClass('selected')
            moduleNumberSelected.html('All')
            // add check to module-checkbox
            $(this).html('<img src="./assets/images/icons/check.svg" alt="Check"/>')
            // add selected class to all images
            if ($('.images > .swiper-wrapper').attr("id") === id) {
                $('.images').find('.image').addClass('selected')

                // update global data
                dataGlobal.modules.forEach(module => {
                    if (module.name === id) {
                        module.images.forEach(image => {
                            image.checked = true;
                        })
                    }
                })
            } else {
                $(this).closest('.module').find('.images').find('.image').addClass('selected')

                // update global data
                dataGlobal.modules.forEach(module => {
                    if (module.name === id) {
                        module.images.forEach(image => {
                            image.checked = true;
                        })
                    }
                })
            }
        }

        countAllImages();
    })
}

// save data to JSON file
$('.btn-nav').click(function (e) {
    saveData();
})


async function saveData() {

    console.log("Trying to save data")
    await fetch(`${URL}/save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataGlobal)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .then(() => {
            console.log("Data saved")
            window.location.href = "./aoi.html";
        })
        .catch(error => console.error(error));

}