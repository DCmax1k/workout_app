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

const uploadData = async (user, keys=allKeys) => {
    const {jsonWebToken} = user;
    if (!jsonWebToken) return {status: "error", message: "No token provided!"};
    
    const dataToUpload = {};
    keys.forEach(key => {
        dataToUpload[key] = user[key];
    });

    const response = await sendData("/dashboard/uploaddata", ({jsonWebToken, dataToUpload}));
    return response;

}

export default uploadData;