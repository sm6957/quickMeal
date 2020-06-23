const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');
const User = mongoose.model('User');
function initialize(passport, getUserByEmail, getUserById) {
            async function getInfo(email) {
    await User.find({}, function(err, val) {
      
        let t = val.map(t => t.email === email)
        for(let i = 0; i < t.length; i++){
            if(t[i]){
              
             // console.log(val[i])
                return val[i]
            }
        }
        return undefined;
   
    })
  }
  const authenticateUser = async (email, password, done) => {
    const a = await getInfo(email)
    const user = getUserByEmail(email)
    //console.log(a)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }

    try {

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize