import { VERSION } from '../../constants/ServerConstants';
import sendData from './sendData';

const allKeys = [
        'settings',
        'usernameDecoration',
        'schedule',
        'archivedExercises',
        'createdExercises',
        'completedExercises',
        'savedWorkouts',
        'customFoods',
        'archivedFoods',
        'foodCategories',
        'savedMeals',
        'consumedMeals',
        'pastWorkouts',
        'tracking',
    ];

const downloadData = async (user, keys=allKeys) => {
    const {jsonWebToken} = user;
    if (!jsonWebToken) return {status: "error", message: "No token provided!"};

    const response = await sendData("/dashboard/downloaddata", ({jsonWebToken, keys}));
    return response;

}

export default downloadData;