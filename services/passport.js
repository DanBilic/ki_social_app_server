const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const conf = require("../config/config");
const mongoose = require("mongoose");
const User = mongoose.model("User");

//user is the user from the GoogleStrategy constructor callback (from line 19)
//serializeUser generates an identifying piece of information for the user and sets it in the cookies of the response
passport.serializeUser((user, done) => {
  //user.id is the _id in the mongo user collection
  done(null, user.id);
});

//take id from cookie and turn it into a user record
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);

  //after calling done(error, user) user is added to req.user in the middleware flow of the app
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENTSECRET,
      // callbackURL: "/auth/google/callback",
      callbackURL: "/api/v1/auth/google/callback",
      proxy: true, // for the deployment -> trust proxies
    },
    //diese Funktion wird bei erfolgreichem anmelden durch contoller funktion passport.authenticate("google") des Endpunktes: "/auth/google/callback" aufgerufen
    async (accesssToken, refreshToken, profile, done) => {
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // we have a user with the given google id

        //calling done(error, user) resumes the auth process with passport
        done(null, existingUser);
      } else {
        //we dont have a user with the given user id
        const newUser = await new User({ googleId: profile.id }).save();
        done(null, newUser);
      }
    }
  )
);
