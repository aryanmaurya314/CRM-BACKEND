const User = require("../models/user.model");
const constants = require("../utils/constants");
const objectConverter = require("../utils/objectConverter");
const Ticket = require("../models/ticket.model");
const notificationServiceClient = require("../utils/notificationServiceClient");
/**
 * create a ticket
 *      v1-- anyone should be able to create the ticket
 */




exports.createTicket = async (req, res) => {
    // how ticket is being 
    const ticketObj = {
        title: req.body.title,
        description: req.body.description,
        ticketPriority: req.body.ticketPriority,
        reporter: req.userId,
        // status: req.body.status
    }
    // if any engineer is available
    try {
        const engineer = await User.findOne({
            userType: constants.userTypes.engineer,
            userStatus: constants.userStatus.approved
        });
        if (engineer) {
            ticketObj.assignee = engineer.userId;
        }
        // ticket resource to be stored in DB

        const ticket = await Ticket.create(ticketObj);
        // console.log("Ticket ", ticket);
        // we should update the customer and engineer
        //--->> find the customer
        if (ticket) {
            const user = await User.findOne({
                userId: req.userId
            })
            user.ticketsCreated.push(ticket._id);
            await user.save();
            // find the engineer update its feild
            engineer.ticketsAssigned.push(ticket._id);
            await engineer.save();
        

        /**
         * Right place to send the email
         * 
         * call the notification service to send the email
         * 
         * I need to have a client to call the exteranal service
         */
        notificationServiceClient(ticket._id, "Created new ticket: "+ticket._id, ticket.description, user.email+","+engineer.email, user.email);


        // return the response
        res.status(200).send(objectConverter.ticketResponse(ticket));
        }
    } catch (err) {
        console.log("Error while creating ticket. ", err.message);
        res.status(500).send({
            message: "Some internal error while creating new ticket."
        })
    }
}

/**
 * API to fetch all the tickets
 * Allow user to user filter status == OPEN CLOSED BLOCKED
 * Depending upon user I need to return different list of tickets
 *  1. ADMIN ---> return all tickets
 *  2. ENGINEER --> All the tickets either created or assigned to him/her
 *  3. CUSTOMER --> all the tickets created by him/her
 */

exports.getAllTickets = async (req, res) => {
    const queryObj = {};
    // Allow user to user filter status == OPEN CLOSED BLOCKED
    if (req.query.status != undefined) {
        queryObj.status = req.query.status;
    }
    // find the user from DB to get created tickets
    const user = await User.findOne({ userId: req.userId });
    if (user.userType == constants.userTypes.admin) {
        // returns all the tickets 
        // No need to do anything in the query object
    }
    else if (user.userType == constants.userTypes.customer) {
        // check if user didn't have created any tickrt
        if (user.ticketsCreated == null || user.ticketsCreated.length == 0) {
            return res.status(200).send({
                message: "No tickets created by you with userId " + req.userId
            })
        }
        // API to fetch all the tickets created
        queryObj._id = {
            $in: user.ticketsCreated        // array of tickets id 
        }
    } else {
        queryObj._id = {
            $in: user.ticketsCreated        // array of tickets id 
        }
        queryObj.assignee = req.userId;
    }

    const tickets = await Ticket.find(queryObj);
    return res.status(200).send(objectConverter.ticketListResponse(tickets));
}

// API to fetch ticket based on id

exports.getOneTicket = async (req, res) => {
    const ticket = await Ticket.findOne({
        _id: req.params.id
    });
    res.status(200).send(objectConverter.ticketResponse(ticket));
}

// API to update the ticket
exports.updateTicket = async (req, res) => {

    // check if the ticket exists
    const ticket = await Ticket.findOne({
        _id: req.params.id
    });

    if (ticket == null) {
        return res.status(200).send({
            message: "Ticket doesn't exist."
        })
    }
    // only the ticket user is allowed to update the ticket of saved tickets
    const user = User.findOne({
        userId: req.userId
    });
    // if the ticket is not assigned to any engineer , any engineer can self assign themselves the given ticket
    if (ticket.assignee == undefined) {
        ticket.assignee = req.userId;
    }

    if ((user.ticketsCreated == undefined || !user.ticketsCreated.includes(req.params.id)) && !(user.userType == constants.userTypes.admin) && !(ticket.assignee == req.userId)) {
        return res.status(403).send({
            message: "Only owner of ticket/engineer assigned/admin is allowed to update the ticket"
        })
    }
    // update the attributes of saved tickets  
    ticket.title = req.body.title != undefined ? req.body.title : ticket.title;

    ticket.description = req.body.description != undefined ? req.body.description : ticket.description;

    ticket.ticketPriority = req.body.ticketPriority != undefined ? req.body.ticketPriority : ticket.ticketPriority;

    ticket.status = req.body.status != undefined ? req.body.status : ticket.status

    // ability to re-assign the ticket
    if (user.userType == constants.userTypes.admin) {
        ticket.assignee = req.body.assignee != undefined ? req.body.assignee : ticket.assignee;
    }

    // save the changed ticket
    const updatedTicket = await ticket.save();

    //
    notificationServiceClient(ticket._id, "Updated new ticket: "+ticket._id, ticket.description, user.email+","+engineer.email, user.email);



    
    // return the updated ticket
    return res.status(200).send(objectConverter.ticketResponse(updatedTicket));
}