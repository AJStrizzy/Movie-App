module.exports = (req, res, next) => {
    if (!req.user) {
        req.flash('error', 'You must be signed in to access page');
        res.redirect('/login');
    } else {
        next();
    }
}