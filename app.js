require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'))

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
    const genres = {
        action: '28', adventure: '12', animation: '16', comedy: '35', crime: '80', documentary: '99',
        drama: '18', family: '10751', fantasy: '14', history: '36', horror: '27', mystery: '9648',
        romance: '10749', thriller: '53'
    }
    const searchTerm = req.query.name

    axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=1&with_genres=${genres[searchTerm]}`)
        .then((response) => {
            res.render('movie', { title: 'Movie Generator: Movie Choice', movies: response.data.results })
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