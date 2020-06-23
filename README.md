QuickMeal

# QuickMeal

## Overview

The inability to pay for meal plans and on-campus dining services or have time to consistently cook can oftentimes pressure students into pursuing unhealthy, less expensive eating options, or worse, not eating at all. Food insecurity has become an increasingly greater issue as the cost of living and tuition steadily increase. 

QuickMeal is a web app that will allow users to send and recieve meal swipes that will go directly to students' accounts or to a general donation pool. Once students create an account with their university credentials and logged in, they can view their current meal plan, and send/request meal swipes to one student or to a general donation pool.


## Data Model

The application will store user's personal info (first and last name and, university ID number, password), meal plan, university name, and number of meals in the current donation pool


An Example User:

```javascript
{
  userFirstName: "Selamawit",
  userLastName: "Moges",
  userID: "sm6957",
  hash: "#####", // a password hash,
   
```

An Example User Meal Plan:

```javascript
{
  // a reference to a User object
  userID:"sm6957", 
  mealPlan: 
    { mealPlanName: "300 Flex Plus", 
    mealPerSemester: 300, 
    diningDollars: 250,
    numberOfMealsDistributed: 0 //number of meals swipes sent to other students accounts
    },
    mealRequests:["sd2314","lr4657"] // an array holding the ID's of users that are requesting meals
   
}
```

## [Link to Commented First Draft Schema](db.js) 

https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/db.js

## Wireframes

/login - page logging into your account

![login](https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/pngFiles/webApp_Login.png)

/register - registration page for new users

![register](https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/pngFiles/webApp_Register.png)

/quickMeal - landing page for web app

![landing page](https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/pngFiles/Landing_UserPage.png)
![landing page when user A has a meal request from user B](https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/pngFiles/OtherUser.png)

## Site map

Here's [QuickMeal's site map](https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/QuickMeal%20SiteMap.jpg), but you can create one without the screenshots, drop shadows, etc. ... just names of pages and where they flow to.

## User Stories or Use Cases

User Story:
1. As a non-registered user, I can register a new account with the site
2. As a user I can log in to the site
3. As a user I can send, request, or donate meal swipes/dining dollars/campus cash to other registered users 
4. As a user I can see pending requests by expanding the hamburger icon 
5. As a user I can accept/reject pending requests
5. As a user I can view my current account balance


## [Link to Initial Main Project File](app.js) 
https://github.com/nyu-csci-ua-0480-008-spring-2020/sm6957-final-project/blob/master/app.js

## Annotations / References Used

1. [tutorial on how to create a registration page](https://www.youtube.com/watch?v=CrAU8xTHy4M)
2. [tutorial on how to create a login page](https://www.youtube.com/watch?v=mAOxWf36YLo)

