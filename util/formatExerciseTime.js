import minutesToHMS from "./minutesToHMS";

export default function formatExerciseTime(value) {
    const {hours, minutes, seconds} = minutesToHMS(value);
    let str = "";
    if (hours > 0) {
        str += `${hours}h`
    }
    if (minutes > 0) {
        str += `${str.length > 0 ? " ":""}${minutes}m`
    }
    if (seconds > 0) {
        str += `${str.length > 0 ? " ":""}${seconds}s`
    }
    return str;
}