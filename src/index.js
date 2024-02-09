const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express()

// convert data into json 
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// EJS as view engine
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// register user
app.post('/signup', async (req, res) => {

    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // check if user already exists
    const existingUser = await collection.findOne({name: data.name});
    if (existingUser) {
        res.send("User already exists. Please choose a different username.")
    } else {
        // hash passsword, insert into db
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }
})

// login user
app.post('/login', async (req, res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check) {
            res.send('Username does not exist');
        }
        
        const passwordCorrect = await bcrypt.compare(req.body.password, check.password);
        if(passwordCorrect) {
            res.render("home");
        }else {
            res.send("Incorrect password");
        } 
    }catch (error){
        console.log(error);
        res.send('wrong details');
    }
});


// starts a server, listens on port 5000 for connections
const port = 5000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});