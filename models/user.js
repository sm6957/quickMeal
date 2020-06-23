var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email:String,
    username:String,
    password:String,
    university: String,
    mealPlanInfo:{   
        mealPlanFall: 
        { planName: String, 
          mealPerSemester: Number, 
          diningDollars: Number,
          numberOfMealsDistributed:Number
        },
    mealPlanSpring: 
        { planName: String, 
            mealPerSemester: Number, 
            diningDollars: Number,
            numberOfMealsDistributed:Number 
        },
        campusCash:Number
    },
    ExchangeData: {
    donation: Number}

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);

