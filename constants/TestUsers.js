

const USER = {
    recentActivity: [], // From seperate collection, Activity, received from server
    jsonWebToken: null,

    _id: "1", // local user device id. uniqueId, but if 1 then beta user
    dbId: null, // if null, tell user to log in 
    username: "User1",
    usernameDecoration: {
      prefixColor: "red",
      prefix: "",
      description: "",
    },
    name: 'Test Name',
    email: '',
    dateJoined: null,
    rank: 'user',
    premium: false,
    friendRequests: [],// [{...userInfo, read: false}]
    friendsAdded: [], // [userInfo, userInfo]
    friends: [], // [friend, friend] -> certain info specified from server. Just ids in db
    subscriptions: [],
    profileImg: {},
    trouble: {bans: [], warnings: [], frozen: false}, //
    googleId: null,
    appleId: null,
    facebookId: null,
    extraDetails: {
      ai: {
          image: {
              used: 0,
              credits: 10,
              lastReset: Date.now(),
          },
          foodText: {
              used: 0,
              credits: 30,
              lastReset: Date.now(),
          }
      },
      preferences: {
        heightUnit: "feet", // feet, cm
        liftUnit: "imperial", // metric, imperial
        distanceUnit: "imperial", // metric, imperial

        // Theme
        systemTheme: "dark", // light, dark, system

        // Workouts
        restTimerAmount: 120, // seconds. 0 counts up 

        // Sharing
        workouts: true,
        // .......
      },
    },

    premiumSubscription: {
      service: "stripe", // stripe, apple, google
      
      stripe: {
        customerId: "",
        subscriptionId: "",
      },

      apple: {

      },
      google: {

      }
    },
    
    // End necessary info from database
    
    streak: {
      longestStreak: 0,
      currentStreak: 0,
      achievementAmount: 0,
    },
    settings: {
      preferences: { // MOVED TO extraDetails
        heightUnit: "feet", // feet, cm
        liftUnit: "lbs" // lbs, kgs
      },
      height: null, // in centimeters
      birthday: null, // Date.now()
      gender: null, // male, female, other.
    },
    
    newSchedule: {}, // YET TO DO
    schedule: {
      currentIndex: 0,
      rotation: [
        //"234" // Id of workout 1, 0's are rest days
      ],
    },
    
    archivedExercises: {}, // {exerciseId: true, exerciseId: false, ...},
    createdExercises: [],
  //   [{
  //     name: "Bench Press Modifed",
  //     group: "chest"
  //     modified: true,
  //     tracks: ['weight', 'reps'],
  //     description: "A compound exercise that targets the chest, shoulders, and triceps.",
  //     image: require("../assets/exercises/benchPress.png"),
  //     muscleGroups: ["chest", "shoulders", "triceps"],
  //     difficulty: "intermediate",
  //     previousId: "1",
  //     id: "2314234"
  // },],
    completedExercises:{},// { "2": [{date: 23235235, sets: [{weight: "135", reps: "10"}], shared: true,}] }, // simple data, by exerciseId
    savedWorkouts:[],// [{name: "Legs", id: "234", exercises: [ {id: "2", note:"", sets: [{lbs: "135", reps: "10"}]},] }, {name: "Chest and Shoulders", id: "2344", exercises: [ {id: "2314234", note:"", sets: [{lbs: "135", reps: "10"}]},{id: "4", note:"", sets: [{lbs: "135", reps: "10"}]}] }, {name: "Back", id: "345", exercises: [ {id: "4", note:"", sets: [{lbs: "135", reps: "10"}]},] }],
    customFoods: {}, // {id: {name, image, timeCreated, id, category, nutrition: {cal, pro, car, fat}}} deepMerge(food, edittedFood)
    archivedFoods: {}, // {foodId: true, foodId2: false, ...}
    foodCategories: [], // "name"
    savedMeals: [], // {name, id, totalNutrition, date, fullMeal }
    consumedMeals: {}, // {"00/00/0000": [{name, id, totalNutrition, fullMeal, ]}
    pastWorkouts: [], // [{workoutName, time, workoutLength, totalWeightLifted, exercises, fullWorkout}, {workoutName, time, workoutLength, totalWeightLifted, exercises, fullWorkout}, ],

    

    tracking: {
      visibleWidgets: ["nutrition"], // ["calories", "ex_89023u42i0jr", "nutrition"] cannot remove nutrition
      nutrition: {
        "calories": {
          // Data is calculated live from consumedMeals and the date
          extraData: {
            goal: 2000,
          }
        },
        "protein": {
          extraData: {
            goal: 150,
          }
        },
        "carbs": {
          extraData: {
            goal: 150,
          }
        },
        "fat": {
          extraData: {
            goal: 150,
          }
        }
      },
      insights: {
        expenditure: {
          data: [], // This data holds exercise and food data
          unit: "kcal",
          layout: "expenditure", // weight, calorie, none, bmi, expenditure
          color: "#DB8854",
          extraData: {},
        },
        BMI: {
          data: [ ], // Fully dynamically convered
          unit: "",
          layout: "bmi", // weight, calorie, none, bmi 
          color: "#54DBA9",
          extraData: {},
        },
      },
      logging: {
        "weight": {
          data: [  ], // [{date, amount}]
          unit: "lbs", // lbs, kgs
          layout: "weight", // weight, calorie, none, bmi 
          color: "#DBD654",
          extraData: {
            goal: null,
          },
          inputOptions: {
            increment: 0.1,
            range: [0, 2000],
            scrollItemWidth: 10,
            defaultValue: 150,
          }
        },
        // "calories": {
        //   data: [ {date: 235234, amount: 1564, }, {date: 235235, amount: 1500, }, {date: 235236, amount: 1660, }, {date: 235237, amount: 2352, }, {date: 235238, amount: 1800, }, {date: 235239, amount: 2844, }, {date: 1756576994961, amount: 2345, } ],
        //   unit: "",
        //   layout: "calorie", // weight, calorie, none, bmi 
        //   color: "#9a54dbff",
        //   extraData: {
        //     dailyGoal: 2000,
        //     meals: [
        //       {
        //         name: "Burger",
        //         calories: 400,
        //       },
        //     ]
        //   },
        //   inputOptions: {
        //     increment: 1,
        //     range: [0, 20000],
        //     scrollItemWidth: 10,
        //     defaultValue: 0,
        //   }
        // },
        "sleep amount": {
          data: [  ],
          unit: "hrs",
          layout: "weight", // weight, calorie, none, bmi
          color: "#DB5454", 
          extraData: {
            goal: 8,
          },
          inputOptions: {
            increment: 0.1,
            range: [0, 30],
            scrollItemWidth: 20,
            defaultValue: 8,
          }
        },
        "sleep quality": {
          data: [ ],
          unit: "/10",
          layout: "weight", // weight, calorie, none, bmi 
          color: "#DB8854",
          extraData: {
            goal: null,
          },
          inputOptions: {
            increment: 0.1,
            range: [0, 10],
            scrollItemWidth: 50,
            defaultValue: 10,
          }
        },
        "water intake": {
          data: [], // [{date, amount,}] // in cups
          unit: "cups",
          layout: "water", // weight, calorie, none, bmi 
          color: "#546FDB",
          extraData: {
            goal: 15, // cups
            valueToAdd: 1,
          },
          inputOptions: {
            increment: 0.1,
            range: [0, 100],
            scrollItemWidth: 10,
            defaultValue: 0,
          }
        },

      }
    },

    // Moved to top
    // health: {
    //   height: 70, // inches
    //   age: 28,
    //   gender: "male",
    // },


    
    // Only local not in live db
    activeWorkout: null, // active working session
    editActiveWorkout: null, // Edit workout screen
    editActivePlate: null, // {foods: [{foodId, quantity, ...food}], name: "My Plate", id: "234234"}
    activeReopenExercise: null,
};

export const TestUsers = [USER];