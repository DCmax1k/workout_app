// Auth is meant to be called when the app is reFocused on a higher layout file to update necessary data.
// Data from server is as follows; if any of the following are changed locally, they must also change on the backend immidiatly
// const userInfo = {
//             recentActivity,
//             dbId: req.userId,
//             username: user.username,
//             name: user.name,
//             email: user.email,
//             rank: user.rank,
//             premium: user.premium,
//             friendRequests: user.friendRequests,
//             friendsAdded: user.friendsAdded,
//             friends: user.friends,
//             subscriptions: user.subscriptions,
//             profileImg: user.profileImg,
//             trouble: user.trouble,
//             googleId: user.googleId,
//             appleId: user.appleId,
//             facebookId: user.facebookId,

//         }

import { VERSION } from '../../constants/ServerConstants';
import sendData from './sendData';

const auth = async (jsonWebToken) => {
    // Send data to page /auth
    const response = await sendData("/auth", ({jsonWebToken}));
    if (response.status !== "success") return response;
    // If version mismatch, return {status: "error", message: "Version mismatch"}
    if (response.version !== VERSION) return {status: "error", message: "Version mismatch"};
    // Get user data and server version
    const { userInfo } = response;
    return {status: "success", userInfo};
    // return {status: "success", userInfo}
}

export default auth;