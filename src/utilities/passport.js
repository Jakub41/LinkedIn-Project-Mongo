const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const FbStrategy = require("passport-facebook-token");
const FacebookStrategy = require("passport-facebook").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("../models");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { Config } = require("../config");

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.jwt.secret
};

passport.use(
    new FacebookStrategy(
        {
            clientID: Config.fb.id,
            clientSecret: Config.fb.secret,
            callbackURL: Config.fb.callBack
        },
        async (accessToken, refreshToken, facebookProfile, next) => {
            try {
                const userFromFacebookId = await User.findOne({
                    facebookId: facebookProfile.id
                });
                if (userFromFacebookId) return next(null, userFromFacebookId);
                else {
                    const newUser = await User.create({
                        facebookId: facebookProfile.id,
                        email: facebookProfile.emails[0].value,
                        refreshToken: refreshToken
                    });
                    return next(null, newUser);
                }
            } catch (err) {
                return next(err);
            }
        }
    )
);
