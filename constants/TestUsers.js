

const USER = {
    recentActivity: [{  "userId": "1",
      "timestamp": "1746060519969",
      "type": "posted",
      "details": {
        "postId": "123",
        "title": "User2 started a workout",
        "subtitle": "Chest and shoulders",
      },
      "visibility": "visible" // visible, hidden
    }], // From seperate collection, Activity, received from server

    _id: "1",
    username: "User1",
    name: 'Test Name',
    email: '',
    dateJoined: 234234234,
    rank: 'user',
    premium: false,
    premiumFeatures: {},
    settings: {},
    prefix: '',
    friendRequests: [],
    friendsAdded: [],
    friends: [],
    subscriptions: [],
    profileImg: {},
    trouble: {},
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
    completedExercises:{},// { "2": [{date: 23235235, sets: [{weight: "135", reps: "10"}], shared: true,}] }, // by exerciseId
    savedWorkouts:[],// [{name: "Legs", id: "234", exercises: [ {id: "2", note:"", sets: [{lbs: "135", reps: "10"}]},] }, {name: "Chest and Shoulders", id: "2344", exercises: [ {id: "2314234", note:"", sets: [{lbs: "135", reps: "10"}]},{id: "4", note:"", sets: [{lbs: "135", reps: "10"}]}] }, {name: "Back", id: "345", exercises: [ {id: "4", note:"", sets: [{lbs: "135", reps: "10"}]},] }],
    tracking: {
      insights: {
        expenditure: {
          data: [ {date: 1756499105140, amount: 2312, }],
          active: true,
          unit: "kcal",
          layout: "none", // weight, calorie, none, bmi 
          color: "#DB8854",
          extraData: {},
        },
        BMI: {
          data: [ {date: 1756499105140, amount: 20,}],
          active: true,
          unit: "",
          layout: "bmi", // weight, calorie, none, bmi 
          color: "#54DBA9",
          extraData: {},
        },
      },
      logging: {
        "weight": {
          data: [  ],
          active: true,
          unit: "lbs",
          layout: "weight", // weight, calorie, none, bmi 
          color: "#546FDB",
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
        "calories": {
          data: [ {date: 235234, amount: 1564, }, {date: 235235, amount: 1500, }, {date: 235236, amount: 1660, }, {date: 235237, amount: 2352, }, {date: 235238, amount: 1800, }, {date: 235239, amount: 2844, }, {date: 1756576994961, amount: 2345, } ],
          active: true,
          unit: "",
          layout: "calorie", // weight, calorie, none, bmi 
          color: "#9a54dbff",
          extraData: {
            dailyGoal: 2000,
            meals: [
              {
                name: "Burger",
                calories: 400,
              },
            ]
          },
          inputOptions: {
            increment: 1,
            range: [0, 20000],
            scrollItemWidth: 10,
            defaultValue: 0,
          }
        },
        "sleep amount": {
          data: [  ],
          active: true,
          unit: "hrs",
          layout: "weight", // weight, calorie, none, bmi
          color: "#DB5454", 
          extraData: {
            goal: null,
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
          active: true,
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
          data: [ {date: 235234, amount: 10, }, {date: 235235, amount: 10, }, {date: 235236, amount: 10, }, {date: 235237, amount: 10, }, {date: 235238, amount: 10, }, {date: 235239, amount: 10, }, {date: 235240, amount: 10, } ],
          active: true,
          unit: "cups",
          layout: "calorie", // weight, calorie, none, bmi 
          color: "#DBD654",
          extraData: {
            dailyGoal: 2000,
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


    health: {
      height: 70, // inches
      age: 28,
      gender: "male",
    },


    pastWorkouts: [], // [{workoutName, time, workoutLength, totalWeightLifted, exercises, fullWorkout}, {workoutName, time, workoutLength, totalWeightLifted, exercises, fullWorkout}, ],
    googleId: null,
    appleId: null,
    facebookId: null,

    // Only local not in live db
    activeWorkout: null,
    editActiveWorkout: null,
    activeReopenExercise: null,
};

export const TestUsers = [USER];