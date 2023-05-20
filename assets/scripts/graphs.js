let dataGlobal = null;
let participantsGlobal = null;


function showModules() {
    for (module of dataGlobal) {
        $('.graph-modules').append(
            `<div class="graph-module">
            <h4>${module.name}</h4>
            <p><span id="${module.name}-count">${module.images.length}</span> images</p>
            </div>`
        )
        $('#module-selection-1').append(`<option value="${module.name}">${module.name}</option>`);
        $('#module-selection-2').append(`<option value="${module.name}">${module.name}</option>`);
    }

    for (module of dataGlobal) {
        for (image of module.images) {
            $('#module-selection-1').append(`<option value="${image.src}">${image.src}</option>`);
            $('#module-selection-2').append(`<option value="${image.src}">${image.src}</option>`);
        }
    }

    $("#module-name").text(data[0].name);

    let firstModuleSelection = $('#module-selection-1').val();
    let secondModuleSelection = $('#module-selection-2').val();

    if (firstModuleSelection == secondModuleSelection) {
        // select second option in second selection
        $('#module-selection-2').val($(`#module-selection-2 option:nth-child(2)`).val());
    }


}

function showParticipants() {
    console.log(participantsGlobal)

    for (let i = 0; i < participantsGlobal.groups.length; i++) {
        $(`#participants-selection-1`).append(`
        <option value="${participantsGlobal.groups[i].name}">${participantsGlobal.groups[i].name}</option>`);
        $(`#participants-selection-2`).append(`
        <option value="${participantsGlobal.groups[i].name}">${participantsGlobal.groups[i].name}</option>`);
    }

    let firstParticipantSelection = $('#participants-selection-1').val();
    let secondParticipantSelection = $('#participants-selection-2').val();

    if (firstParticipantSelection == secondParticipantSelection) {
        // select second option in second selection
        //$('#participants-selection-2').val($(`#participants-selection-2 option:nth-child(2)`).val());
        rerenderChart(false);
    }
}

$(document).ready(function () {
    // load data
    fetchData();
})

$('#participants-selection-1').change(function () {
    let firstParticipantSelection = $('#participants-selection-1').val();
    let secondParticipantSelection = $('#participants-selection-2').val();

    if (firstParticipantSelection == secondParticipantSelection) {
        rerenderChart(false);
    } else {
        rerenderChart(true);
    }
})

$('#participants-selection-2').change(function () {
    let firstParticipantSelection = $('#participants-selection-1').val();
    let secondParticipantSelection = $('#participants-selection-2').val();

    if (firstParticipantSelection == secondParticipantSelection) {
        rerenderChart(false);
    } else {
        rerenderChart(true);
    }
})

async function fetchData() {
    await fetch('http://localhost:3000/loadChecked')
        .then((serverPromise) =>
            serverPromise.json()
                .then((j) => dataGlobal = j)
                .then(() => showModules())
                .catch((e) => console.log(e))
        )
        .catch((e) => console.log(e));
    await fetch('http://localhost:3000/loadParticipants')
        .then((serverPromise) =>
            serverPromise.json()
                .then((j) => participantsGlobal = j)
                .then(() => showParticipants())
                .catch((e) => console.log(e))
        )
        .catch((e) => console.log(e));
}

$('#y-axis-metric').change(function () {
    variableName = $(this).val();
    rerenderChart(true);
})

// CONTROL
$('.btn-nav.back').click(function () {
    window.location.href = "./recordings.html"
})

$('.btn-nav.positive').click(function () {
    alert('This scenario is over. \nThank you for participating!')
})