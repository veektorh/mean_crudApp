const LocalStrategy = require('passport-local').Strategy;
const User = require('../contactApp/models/user');
const config = require('./credentials');
const bcrypt = require('bcryptjs');

module.exports = function (passport){
    passport.use(new LocalStrategy((username, password, done) => {
        
        let query = {username : username};

        User.findOne(query,(err,user) => {
            if (err){
                console.log(err);
                return;
            }

            if(!user){
                return done(null,false,{ message : 'No user found'});
            }

            bcrypt.compare(password,user.password, (err, isMatch) => {
                if(err) {
                    console.log(err)
                    return done(null,false, { message : 'An error occured from bcrypt'});;
                }
                
                if(!isMatch){
                    return done(null,false, { message : 'invalid password'});
                }

                return done(null, user )
            })
        })

        

    }))

    passport.serializeUser((user , done ) => {
        done(null, user.id)
    });

    passport.deserializeUser((id,done) => {
        User.findById(id, (err,user) => {
            done(err,user);
        })
    });
}