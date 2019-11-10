const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'password',
        database: 'smart_brain'
    }
}) 

const app = express();

app.use(bodyParser.json());
app.use(cors())

// app.get('/', (req, res) => {
//     db.select('*').from('users').then(data => res.send(data));
// })

app.get('/', (req, res) => {
    res.send('its working');
});

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    db('login').where({email}).select('*').then(loginArray => {
        const loginInfo = loginArray[0];
        loginInfo
        ? bcrypt.compare(password, loginInfo.hash, function(err, data) {
            err || !data
            ? res.status(400).json('error logging in')
            : db('users').where({email}).select('*').then(userArray => res.json(userArray[0]));
        })
        : res.status(400).json('error logging in');
    })
})

const storeEmailAndHash = (email, password) => {
    bcrypt.hash(password, 10, function(err, hash) {
        db('login').insert({hash, email}).then(data => console.log('storeEmailAndHash', data));
    });
}

app.post('/register', (req, res) => {
    const {name, email, password} = req.body;

    storeEmailAndHash(email, password);

    db('users').insert({name, email, joined: new Date()}).then(idArray => {
        const id = idArray[0];
        console.log('inside register',id);
        db('users').where({id}).select('*').then(userArray => res.json(userArray[0]));
    })
})


app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db('users').where({id}).select('*').then(userArray => {
        const user = userArray[0];
        user ? res.send(user) : res.status(404).json("user not found");
    })
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where({id}).select('*').then(userArray => {
        const user = userArray[0];
        console.log({user});
        if(user) {
            db('users').where('id', user.id).update({entries: ++user.entries}).then(data => {
                db('users').where({id: user.id}).select('*').then(userArray => res.send(userArray[0]));
            })
        } else {
            res.status(404).json('no such user');
        }
    })
})

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
    console.log(`server started at port ${PORT}`);
});

console.log(PORT);