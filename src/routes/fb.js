const express = require("express");
const passport = require("passport");
const { Token } = require("../helpers");

const router = express.Router();

router.get('/',
  passport.authenticate('facebook'));

router.get('/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
          res.redirect('http://localhost:5000/callback?access_token=' + Token.getToken({ _id: req.user._id}));
});

module.exports = router;
