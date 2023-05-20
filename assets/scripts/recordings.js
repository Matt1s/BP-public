
// randomize "time" values
var dataGlobal = [];

function showGroups(index) {
    console.log('showing groups')
    var data = dataGlobal
    console.log(data)
    for (group of data.groups) {
        // count selected recordings
        var selected = group.recordings.filter(recording => recording.checked == "true").length;
        var selectedClasses = "";
        var moduleCheckboxImage = "";
        if (selected == group.recordings.length) {
            selectedClasses = "selected";
            moduleCheckboxImage = `<img src="./assets/images/icons/check.svg" alt="alt">`;
        } else if (selected > 0) {
            selectedClasses = "partially-selected";
            moduleCheckboxImage = `<img src="./assets/images/icons/minus.svg" alt="alt">`;
        }
        $('.recordings-holder').append(
            `<div class="recording-group ${selectedClasses}">
            <h3>${group.name}</h3>
            <small><span id="${group.name}-all-count">${group.recordings.length}</span>&nbsp;recordings</small>
            <small><span id="${group.name}-selected-count">${selected}</span>&nbsp;recordings selected</small>
            <div class="module-control">
                <div class="module-checkbox">
                    ${moduleCheckboxImage}
                </div>
            </div>
        </div>`);
    }
    $('#selecting-group').text(data.groups[0].name)
    showRecordings(index)
    activateClickers()
}

function activateClickers() {
    // activate group clicker
    $('.recording-group').click(function () {
        $('.recordings').empty()
        // get index of clicked group but not -1
        var index = dataGlobal.groups.findIndex(group => group.name == $(this).children('h3').text())
        showRecordings(index)
        console.log('showing recordings of group ' + index)
        $('#selecting-group').text(dataGlobal.groups[index].name)
    })

    $('.recording-group .module-checkbox').click(function (e) {
        e.stopPropagation();
        var index = dataGlobal.groups.findIndex(group => group.name == $(this).parent().parent().children('h3').text())
        console.log('clicked group ' + $(this).parent().parent().children('h3').text())
        if ($(this).parent().parent().hasClass('selected')) {
            $(this).parent().parent().removeClass('selected')
            $(this).empty()
            updateGlobalData(index, "false")
        } else if ($(this).parent().parent().hasClass('partially-selected')) {
            $(this).parent().parent().removeClass('partially-selected')
            $(this).empty()
            updateGlobalData(index, "false")
        } else {
            $(this).parent().parent().addClass('selected')
            $(this).html(`<img src="./assets/images/icons/check.svg" alt="alt">`)
            updateGlobalData(index, "true")
        }
    })
}

function updateGlobalData(index, value) {
    console.log('updating global data', index, value)
    console.log(dataGlobal.groups)
    console.log(dataGlobal.groups[index])
    for (recording of dataGlobal.groups[index].recordings) {
        recording.checked = value
    }
    var selected = dataGlobal.groups[index].recordings.filter(recording => recording.checked == "true").length;
    $(`#${dataGlobal.groups[index].name}-selected-count`).text(selected)
    if (selected == dataGlobal.groups[index].recordings.length) {
        $(`#${dataGlobal.groups[index].name}-all-count`).text(selected)
    } else {
        $(`#${dataGlobal.groups[index].name}-all-count`).text(dataGlobal.groups[index].recordings.length)
    }

    if ($('#selecting-group').text() == dataGlobal.groups[index].name) {
        showRecordings(index)
    }
}

function showRecordings(index) {
    // show first group of recordings
    console.log(index)
    $('.recordings').empty()
    for (recording of dataGlobal.groups[index].recordings) {
        if (recording.checked == "true") {
            $('.recordings').append(`
                <div class="recording selected">
                    <p>${recording.name}</p>
                    <small>${recording.time}</small>
                    <div class="module-control">
                        <div class="module-checkbox">
                            <img src="./assets/images/icons/check.svg" alt="alt">
                        </div>
                        </div>
                    </div>
                </div>`
            )
        } else {
            $('.recordings').append(`
                <div class="recording">
                    <p>${recording.name}</p>
                    <small>${recording.time}</small>
                    <div class="module-control">
                        <div class="module-checkbox">
                        </div>
                        </div>
                    </div>
                </div>`
            )
        }
    }
    activateClickersRecordings()
}

function activateClickersRecordings() {
    $('.recording').click(function () {
        var difference = 0
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected')
            $(this).find('.module-checkbox').empty()
            difference--
        } else {
            $(this).addClass('selected')
            $(this).find('.module-checkbox').html(`<img src="./assets/images/icons/check.svg" alt="alt">`)
            difference++
        }
        var moduleName = $('#selecting-group').text()
        var currentCount = parseInt($(`#${moduleName}-selected-count`).text())
        console.log(currentCount, difference)
        $(`#${moduleName}-selected-count`).text(currentCount + difference);

        if (currentCount + difference == 0) {
            // remove selected class from group
            $('.recordings-holder').children(`.recording-group:contains(${moduleName})`).removeClass('selected partially-selected')
            $('.recordings-holder').children(`.recording-group:contains(${moduleName})`).find('.module-checkbox').empty()
        } else if (currentCount + difference == $(`#${moduleName}-all-count`).text()) {
            // add selected class to group
            $('.recordings-holder').children(`.recording-group:contains(${moduleName})`).addClass('selected')
            $('.recordings-holder').children(`.recording-group:contains(${moduleName})`).find('.module-checkbox').html(`<img src="./assets/images/icons/check.svg" alt="alt">`)
        } else {
            // add partially-selected class to group
            $('.recordings-holder').children(`.recording-group:contains(${moduleName})`).addClass('partially-selected')
            $('.recordings-holder').children(`.recording-group:contains(${moduleName})`).find('.module-checkbox').html(`<img src="./assets/images/icons/minus.svg" alt="alt">`)
        }

        // update global data
        var index = dataGlobal.groups.findIndex(group => group.name == moduleName)
        // get index of clicked recording
        var recordingIndex = dataGlobal.groups[index].recordings.findIndex(recording => recording.name == $(this).children('p').text())
        if ($(this).hasClass('selected')) {
            dataGlobal.groups[index].recordings[recordingIndex].checked = "true"
        } else {
            dataGlobal.groups[index].recordings[recordingIndex].checked = "false"
        }
    })

}



$('.btn-nav.back').click(function () {
    window.location.href = "./aoi.html"
})

$('.btn-nav.positive').click(function () {
    saveData()
    console.log(dataGlobal)
    window.location.href = "./graphs.html"
})

function saveData() {
    console.log('saving data')
    console.log(dataGlobal)
    fetch('http://localhost:3000/saveParticipants', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataGlobal),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

async function fetchData() {
    await fetch('http://localhost:3000/loadParticipants')
        .then((serverPromise) =>
            serverPromise.json()
                .then((j) => dataGlobal = j)
                .then(() => showGroups([0]))
                .catch((e) => console.log(e))
        )
        .catch((e) => console.log(e));
}


$(document).ready(function () {
    fetchData()
});