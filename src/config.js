const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/project');

// check if db connected
connect.then(() => {
    console.log('Database connected');
})
.catch(() => {
    console.log('Database not connected');
});

// create schema
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//collection
const collection = new mongoose.model('users', loginSchema);

module.exports = collection;