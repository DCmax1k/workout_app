


const lbsToKgs = (lbs) => {
    return 0.453592*lbs;
}
const dayProgress = () => {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // midnight today
    const elapsed = now.getTime() - startOfDay.getTime();
    const total = 24 * 60 * 60 * 1000; // total ms in a day
    return elapsed / total;
}

const getWeightAtDate = (weights, targetDate) => {

    const targetTimeDate = new Date(targetDate);
    targetTimeDate.setHours(17,0,0,0); // Checks up to before 5pm if the weight was logged
    const targetTime = targetTimeDate.getTime();

    // Filter all weights that happened **before or at the target date**
    const pastWeights = weights.filter(w => new Date(w.date).getTime() <= targetTime);

    if (pastWeights.length === 0) return null; // no weight before this date

    // Find the latest one before the target date
    const lastWeight = pastWeights.reduce((latest, w) => {
        return new Date(w.date) > new Date(latest.date) ? w : latest;
    });

    return lastWeight.amount;
}

function yearsBetween(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    let years = d2.getFullYear() - d1.getFullYear();
    // Adjust if the second date hasn't reached the month/day of the first date yet
    if ( d2.getMonth() < d1.getMonth() || (d2.getMonth() === d1.getMonth() && d2.getDate() < d1.getDate())) {
        years--;
    }
    return years;
}

const calculateBMI = (oriData, oriDates, user) => {
    const sixMonthsAgo = new Date();
    const dayOffset = 180
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - dayOffset);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyDataPoints = [];
    const dailyDatePoints = [];


    for (let day = new Date(sixMonthsAgo); day.getTime() <= today.getTime(); day.setDate(day.getDate() + 1)) {
        let bmi = 0; // For the day, calculate resting amount
        const userWeightWidget = user.tracking.logging["weight"];
        if (((userWeightWidget.data.length > 0) && user.settings.height !== null && user.settings.gender !==null && user.settings.birthday !== null) === true) { // Same logic in progress index
            //const userWeight = userWeightWidget.data[userWeightWidget.data.length-1].amount;
            const userWeight = getWeightAtDate(userWeightWidget.data, day);
            const weightKgs = userWeight ? userWeightWidget.unit === "lbs" ? lbsToKgs(userWeight) : userWeight : null;

            if (userWeight) {
                const heightM = user.settings.height * 0.01;
                const heightS = Math.pow(heightM, 2);
                bmi = weightKgs/heightS;

            } 
        }
        dailyDataPoints.push(0+(bmi));
        dailyDatePoints.push(day.getTime());
    }
    // Loop through oriData and fit into dailyData - Not needed. All data is dynamic
    // const dailyDate = new Date(sixMonthsAgo);
    // let loopInd = 0; // index of dailyData
    // for (let i = 0; i<oriData.length; i++) {
    //     const dataDate = new Date(oriDates[i]);
    //     dataDate.setHours(0,0,0,0);
    //     // Catch up the dailys
    //     if (dataDate.getTime() > dailyDate.getTime()) {
    //         while (dataDate.getTime() > dailyDate.getTime()) {
    //             dailyDate.setDate(dailyDate.getDate() + 1);
    //             loopInd++;
    //         }
            
    //     }
    //     if (dataDate.getTime() === dailyDate.getTime()) {
    //         dailyDataPoints[loopInd] = dailyDataPoints[loopInd] + oriData[i];
    //         dailyDatePoints[loopInd] = oriDates[i];
    //         loopInd++;
    //         dailyDate.setDate(dailyDate.getDate()+1);
    //     } else {
    //         continue; // Data is from before sixMonthsAgo
    //     }
    // }
    return {data: dailyDataPoints, dates: dailyDatePoints}
}

export default calculateBMI;