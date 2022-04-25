// --> This file will hold the schema for the user resource.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    /**
     * name, userId, password, email, createdAt, updatedAt
     * userType[ ADMIN | ENGINEER | CUSTOMER ]
     * userStatus [ APPROVED | PENDING | REJECTED ]
     */
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: 10
    },
    createdAt: {
        type: Date,
        default: () => {
            return Date.now();
        },
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        }
    },
    userType: {
            type: String,
            required: true,
            default: "CUSTOMER"
    },
    userStatus: {
            type: String,
            required: true,
            default: "APPROVED"
    },
    ticketsCreated: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    },
    ticketsAssigned: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket"
    }
});


module.exports = mongoose.model("User", userSchema)