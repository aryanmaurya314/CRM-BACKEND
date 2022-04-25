/**
 * This file have all the logic to manipulate the user resource
 */
const User = require("../models/user.model");
const objectConverter = require("../utils/objectConverter")

/**
 * Fetch the list of all users
 *  -- only ADMIN is allowed to call this method
 *  -- ADMIN should be able to filter based on:
 *         1. Name
 *         2. UserType
 *         3. UserStatus
 */
exports.findAllUsers = async (req, res) => {
    // read the data from querry params
    const nameReq = req.query.name;
    const userTypeReq = req.query.userType;
    const userStatusReq = req.query.userStatus;

    const mongoQueryObj = {};

    if (nameReq && userStatusReq && userTypeReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userStatus = userStatusReq;
        mongoQueryObj.userType = userTypeReq;
    }
    else if (nameReq && userStatusReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userStatus = userStatusReq;
    }
    else if (nameReq && userTypeReq) {
        mongoQueryObj.name = nameReq;
        mongoQueryObj.userType = userTypeReq;
    }
    else if (userStatusReq && userTypeReq) {
        mongoQueryObj.userStatus = userStatusReq;
        mongoQueryObj.userType = userTypeReq;
    }
    else if (nameReq) {
        mongoQueryObj.name = nameReq;
    }
    else if (userStatusReq) {
        mongoQueryObj.userStatus = userStatusReq;
    }
    else if (userTypeReq) {
        mongoQueryObj.userType = userTypeReq;
    }


    try {
        const users = await User.find(mongoQueryObj);
        return res.status(200).send(objectConverter.userResponse(users));     // user password will also be returned in response
    } catch (err) {
        console.log(err.message);
        return res.status(500).send({
            message: "Internal error while fetching all users"
        })
    }
}


/**
 * Fetch the user based on userId
 */
exports.findUserById = async (req, res) => {
    const userIdReq = req.params.userId; // reading from req parameter
    const user = await User.find({ userId: userIdReq });
    if (user) {
        res.status(200).send(objectConverter.userResponse(user));
    } else {
        res.status(200).send({
            message: `User with id {$userIdReq} doesn't exist.`
        })
    }
}


/**
 * Update the user -- userStatus, userType
 *      -- only ADMIN is allowed to do this
 */

exports.updateUser = (req, res) => {
    try {
        const userIdReq = req.params.userId;
        const user = User.findOneAndUpdate({
            userId: userIdReq
        }, {
            name: req.body.name,
            userType: req.body.userType,
            userStatus: req.body.userStatus
        }).exec();

        res.status(200).send({
            message: "User record successfullly updated."
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send({
            message: "Internal server error while updating user."
        })
    }
}