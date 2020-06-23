var express                 = require("express"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    bodyParser              = require("body-parser"),
    User                    = require("./models/user"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose")
    
var app = express();
let currUserEmail = ""
let meal = 0
let diningDollars = 0
let cc = 0
mongoose.connect("mongodb://localhost/auth_demo_app");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(require("express-session")({
    secret:"secret",
    resave: false,
    saveUninitialized: false
}));
app.set('view engine','ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/",function(req,res){
    res.render("login");
});

app.post('/quickMeal', (req, res) => {
    if(req.body.send_type_donate !== null ||req.body.send_type_donate !== undefined) {
      if(req.body.mealtype === "dining-dollars"){
          donationPool(currUserEmail,req.body.amount, "dd")
      }else {
        donationPool(currUserEmail,req.body.amount, "mealSwipes")
      }
    }
    else if(req.body.send_type_send !== null ||req.body.send_type_send !== undefined) {
        if(req.body.mealtype === "dining-dollars"){
            directSend(req.body.yemail, req.body.email,req.body.amount, "dd")
        }else {
            directSend(req.body.yemail, req.body.email,req.body.amount,"mealSwipes")
        }
    }
    res.redirect('/quickMeal')
  })

app.get("/quickMeal",isLoggedIn, function(req, res) {
    res.render("quickMeal", {meal,diningDollars, cc});
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res) {
    let mealSize = 0
    let dd = 0
let fallMealPlanName =  req.body.fallMealName
let springMealPlanName = req.body.springMealName
let term = currentSemester()
if(currentSemester == "Fall"){
    if(fallMealPlanName === "300-flex-plus") {
        mealSize = 300;
        dd = 250
      }else if(fallMealPlanName === "300-flex") {
        mealSize = 300;
        dd = 150
      } else if(fallMealPlanName === "225-flex-plus") {
        mealSize = 225;
        dd = 300
      } else if(fallMealPlanName === "225-flex") {
        mealSize = 225;
        dd = 200
      }
      meal = mealSize;
      diningDollars = dd;
      if(req.body.campusCash === null ||req.body.campusCash === undefined){
          cc = 0;
      }else{
          cc = req.body.campusCash
      }

} else {
    if(springMealPlanName === "300-flex-plus") {
        mealSize = 300;
        dd = 250
      }else if(springMealPlanName === "300-flex") {
        mealSize = 300;
        dd = 150
      } else if(springMealPlanName === "225-flex-plus") {
        mealSize = 225;
        dd = 300
      } else if(springMealPlanName === "225-flex") {
        mealSize = 225;
        dd = 200
      }
      meal = mealSize;
      diningDollars = dd;
      if(req.body.campusCash === null ||req.body.campusCash === undefined){
          cc = 0;
      }else{
          cc = req.body.campusCash
      }
}
 
User.register(new User({
    username:req.body.username, 
    university: req.body.university,
    lastName: req.body.lname, 
    firstName: req.body.fname,
    email: req.body.email,
    campusCash: req.body.campusCash,
    "mealPlanInfo.mealPlanFall.planName": fallMealPlanName,
    "mealPlanInfo.mealPlanFall.mealPerSemester": mealSize,
    "mealPlanInfo.mealPlanFall.diningDollars": dd,
    "mealPlanInfo.mealPlanFall.numberOfMealsDistributed":0,
    "mealPlanInfo.mealPlanSpring.planName": springMealPlanName,
    "mealPlanInfo.mealPlanSpring.mealPerSemester": mealSize,
    "mealPlanInfo.mealPlanSpring.diningDollars": dd,
    "mealPlanInfo.mealPlanSpring.numberOfMealsDistributed":0  
}),req.body.password, function(err, user){
       if(err){
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate("local")(req, res, function(){
            res.redirect("/quickMeal"); 
       }); 
    });
});

app.get("/login", function(req, res){
    res.render("login");
})

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    let user = req.body.username
    findUser(user)
    res.redirect("/quickMeal");
  });

app.get("/logout", function(req, res){
    findUser(req.body.username)
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

let findUser = function takeAway(user) {
    let term = currentSemester()
    User.find({}, function(err, val) {
       let t = val.map(t => t.username === user)
       for(let i = 0; i < t.length; i++){
           if(t[i]){
            currUserEmail = val[i].email
               if(term === "Fall"){
                meal = val[i].mealPlanInfo.mealPlanFall.mealPerSemester
                diningDollars = val[i].mealPlanInfo.mealPlanFall.diningDollars
                if(val[i].mealPlanInfo.campusCash === null || val[i].mealPlanInfo.campusCash === undefined){
                    cc = 0;
                }else{
                    cc = val[i].mealPlanInfo.campusCash
                }
                
               } else {
                meal = val[i].mealPlanInfo.mealPlanSpring.mealPerSemester
                diningDollars = val[i].mealPlanInfo.mealPlanSpring.diningDollars
                if(val[i].mealPlanInfo.campusCash === null || val[i].mealPlanInfo.campusCash === undefined){
                    cc = 0;
                }else{
                    cc = val[i].mealPlanInfo.campusCash
                }
               }
               return val[i];
           }
       }
       return undefined;
   })
  }

let giver = function takeAway(giverEmail, amount, type) {
User.find({}, function(err, val) {
    let term = currentSemester()
    let t = val.map(t => t.email === giverEmail)
    for(let i = 0; i < t.length; i++){
        if(t[i]){
            let new_giverMealSize = 0;
            let new_giverDD = 0
            if(term === "Fall"){
                if(type === "dd") {
                let giverCurrentDD = val[i].mealPlanInfo.mealPlanFall.diningDollars;
                new_giverDD = giverCurrentDD - amount;
                giverCurrentDD = val[i].mealPlanInfo.mealPlanFall.diningDollars;
                new_giverDD = giverCurrentDD - amount;
                dd = new_giverDD
                totalLeft = new_giverDD;
                diningDollars = new_giverDD;
                let myquery = { email: giverEmail }
                let newvalues = { $set: { "mealPlanInfo.mealPlanFall.diningDollars": new_giverDD }}
                User.updateOne(myquery, newvalues, function(err, res) {
                })
                }else{
                    let giverCurrentMealSize = val[i].mealPlanInfo.mealPlanFall.mealPerSemester;
                    new_giverMealSize = giverCurrentMealSize - amount;
                    meal = new_giverMealSize
                    dd = new_giverDD
                    let totalLeft = new_giverMealSize;
                    let myquery = { email: giverEmail }
                    let newvalues = { $set: { "mealPlanInfo.mealPlanFall.mealPerSemester": new_giverMealSize }}
                    User.updateOne(myquery, newvalues, function(err, res) { 
                    })
                }
                
            }else {
                if(type === "dd"){
                    let giverCurrentDD = val[i].mealPlanInfo.mealPlanSpring.diningDollars;
                    new_giverDD = giverCurrentDD - amount;
                    dd = new_giverDD
                    let totalLeft = new_giverDD;
                    diningDollars = new_giverDD;

                    let myquery = { email: giverEmail }
                    let newvalues = { $set: { "mealPlanInfo.mealPlanSpring.diningDollars": new_giverDD }}
                    User.updateOne(myquery, newvalues, function(err, res) {
                    
                    })
                }else{
                    let giverCurrentMealSize = val[i].mealPlanInfo.mealPlanSpring.mealPerSemester;
                    new_giverMealSize = giverCurrentMealSize - amount;
                    meal = new_giverMealSize
                    dd = new_giverDD
                    totalLeft = new_giverMealSize;
                let myquery = { email: giverEmail }
                let newvalues = { $set: { "mealPlanInfo.mealPlanSpring.mealPerSemester": new_giverMealSize }}
                User.updateOne(myquery, newvalues, function(err, res) {
                    
                })
                }
            
            }
        
        }
    }
    return undefined;
})
}

let currentSemester = function term(){
let today = new Date();
let month = today.getMonth()
let term = ""
if(month >= 2 && month <= 5) {
    term = "Spring"
}else {
    term = "Fall"
}
return term;
}
  
let reciever = function giveTo(email, amount,type) {
User.find({}, function(err, val) {
    let term = currentSemester()
    let new_MealSize = 0
    let t = val.map(t => t.email === email)
    for(let i = 0; i < t.length; i++){
        if(t[i]){
            if(term === "Fall") {
                if(type === "dd") {
                let currentdd = val[i].mealPlanInfo.mealPlanFall.diningDollars;
                let new_dd = parseInt(currentdd) + parseInt(amount);
                
                let myquery = { email: email }
                let newvalues = { $set: { "mealPlanInfo.mealPlanFall.diningDollars": parseInt(new_dd) }}
                User.updateOne(myquery, newvalues, function(err, res) {
                    console.log('done')
                    console.log(err)
                })

                }else{
                let currentMealSize = val[i].mealPlanInfo.mealPlanFall.mealPerSemester;
                new_MealSize = parseInt(currentMealSize) + parseInt(amount);
                let myquery = { email: email }
                let newvalues = { $set: { "mealPlanInfo.mealPlanSpring.mealPerSemester": parseInt(new_MealSize) }}
                User.updateOne(myquery, newvalues, function(err, res) {
                    console.log('done')
                    console.log(err)
                })
            }
            }else {
                if(type === "dd"){
                let currentdd = val[i].mealPlanInfo.mealPlanFall.diningDollars;
                let new_dd = parseInt(currentdd) + parseInt(amount);
                let myquery = { email: email }
                let newvalues = { $set: { "mealPlanInfo.mealPlanFall.diningDollars": parseInt(new_dd) }}
                User.updateOne(myquery, newvalues, function(err, res) {
                    console.log('done')
                    console.log(err)
                })

                } else { 
            let currentMealSize = val[i].mealPlanInfo.mealPlanSpring.mealPerSemester;
            new_MealSize = parseInt(currentMealSize) + parseInt(amount);
            let myquery = { email: email }
            let newvalues = { $set: { "mealPlanInfo.mealPlanSpring.mealPerSemester": parseInt(new_MealSize) }}
            User.updateOne(myquery, newvalues, function(err, res) {
                console.log('done')
                console.log(err)
            })
        }
            }
        
        }
    }
    return undefined;

})
}
  
let donationPool = function dpool(email, amount, type) {
User.find({}, function(err, val) {
    
    let t = val.map(t => t.email === email)
    for(let i = 0; i < t.length; i++){
        if(t[i]){
            let currentTotalDonation = parseInt(val[i].ExchangeData.donation);
            let increaseTotalDonation = amount+ currentTotalDonation;
            giver(email, amount,type)
        let myquery = { email: email }
        let newvalues = { $set: { "ExchangeData.donation": parseInt(increaseTotalDonation) }}
        User.updateOne(myquery, newvalues, function(err, res) {
            console.log('done')
            console.log(err)
        })

        }
    }
    return undefined;

})
}

let directSend = function donater(giverEmail, recieverEmail, amount,type) {  
giver(giverEmail,amount,type)
reciever(recieverEmail,amount, type)
}
app.listen(process.env.PORT || 3000)