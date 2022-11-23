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
            // console.log(city, department);
            cityToDepartment.set(city, department);
        });
    });



app.use(cors());
app.use(morgan('dev'));

app.get('/:city', (req, res) => {
    const city = req.params.city;
    // convert city to lower case and remove accents
    const cityWithoutAccents = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    switch (cityWithoutAccents) {
        case 'bogota':
            res.send('Cundinamarca');
            break;
        case 'cartagena':
            res.send('Bolivar');
            break;
        case 'barranquilla':
            res.send('Atlantico');
            break;
        case 'santa Marta':
            res.send('Magdalena');
            break;
        default:
            const department = cityToDepartment.get(cityWithoutAccents) || city;
            // put first letter in uppercase
            console.log(department);
            const departmentWithUppercase = department.charAt(0).toUpperCase() + department.slice(1);

            // send response
            res.send(departmentWithUppercase);

            break;
    }



});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening ${port}`)
});