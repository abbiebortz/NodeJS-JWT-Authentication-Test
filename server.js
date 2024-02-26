const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt'); 
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    next();
});

const PORT = 3000;
const secretkey = 'My super secret key';


const jwtMW = expressjwt({ 
    secret: secretkey,
    algorithms: ['HS256']
});


let users = [
    {
        id: 1,
        username: 'abbie',
        password: '123'
    },
    {
        id: 2,
        username: 'bortz',
        password: '456'
    }   
];


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
   
    for (let user of users) {
        if (username === user.username && password === user.password) {
            let token = jwt.sign({ username: user.username }, secretkey, { expiresIn: '3d' });
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        } 
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or password is incorrect'
            });
        }
    }
});


app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });
});

app.get('/api/prices', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'This is the price: $3.99'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialErr: err,
            err: 'Username or password is incorrect 2'
        });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        data: [
            "This is the settings"
        ]
    });
});

