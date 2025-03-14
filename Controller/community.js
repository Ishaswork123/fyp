const jwt = require('jsonwebtoken');
const { getTokenFromCookies } = require('../config/tchr');  
const Community=require('../Model/community');
async function addUserToCommunity(req, communityId) {
    try {
        // Get token from cookies
        const teacherToken = getTokenFromCookies(req, "teacher_token");
        const studentToken = getTokenFromCookies(req, "student_token");

        // Determine user type based on token
        let user;
        if (teacherToken && teacherToken.role) {
            user = {
                userId: teacherToken.id,
                userType: 'tchr',
                role: 'tchr'
            };
        } else if (studentToken) {
            user = {
                userId: studentToken.id,
                userType: 'std',
                role: 'std'
            };
        } else {
            throw new Error('User authentication failed');
        }

        // Find community
        const community = await Community.findById(communityId);
        if (!community) {
            throw new Error('Community not found');
        }

        // Check if user is already in the community
        const isUserAlreadyAdded = community.users.some(userObj => userObj.userId.equals(user.userId));
        if (!isUserAlreadyAdded) {
            community.users.push({ userId: user.userId });
            community.totalUsers += 1;
            await community.save();
            console.log('User successfully added to the community');
        } else {
            console.log('User is already in the community');
        }
    } catch (error) {
        console.error('Error adding user:', error.message);
    }
}

module.exports={
    addUserToCommunity
};