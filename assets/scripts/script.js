// fetch data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        console.log(data)
    });
