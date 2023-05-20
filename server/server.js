// include fs
var fs = require('fs');
var express = require('express');
const bodyParser = require('body-parser');


// create a new express server
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// disable CORS 
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


let counter = 0;

// open endpoint "save" to save a data.json file
app.post('/save', function (req, res) {
    // log body of request

    fs.writeFile('./assets/data/data.json', JSON.stringify(req.body), function (err) {
        if (err) {
            res.send(JSON.stringify({ status: 500, error: err, response: null }));
            console.log("Error: " + err)
        } else {
            res.send(JSON.stringify({ status: 200, error: null, response: "Data saved" }));
            console.log("Modules data saved");
        }
    });
});

// open endpoint "load" to load a data.json file
app.get('/load', function (req, res) {
    // load the data.json file
    fs.readFile('./assets/data/data.json', function (err, data) {
        if (err) {
            res.send('error');
            console.log("Error: " + err)
        } else {
            res.send(data);
            console.log("Modules data sent");
        }
    });
});

// open endpoint "load" to load a data.json file but modules that contains images that are checked
app.get('/loadChecked', function (req, res) {
    // load the data.json file
    fs.readFile('./assets/data/data.json', function (err, data) {
        if (err) {
            res.send('error');
            console.log("Error: " + err)
        } else {
            data = JSON.parse(data);
            filteredData = [];
            // for each module
            for (var i = 0; i < data.modules.length; i++) {
                // if module contains at least one image that is checked, add it to the filteredData array
                if (data.modules[i].images.some(image => image.checked)) {
                    filteredData.push(data.modules[i]);
                }
            }

            // remove images that are not checked
            for (var i = 0; i < filteredData.length; i++) {
                filteredData[i].images = filteredData[i].images.filter(image => image.checked);
            }
            filteredData = JSON.stringify(filteredData);
            res.send(filteredData);
        }
    });
});

app.get('/loadParticipants', function (req, res) {
    // load the participants.json file
    fs.readFile('./assets/data/participants.json', function (err, data) {
        if (err) {
            res.send('error');
            console.log("Error: " + err)
        } else {
            res.send(data);
            console.log("Participants sent");
        }
    });
});

app.post('/saveParticipants', function (req, res) {
    // log body of request

    fs.writeFile('./assets/data/participants.json', JSON.stringify(req.body), function (err) {
        if (err) {
            res.send(JSON.stringify({ status: 500, error: err, response: null }));
            console.log("Error: " + err)
        } else {
            res.send(JSON.stringify({ status: 200, error: null, response: "Data saved" }));
            console.log("Participants saved");
        }
    });
});


app.post('/saveAOI', function (req, res) {

    let dataNew = req.body;
    console.log(dataNew)

    // load the data.json file
    fs.readFile('./assets/data/data.json', function (err, data) {
        // find the module by module name

        data = JSON.parse(data);
        let imagesUpdated = 0;

        console.log("data: ", data)


        // right join data and dataNew
        for (var i = 0; i < data.modules.length; i++) {
            for (var j = 0; j < dataNew.length; j++) {
                if (data.modules[i].name == dataNew[j].name) {
                    for (var k = 0; k < dataNew[j].images.length; k++) {
                        for (var l = 0; l < data.modules[i].images.length; l++) {
                            if (dataNew[j].images[k].src == data.modules[i].images[l].src) {
                                data.modules[i].images[l].aoi = dataNew[j].images[k].aoi;
                                imagesUpdated += 1;
                                console.log("image updated: ", dataNew[j].images[k].src)
                            }
                        }
                    }
                }
            }
        }

        // save the data.json file
        fs.writeFile('./assets/data/data.json', JSON.stringify(data), function (err) {
            if (err) {
                res.send(JSON.stringify({ status: 500, error: err, response: null }));
                console.log("Error: " + err)
            } else {
                res.send(JSON.stringify({ status: 200, error: null, response: "Data saved" }));
                console.log("AOI data saved: ", counter, " images updated: ", imagesUpdated);
                counter += 1;
            }
        });
    });
});


// start the server
app.listen(3000, function () {
    // find the server url
    var host = this.address().address;
    var port = this.address().port;
    console.log(`Server listening on ${host}:${port}`);
});
