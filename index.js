const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('dev'));

app.get('/:city', (req, res) => {
    const city = req.params.city;
    switch (city) {
        case 'Bogota':
            res.send('Cundinamarca');
            break;
        case 'Cartagena':
            res.send('Bolivar');
            break;
        case 'Barranquilla':
            res.send('Atlantico');
            break;
        case 'Santa Marta':
            res.send('Magdalena');
            break;
        default:
            res.send(city);
            break;
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`App listening ${port}`)
});