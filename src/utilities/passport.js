const passport = require("passport");
const facebookTokenStrategy = require("passport-facebook-token");
const { User } = require("../models");
const { Config } = require("../config");

module.exports = () => {
    passport.use(
        "facebookToken",
        new facebookTokenStrategy(
            {
                clientID: Config.fb.id,
                clientSecret: Config.fb.secret
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const existingUser = await User.findOne({
                        "facebook.id": profile.id
                    });

                    if (existingUser) {
                        return done(null, existingUser);
                    }

                    const newUser = new User({
                        method: "facebook",
                        facebook: {
                            id: profile.id,
                            email: profile.emails[0].value,
                            token: accessToken
                        }
                    });

                    await newUser.save();
                    done(null, newUser);
                } catch (error) {
                    done(error, false);
                }
            }
        )
    );
};
