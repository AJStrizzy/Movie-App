require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts')
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs')
app.use(ejsLayouts)



app.get('/', (req, res) => {
    res.render('login', { title: 'Movie Generator: Login'})
})
app.get('/home', (req, res) => {
    res.render('home', { title: 'Movie Generator: Home'})
})
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Movie Generator: Signup'})
})
app.get('/movie', (req, res) => {
    
    const searchTerm = req.query.name;
    axios.get(
        `http://www.omdbapi.com/?s=${searchTerm}&apikey=${process.env.API_KEY}`)
        .then((response) => {
            res.render('movie', { title: 'Movie Generator: Movie Choice', movie: response.data })
        }).catch((err) => {
            console.log(err)
        })
})
app.get('/history', (req, res) => {
    res.render('history', { title: 'Movie Generator: Watch History'})
})
app.get('/details', (req, res) => {
    res.render('detail', { title: 'Movie Generator: Movie Details'})
})    

app.use((req, res) => {
    res.status(404).render('404', { title: '404 Error'})
})






app.listen(PORT, () => {
    console.log(`You're vibing to the sounds on PORT ${PORT}`)
})