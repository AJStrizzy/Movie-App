require('dotenv').config();
const express = require('express');
const axios = require('axios');
const ejsLayouts = require('express-ejs-layouts')
const app = express();
app.use(express.static('public'))
const session = require('express-session');
const passport = require('./config/ppConfig');
const flash = require('connect-flash');
const SECRET_SESSION = process.env.SECRET_SESSION;
const db = require('./models')
const methodOverride = require('method-override')
const op = require('sequelize').Op

const isLoggedIn = require('./middleware/isLoggedIn');


app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(methodOverride('_method'))


const sessionObject = {
    secret: SECRET_SESSION,
    resave: false,
    saveUninitialized: true
  }
  app.use(session(sessionObject));
  // Initialize passport and run through middleware
  app.use(passport.initialize());
  app.use(passport.session());
  // Flash
  // Using flash throughout app to send temp messages to user
  app.use(flash());
  // Messages that will be accessible to every view
  app.use((req, res, next) => {
    // Before every route, we will attach a user to res.local
    res.locals.alerts = req.flash();
    res.locals.currentUser = req.user;
    next();
  });

  



app.get('/', (req, res) => {
    res.render('login', { alerts: res.locals.alerts, title: 'Movie Generator: Login', loggedIn: !!req.user})
})
app.get('/profile', (req, res) => {
  db.user.findAll({
        where: {
          id: req.user.id
          }
      }).then((userInfo) => {
    res.render('profile', { title: 'Movie Generator: profile', loggedIn: !!req.user, userInfo})
  })
})
app.get('/home', isLoggedIn, (req, res) => {
    res.render('home', { title: 'Movie Generator: Home', loggedIn: !!req.user})
})
app.get('/signup', (req, res) => {
    res.render('signup', { title: 'Movie Generator: Signup', loggedIn: !!req.user})
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
            res.render('movie', { title: 'Movie Generator: Movie Choice', movies: response.data.results, loggedIn: !!req.user })
        }).catch((err) => {
            console.log(err)
        })
})
app.get('/history', (req, res) => {
  db.review.findAll({
      where: {
        userId: req.user.id
      },
      include: [
        db.movie
      ]
    }).then((arrReview) => {
      res.render('history', { title: 'Movie Generator: Watch History', arrReview, loggedIn: !!req.user})
    })
  })

  app.post('/history', (req, res) => {
    db.movie.findOrCreate({
      where: {
        title: req.body.title,
        poster: req.body.poster
      }
    }).then(([movie, created]) => {
      db.review.findOrCreate({
        where: {
          userId: req.user.id,
          movieId: movie.id
        }
      }).then(()=> {
        res.redirect('/history')
      })   
    })    
  })


  app.post('/history/delete', (req, res) => {
    db.movie.destroy({
        where: {
          title: req.body.title,
        },
      }).then(() => {
        db.review.destroy({
          where: {
            movieId: req.body.id
          }
        })
        res.redirect('/history')
      })
    })

app.get('/review', (req, res) => {
  db.review.findAll({
    where: {
      userId: req.user.id,
      review: {[op.not]: null}
      },
      include: [
        db.movie
      ]
  }).then((reviewInfo) => {
    res.render('review', { title: 'Movie Generator: Movie Details', loggedIn: !!req.user, reviewInfo})
  })    
})

app.get('/reviewPage', (req, res) => {
  
  db.review.findAll({
    where: {
      userId: req.user.id,
      movieId: req.query.id
    },
    include: [
      db.movie
    ]
      }).then((reviewInfo) => {
  res.render('reviewPage', { title: 'Movie Generator: Movie Details', loggedIn: !!req.user, reviewInfo})
  }) 
}) 

app.put('/reviewPage', (req, res) => {
  db.review.findOne({
    where: {
      userId: req.body.user,
      movieId: req.body.movie
    },
  }).then((review)=> {
    review.review = req.body.review
    review.save().then((review) => {
      res.redirect('/review')
    })
  })
})

  
  



app.post('/signup', (req, res) => {
    db.user.findOrCreate({
      where: { email: req.body.email },
      defaults: {
        name: req.body.name,
        password: req.body.password
      }
    })
    .then(([user, created]) => {
      if (created) {
        // if created, success and redirect back to home
        // Flash Message
        const successObject = {
          successRedirect: '/',
          successFlash: 'Account created'
        }
        passport.authenticate('local', successObject)(req, res);
      } else {
        // Email already exists
        req.flash('error', 'Email already exists...')
        res.redirect('/signup');
      }
    })
    .catch(err => {
      req.flash('error', 'Either email or password is incorrect. Please try again.');
      res.redirect('/signup');
    })
  });

app.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/',
    successFlash: 'Welcome back',
    failureFlash: 'Either email or password is incorrect. Please try again.'
  }));

app.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Logged out, see you soon.');
    res.redirect('/');
  });
  
app.use((req, res) => {
    res.status(404).render('404', { title: '404 Error', loggedIn: !!req.user})
})




const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`You're vibing to the sounds on PORT ${PORT}`)
})