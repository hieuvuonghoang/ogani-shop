const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');

const PORT = 3000;

const api = require('./routes/api');
const file_api = require('./routes/file_api');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', api);
app.use('/file', file_api);

app.get('/', (req, res) => {
    res.send('Hello from server')
});

app.listen(PORT, function() {
    console.log('Server running on localhost: ' + PORT)
});