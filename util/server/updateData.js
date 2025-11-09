import { VERSION } from '../../constants/ServerConstants';
import sendData from './sendData';

// This funtion sends updates to the user object
// The backend will combine the current backedup user with the updates
// The front end also does this, but dones send the full user to
// ensure that if this device doesnt have some info it doesn't
// clear other data backed up

// to re sync, the user can download data.

// NOT USING YET

const updateData = async ({updates, jsonWebToken}) => {
    // Send data to page /auth
    const response = await sendData("/dashboard/updateuser", ({updates, jsonWebToken}));
    return response;
    // return {status: "success", userInfo}
}

export default updateData;