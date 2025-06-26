const track = {
    strength: ['weight', 'reps'],
    strengthPlus: ['weightPlus', 'reps'],
    cardio: ['mile', 'time'],
    distance: ['mile'],
    repsOnly: ['reps'],
}
// Groups: chest, abs, back, bicep, tricep, forearm, shoulder, leg
export const Exercises = [
    {
        "name": "Treadmill Walking",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A low-impact cardiovascular exercise that helps improve heart health and endurance by walking on a treadmill at a steady pace.",
        // "image": require("../assets/exercises/treadmillWalking.png"),
        "muscleGroups": ["legs", "glutes", "core"],
        "difficulty": "beginner",
        "id": "101"
    },
    {
        "name": "Outdoor Running",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A high-impact aerobic exercise that strengthens the cardiovascular system, boosts endurance, and burns calories.",
        // "image": require("../assets/exercises/outdoorRunning.png"),
        "muscleGroups": ["legs", "glutes", "core"],
        "difficulty": "intermediate",
        "id": "102"
    },
    {
        "name": "Outdoor Walking",
        "group": "cardio",
        "tracks": track.distance,
        "description": "A moderate cardiovascular activity that helps maintain overall fitness, reduce stress, and promote heart health.",
        // "image": require("../assets/exercises/outdoorWalking.png"),
        "muscleGroups": ["legs", "glutes", "core"],
        "difficulty": "beginner",
        "id": "106"
    },
    {
        "name": "Stationary Bike",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A low-impact cycling exercise that improves cardiovascular health, tones leg muscles, and enhances endurance.",
        // "image": require("../assets/exercises/stationaryBike.png"),
        "muscleGroups": ["quads", "hamstrings", "glutes"],
        "difficulty": "beginner",
        "id": "103"
    },
    {
        "name": "Elliptical Trainer",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A full-body cardio workout that mimics stair climbing and walking, reducing joint stress while boosting stamina and strength.",
        // "image": require("../assets/exercises/ellipticalTrainer.png"),
        "muscleGroups": ["legs", "glutes", "arms"],
        "difficulty": "intermediate",
        "id": "104"
    },
    {
        "name": "Stairmaster",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A cardio workout involving stair climbing that targets the glutes, hamstrings, and calves while improving endurance.",
        // "image": require("../assets/exercises/stairmaster.png"),
        "muscleGroups": ["glutes", "hamstrings", "calves"],
        "difficulty": "intermediate",
        "id": "105"
    },
    {
        "name": "Incline Treadmill Walk",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "Walking on an inclined treadmill to increase intensity and muscle engagement in the lower body, especially the glutes and calves.",
        // "image": require("../assets/exercises/inclineTreadmillWalk.png"),
        "muscleGroups": ["glutes", "calves", "hamstrings"],
        "difficulty": "intermediate",
        "id": "107"
    },
    {
        "name": "Jogging",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A steady, moderate-paced aerobic exercise that improves heart health, stamina, and burns fat.",
        // "image": require("../assets/exercises/jogging.png"),
        "muscleGroups": ["legs", "glutes", "core"],
        "difficulty": "intermediate",
        "id": "108"
    },
    {
        "name": "Hiking",
        "group": "cardio",
        "tracks": track.distance,
        "description": "A cardiovascular and endurance activity that challenges the entire body while navigating natural terrain.",
        // "image": require("../assets/exercises/hiking.png"),
        "muscleGroups": ["legs", "glutes", "core"],
        "difficulty": "intermediate",
        "id": "109"
    },
    {
        "name": "High-Intensity Sprint Intervals",
        "group": "cardio",
        "tracks": track.cardio,
        "description": "A high-intensity training method involving short bursts of sprinting followed by brief rest periods, boosting cardiovascular capacity and metabolism.",
        // "image": require("../assets/exercises/sprintIntervals.png"),
        "muscleGroups": ["legs", "glutes", "core"],
        "difficulty": "advanced",
        "id": "110"
    },
    {
        "name": "Barbell Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The barbell bench press is a fundamental exercise for building upper body strength, specifically targeting the pectoral muscles, triceps, and shoulders.",
        "image": require("../assets/exercises/benchPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "1"
    },
    {
        "name": "Incline Barbell Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The incline barbell bench press emphasizes the upper chest and front deltoids, helping to develop a well-rounded chest and upper body strength.",
        "image": require("../assets/exercises/inclineBarbellPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "2"
    },
    {
        "name": "Decline Barbell Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The decline barbell bench press targets the lower part of the chest and helps in building a fuller, more balanced chest development.",
        //"image": require("../assets/exercises/declineBarbellPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "3"
    },
    {
        "name": "Dumbbell Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The dumbbell bench press is a versatile chest exercise that enhances muscle symmetry and requires more stabilizer engagement compared to the barbell variation.",
        "image": require("../assets/exercises/dumbbellBenchPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "4"
    },
    {
        "name": "Incline Dumbbell Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The incline dumbbell bench press focuses on the upper chest, improving muscle definition and balance while also engaging shoulder stabilizers.",
        "image": require("../assets/exercises/inclineDumbbellPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "5"
    },
    {
        "name": "Decline Dumbbell Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The decline dumbbell bench press isolates the lower chest muscles, providing a greater range of motion and promoting muscle symmetry.",
        //"image": require("../assets/exercises/declineDumbbellPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "6"
    },
    {
        "name": "Machine Bench Press",
        "group": "chest",
        "tracks": track.strength,
        "description": "The machine bench press is a beginner-friendly exercise that allows for controlled chest development with reduced risk of injury due to its guided motion.",
        "image": require("../assets/exercises/machineBenchPress.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "beginner",
        "id": "7"
    },
    {
        "name": "Cable Crossover",
        "group": "chest",
        "tracks": track.strength,
        "description": "The cable crossover is an isolation movement that targets the inner and outer portions of the chest, helping to improve muscle definition and balance.",
        "image": require("../assets/exercises/cableCrossover.png"),
        "muscleGroups": ["chest"],
        "difficulty": "intermediate",
        "id": "8"
    },
    {
        "name": "Machine Fly",
        "group": "chest",
        "tracks": track.strength,
        "description": "The machine fly isolates the chest muscles in a safe and controlled manner, ideal for beginners and those focusing on hypertrophy.",
        "image": require("../assets/exercises/machineFly.png"),
        "muscleGroups": ["chest"],
        "difficulty": "beginner",
        "id": "9"
    },
    {
        "name": "Dumbbell Fly",
        "group": "chest",
        "tracks": track.strength,
        "description": "The dumbbell fly is a classic chest isolation exercise that stretches and contracts the pectoral muscles, promoting chest width and definition.",
        //"image": require("../assets/exercises/dumbbellFly.png"),
        "muscleGroups": ["chest"],
        "difficulty": "intermediate",
        "id": "10"
    },
    {
        "name": "Push-Up",
        "group": "chest",
        "tracks": track.strength,
        "description": "The push-up is a bodyweight exercise that targets the chest, shoulders, and triceps, and can be performed anywhere without equipment.",
        "image": require("../assets/exercises/pushUp.png"),
        "muscleGroups": ["chest", "shoulders", "triceps"],
        "difficulty": "beginner",
        "id": "11"
    },
    {
        "name": "Machine Ab Crunch",
        "group": "abs",
        "tracks": track.strength,
        "description": "The machine ab crunch isolates the abdominal muscles using a guided motion, making it ideal for beginners or those seeking focused core work.",
        "image": require("../assets/exercises/machineAbCrunch.png"),
        "muscleGroups": ["abs"],
        "difficulty": "beginner",
        "id": "12"
    },
    {
        "name": "Plank",
        "group": "abs",
        "tracks": track.strength,
        "description": "The plank is an isometric core exercise that strengthens the abdominal muscles, lower back, and stabilizers through sustained tension.",
        "image": require("../assets/exercises/plank.png"),
        "muscleGroups": ["abs", "core"],
        "difficulty": "intermediate",
        "id": "13"
    },
    {
        "name": "Crunch",
        "group": "abs",
        "tracks": track.strength,
        "description": "The crunch is a fundamental ab exercise that targets the rectus abdominis with a short range of motion to isolate the upper core.",
        // "image": require("../assets/exercises/crunch.png"),
        "muscleGroups": ["abs"],
        "difficulty": "beginner",
        "id": "14"
    },
    {
        "name": "Leg Raise",
        "group": "abs",
        "tracks": track.strength,
        "description": "The leg raise is an effective lower ab exercise that strengthens the hip flexors and lower core through controlled leg motion.",
        // "image": require("../assets/exercises/legRaise.png"),
        "muscleGroups": ["abs", "hip flexors"],
        "difficulty": "intermediate",
        "id": "15"
    },
    {
        "name": "Air Bike",
        "group": "abs",
        "tracks": track.strength,
        "description": "The air bike is a dynamic core exercise that targets both the upper and lower abs as well as the obliques through a twisting, pedaling motion.",
        // "image": require("../assets/exercises/airBike.png"),
        "muscleGroups": ["abs", "obliques"],
        "difficulty": "intermediate",
        "id": "16"
    },
    {
        "name": "Decline Crunch",
        "group": "abs",
        "tracks": track.strength,
        "description": "The decline crunch increases abdominal activation by working against gravity on a decline bench, emphasizing upper abs.",
        // "image": require("../assets/exercises/declineCrunch.png"),
        "muscleGroups": ["abs"],
        "difficulty": "intermediate",
        "id": "17"
    },
    {
        "name": "Sit-Up",
        "group": "abs",
        "tracks": track.strength,
        "description": "The sit-up is a traditional core exercise that engages the full rectus abdominis and can also involve the hip flexors if not isolated.",
        // "image": require("../assets/exercises/sitUp.png"),
        "muscleGroups": ["abs", "hip flexors"],
        "difficulty": "intermediate",
        "id": "18"
    },
    {
        "name": "Side Plank",
        "group": "abs",
        "tracks": track.strength,
        "description": "The side plank strengthens the obliques and core stabilizers through isometric tension, enhancing lateral strength and balance.",
        // "image": require("../assets/exercises/sidePlank.png"),
        "muscleGroups": ["obliques", "core"],
        "difficulty": "intermediate",
        "id": "19"
    },
    {
        "name": "Mountain Climber",
        "group": "abs",
        "tracks": track.strength,
        "description": "The mountain climber is a fast-paced, full-body movement that primarily targets the core while also improving cardiovascular endurance.",
        // "image": require("../assets/exercises/mountainClimber.png"),
        "muscleGroups": ["abs", "core", "hip flexors"],
        "difficulty": "intermediate",
        "id": "20"
    },
    {
        "name": "Barbell Deadlift",
        "group": "back",
        "tracks": track.strength,
        "description": "The barbell deadlift is a compound lift that targets the entire posterior chain, with a focus on the lower back, glutes, and hamstrings.",
        "image": require("../assets/exercises/barbellDeadlift.png"),
        "muscleGroups": ["back", "glutes", "hamstrings"],
        "difficulty": "advanced",
        "id": "21"
    },
    {
        "name": "Cable Lat Pulldown",
        "group": "back",
        "tracks": track.strength,
        "description": "The cable lat pulldown targets the latissimus dorsi muscles and helps build a wide, strong back through vertical pulling.",
        // "image": require("../assets/exercises/cableLatPulldown.png"),
        "muscleGroups": ["back", "biceps"],
        "difficulty": "beginner",
        "id": "22"
    },
    {
        "name": "Cable Seated Row",
        "group": "back",
        "tracks": track.strength,
        "description": "The cable seated row is a horizontal pulling movement that strengthens the middle back and rear deltoids, improving posture and upper body strength.",
        "image": require("../assets/exercises/cableSeatedRow.png"),
        "muscleGroups": ["back", "biceps", "rear delts"],
        "difficulty": "beginner",
        "id": "23"
    },
    {
        "name": "Dumbbell One-Arm Row",
        "group": "back",
        "tracks": track.strength,
        "description": "The dumbbell one-arm row builds unilateral strength and muscle balance, targeting the lats, traps, and rhomboids.",
        // "image": require("../assets/exercises/oneArmRow.png"),
        "muscleGroups": ["back", "biceps"],
        "difficulty": "intermediate",
        "id": "24"
    },
    {
        "name": "Barbell Bent-Over Row",
        "group": "back",
        "tracks": track.strength,
        "description": "The barbell bent-over row is a powerful compound movement that develops the lats, traps, and rhomboids, while engaging the lower back for stability.",
        "image": require("../assets/exercises/barbellRow.png"),
        "muscleGroups": ["back", "biceps", "lower back"],
        "difficulty": "intermediate",
        "id": "25"
    },
    {
        "name": "Pull-Up",
        "group": "back",
        "tracks": track.strength,
        "description": "The pull-up is a bodyweight exercise that primarily targets the upper back and lats, requiring significant upper-body strength.",
        // "image": require("../assets/exercises/pullUp.png"),
        "muscleGroups": ["back", "biceps"],
        "difficulty": "advanced",
        "id": "26"
    },
    {
        "name": "Cable Rope Face Pull",
        "group": "back",
        "tracks": track.strength,
        "description": "The cable rope face pull strengthens the rear delts, traps, and rotator cuff muscles, promoting shoulder health and posture.",
        // "image": require("../assets/exercises/facePull.png"),
        "muscleGroups": ["rear delts", "traps", "upper back"],
        "difficulty": "intermediate",
        "id": "27"
    },
    {
        "name": "Dumbbell Shoulder Shrug",
        "group": "back",
        "tracks": track.strength,
        "description": "The dumbbell shoulder shrug isolates the trapezius muscles, enhancing upper back mass and neck strength.",
        // "image": require("../assets/exercises/shoulderShrug.png"),
        "muscleGroups": ["traps"],
        "difficulty": "beginner",
        "id": "28"
    },
    {
        "name": "Back Hyperextension",
        "group": "back",
        "tracks": track.strength,
        "description": "The back hyperextension strengthens the lower back, glutes, and hamstrings, improving spinal stability and injury prevention.",
        "image": require("../assets/exercises/backHyperextension.png"),
        "muscleGroups": ["lower back", "glutes", "hamstrings"],
        "difficulty": "beginner",
        "id": "29"
    },
    {
        "name": "Machine Lat Pulldown",
        "group": "back",
        "tracks": track.strength,
        "description": "The machine lat pulldown provides a controlled way to strengthen the lats and upper back, making it suitable for beginners.",
        // "image": require("../assets/exercises/machineLatPulldown.png"),
        "muscleGroups": ["back", "biceps"],
        "difficulty": "beginner",
        "id": "30"
    },
    {
        "name": "Machine Bicep Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The machine bicep curl provides a stable and controlled environment to isolate the biceps, making it ideal for beginners or focused muscle building.",
        "image": require("../assets/exercises/machineBicepCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "beginner",
        "id": "31"
    },
    {
        "name": "Dumbbell Bicep Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The dumbbell bicep curl is a staple arm exercise that targets the biceps while allowing for unilateral development and improved balance.",
        // "image": require("../assets/exercises/dumbbellBicepCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "beginner",
        "id": "32"
    },
    {
        "name": "Barbell Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The barbell curl is a fundamental movement for bicep mass, allowing for heavier loads and symmetric development of both arms.",
        // "image": require("../assets/exercises/barbellCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "intermediate",
        "id": "33"
    },
    {
        "name": "Dumbbell Hammer Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The dumbbell hammer curl targets both the biceps and brachialis muscles, contributing to thicker, more well-rounded arms.",
        "image": require("../assets/exercises/hammerCurl.png"),
        "muscleGroups": ["biceps", "brachialis"],
        "difficulty": "intermediate",
        "id": "34"
    },
    {
        "name": "Dumbbell Incline Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The dumbbell incline curl stretches the biceps for increased activation and focuses on the long head for peak development.",
        // "image": require("../assets/exercises/inclineCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "intermediate",
        "id": "35"
    },
    {
        "name": "Cable Bicep Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The cable bicep curl provides constant tension throughout the movement, effectively targeting the biceps and enhancing muscle control.",
        // "image": require("../assets/exercises/cableBicepCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "intermediate",
        "id": "36"
    },
    {
        "name": "Preacher Curl Machine",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The preacher curl machine locks the upper arms in place to isolate the biceps, reducing momentum and increasing targeted tension.",
        // "image": require("../assets/exercises/preacherCurlMachine.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "beginner",
        "id": "37"
    },
    {
        "name": "Barbell Preacher Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The barbell preacher curl emphasizes the lower portion of the biceps, allowing for a strict movement and improved form.",
        "image": require("../assets/exercises/barbellPreacherCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "intermediate",
        "id": "38"
    },
    {
        "name": "Dumbbell Preacher Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The dumbbell preacher curl allows for unilateral focus and strict isolation of the biceps with reduced momentum.",
        // "image": require("../assets/exercises/dumbbellPreacherCurl.png"),
        "muscleGroups": ["biceps"],
        "difficulty": "intermediate",
        "id": "39"
    },
    {
        "name": "Cable Hammer Curl",
        "group": "bicep",
        "tracks": track.strength,
        "description": "The cable hammer curl emphasizes the brachialis and biceps, providing consistent tension and enhancing arm thickness.",
        // "image": require("../assets/exercises/cableHammerCurl.png"),
        "muscleGroups": ["biceps", "brachialis"],
        "difficulty": "intermediate",
        "id": "40"
    },
    {
        "name": "Cable Tricep Pushdown",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The cable tricep pushdown isolates the triceps using controlled downward motion, ideal for toning and building arm definition.",
        "image": require("../assets/exercises/cableTricepPushdown.png"),
        "muscleGroups": ["triceps"],
        "difficulty": "beginner",
        "id": "41"
    },
    {
        "name": "Dip",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The dip is a bodyweight compound exercise that targets the triceps, chest, and shoulders through vertical pressing motion.",
        // "image": require("../assets/exercises/dip.png"),
        "muscleGroups": ["triceps", "chest", "shoulders"],
        "difficulty": "intermediate",
        "id": "42"
    },
    {
        "name": "Cable Overhead Tricep Extension",
        "group": "tricep",
        "tracks": track.strength,
        "description": "This overhead cable movement stretches and isolates the long head of the triceps, building fuller arm development.",
        // "image": require("../assets/exercises/cableOverheadTricepExtension.png"),
        "muscleGroups": ["triceps"],
        "difficulty": "intermediate",
        "id": "43"
    },
    {
        "name": "Dumbbell Tricep Extension",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The dumbbell tricep extension targets the triceps by extending the arms overhead, promoting strength and muscle definition.",
        // "image": require("../assets/exercises/dumbbellTricepExtension.png"),
        "muscleGroups": ["triceps"],
        "difficulty": "intermediate",
        "id": "44"
    },
    {
        "name": "Machine Tricep Extension",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The machine tricep extension isolates the triceps using a stable, guided path, making it accessible for beginners and rehab training.",
        // "image": require("../assets/exercises/machineTricepExtension.png"),
        "muscleGroups": ["triceps"],
        "difficulty": "beginner",
        "id": "45"
    },
    {
        "name": "Dumbbell One-Arm Tricep Kickback",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The dumbbell one-arm tricep kickback emphasizes the triceps by isolating the muscle during the arm's full extension behind the body.",
        // "image": require("../assets/exercises/oneArmKickback.png"),
        "muscleGroups": ["triceps"],
        "difficulty": "intermediate",
        "id": "46"
    },
    {
        "name": "Bench Dip",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The bench dip is a bodyweight exercise that primarily works the triceps with some assistance from the chest and shoulders.",
        // "image": require("../assets/exercises/benchDip.png"),
        "muscleGroups": ["triceps", "chest", "shoulders"],
        "difficulty": "beginner",
        "id": "47"
    },
    {
        "name": "Barbell Skull Crusher",
        "group": "tricep",
        "tracks": track.strength,
        "description": "The barbell skull crusher targets all three heads of the triceps through controlled extension while lying flat on a bench.",
        // "image": require("../assets/exercises/skullCrusher.png"),
        "muscleGroups": ["triceps"],
        "difficulty": "intermediate",
        "id": "48"
    },
    {
        "name": "Barbell Wrist Curl",
        "group": "forearm",
        "tracks": track.strength,
        "description": "The barbell wrist curl targets the forearm flexors, helping to build wrist strength and overall forearm size.",
        // "image": require("../assets/exercises/barbellWristCurl.png"),
        "muscleGroups": ["forearms"],
        "difficulty": "beginner",
        "id": "49"
    },
    {
        "name": "Barbell Reverse Curl",
        "group": "forearm",
        "tracks": track.strength,
        "description": "The barbell reverse curl strengthens the brachioradialis and forearm extensors, enhancing grip and arm definition.",
        // "image": require("../assets/exercises/barbellReverseCurl.png"),
        "muscleGroups": ["forearms", "biceps", "brachialis"],
        "difficulty": "intermediate",
        "id": "50"
    },
    {
        "name": "Cable Wrist Curl",
        "group": "forearm",
        "tracks": track.strength,
        "description": "The cable wrist curl provides consistent tension on the forearm flexors throughout the movement, improving grip and endurance.",
        "image": require("../assets/exercises/cableWristCurl.png"),
        "muscleGroups": ["forearms"],
        "difficulty": "beginner",
        "id": "51"
    },
    {
        "name": "Dumbbell Lateral Raise",
        "group": "shoulder",
        "tracks": track.strength,
        "description": "The dumbbell lateral raise targets the lateral deltoids, helping to build shoulder width and improve upper body symmetry.",
        // "image": require("../assets/exercises/dumbbellLateralRaise.png"),
        "muscleGroups": ["shoulders"],
        "difficulty": "intermediate",
        "id": "52"
    },
    {
        "name": "Cable Lateral Raise",
        "group": "shoulder",
        "tracks": track.strength,
        "description": "The cable lateral raise provides constant tension on the deltoids, effectively isolating the lateral head for better shoulder shape.",
        // "image": require("../assets/exercises/cableLateralRaise.png"),
        "muscleGroups": ["shoulders"],
        "difficulty": "intermediate",
        "id": "53"
    },
    {
        "name": "Dumbbell Shoulder Press",
        "group": "shoulder",
        "tracks": track.strength,
        "description": "The dumbbell shoulder press develops the deltoids and triceps, promoting balanced shoulder strength and stability.",
        "image": require("../assets/exercises/dumbbellShoulderPress.png"),
        "muscleGroups": ["shoulders", "triceps"],
        "difficulty": "intermediate",
        "id": "54"
    },
    {
        "name": "Machine Shoulder Press",
        "group": "shoulder",
        "tracks": track.strength,
        "description": "The machine shoulder press offers guided resistance to build shoulder strength while minimizing the risk of form breakdown.",
        // "image": require("../assets/exercises/machineShoulderPress.png"),
        "muscleGroups": ["shoulders", "triceps"],
        "difficulty": "beginner",
        "id": "55"
    },
    {
        "name": "Viking Press",
        "group": "shoulders",
        "tracks": track.strength,
        "description": "The Viking Press targets the shoulders and triceps using a standing overhead press motion with neutral grip, often performed with a landmine setup or specialized equipment.",
        "image": require("../assets/exercises/vikingPress.jpg"),
        "muscleGroups": ["shoulders", "triceps", "upper back"],
        "difficulty": "intermediate",
        "id": "551"
    },
    {
        "name": "Machine Reverse Fly",
        "group": "shoulder",
        "tracks": track.strength,
        "description": "The machine reverse fly isolates the rear deltoids and upper back muscles, improving posture and shoulder balance.",
        // "image": require("../assets/exercises/machineReverseFly.png"),
        "muscleGroups": ["shoulders", "upper back"],
        "difficulty": "beginner",
        "id": "56"
    },
    {
        "name": "Machine Deltoid Raise",
        "group": "shoulder",
        "tracks": track.strength,
        "description": "The machine deltoid raise targets the lateral delts in a controlled motion, enhancing shoulder width and muscle activation.",
        // "image": require("../assets/exercises/machineDeltoidRaise.png"),
        "muscleGroups": ["shoulders"],
        "difficulty": "beginner",
        "id": "57"
    },
    {
        "name": "Barbell Squat",
        "group": "leg",
        "tracks": track.strength,
        "description": "The barbell squat is a foundational compound lift that targets the quadriceps, hamstrings, glutes, and core for overall lower-body strength.",
        "image": require("../assets/exercises/barbellSquat.png"),
        "muscleGroups": ["quadriceps", "hamstrings", "glutes"],
        "difficulty": "intermediate",
        "id": "58"
    },
    {
        "name": "Dumbbell Squat",
        "group": "leg",
        "tracks": track.strength,
        "description": "The dumbbell squat builds lower body strength and stability, focusing on the quads, glutes, and hamstrings with added mobility.",
        // "image": require("../assets/exercises/dumbbellSquat.png"),
        "muscleGroups": ["quadriceps", "hamstrings", "glutes"],
        "difficulty": "beginner",
        "id": "59"
    },
    {
        "name": "Machine Leg Extensions",
        "group": "leg",
        "tracks": track.strength,
        "description": "Machine leg extensions isolate the quadriceps, allowing for focused development of the front thigh muscles.",
        "image": require("../assets/exercises/legExtension.png"),
        "muscleGroups": ["quadriceps"],
        "difficulty": "beginner",
        "id": "60"
    },
    {
        "name": "Machine Leg Press",
        "group": "leg",
        "tracks": track.strength,
        "description": "The machine leg press builds leg strength by targeting the quads, glutes, and hamstrings through a supported pressing motion.",
        // "image": require("../assets/exercises/legPress.png"),
        "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
        "difficulty": "beginner",
        "id": "61"
    },
    {
        "name": "Machine Leg Curl",
        "group": "leg",
        "tracks": track.strength,
        "description": "The machine leg curl isolates the hamstrings, helping to strengthen the rear of the thigh and improve knee stability.",
        // "image": require("../assets/exercises/legCurl.png"),
        "muscleGroups": ["hamstrings"],
        "difficulty": "beginner",
        "id": "62"
    },
    {
        "name": "Machine Calf Raise",
        "group": "leg",
        "tracks": track.strength,
        "description": "The machine calf raise targets the gastrocnemius and soleus muscles to develop stronger, more defined calves.",
        // "image": require("../assets/exercises/machineCalfRaise.png"),
        "muscleGroups": ["calves"],
        "difficulty": "beginner",
        "id": "63"
    },
    {
        "name": "Dumbbell Calf Raise",
        "group": "leg",
        "tracks": track.strength,
        "description": "The dumbbell calf raise strengthens the calf muscles using bodyweight and additional resistance for improved balance and growth.",
        // "image": require("../assets/exercises/dumbbellCalfRaise.png"),
        "muscleGroups": ["calves"],
        "difficulty": "beginner",
        "id": "64"
    },
    {
        "name": "Dumbbell Lunge",
        "group": "leg",
        "tracks": track.strength,
        "description": "The dumbbell lunge develops balance, coordination, and lower body strength by working the quads, hamstrings, and glutes.",
        // "image": require("../assets/exercises/dumbbellLunge.png"),
        "muscleGroups": ["quadriceps", "glutes", "hamstrings"],
        "difficulty": "intermediate",
        "id": "65"
    }
]