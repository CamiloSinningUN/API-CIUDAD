const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const csv = require('csv-parser');

const results = [];
const cityToDepartment = new Map();

fs.createReadStream('Departamentos_y_municipios_de_Colombia.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        results.forEach((row) => {
            // put everything in lowercase and remove accents
            const city = row['MUNICIPIO'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const department = row['DEPARTAMENTO'].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            cityToDepartment.set(city, department);
        });
    });



app.use(cors());
app.use(morgan('dev'));

app.get('/:city', (req, res) => {
    const city = req.params.city;
    // convert city to lower case and remove accents
    const cityWithoutAccents = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const department = cityToDepartment.get(cityWithoutAccents);
    // send response
    res.send(department);

});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening ${port}`)
});