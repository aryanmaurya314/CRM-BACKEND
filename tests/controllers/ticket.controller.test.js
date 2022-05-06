/**
 * This file will be used for writting the test code for ticket controller
 */

const ticketController = require("../../controllers/ticket.controller");
const { mockRequest, mockResponse } = require("../interceptor");
const User = require("../../models/user.model");
const Ticket = require("../../models/ticket.model");
const client = require("../../utils/notificationServiceClient").client;

const ticketRequestBody = {
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    reporter: 1
}


const createdTicketBody = {
    _id: "12dasfa56y",
    title: "Test",
    ticketPriority: 4,
    description: "Test",
    status: "OPEN",
    reporter: 1,
    assignee: 1,
    createdAt: Date.now(),
    updatedAt: Date.now()
}

const savedUserObj = {
    name: "Test",
    userId: 1,
    email: "test@relevel.com",
    password: "test123",
    userType: "ADMIN",
    ticketsCreated: [],
    ticketsAssigned: [],
    save: jest.fn()    // mock it
}
/**
 * Test the create ticket functionality
 */
describe("Testing create ticket feature", () => {
    it("Unit test the ability to successfully create a new ticket", async () => {
        /**
         * External entities we depend on
         * 1. req, res
         */
        const req = mockRequest();
        const res = mockResponse();
        /**
         * If I have to call the create ticket method this req, needs to have the body object
         */
        req.body = ticketRequestBody;
        req.userId = 1;     // My request is ready now

        /**
         * Mocking and spying User findOne method
         */
        const userSpy = jest.spyOn(User, 'findOne').mockReturnValue(Promise.resolve(savedUserObj));

        /**
         * mOCK Ticket creation also
         */
        const ticketSpy = jest.spyOn(Ticket, 'create').mockImplementation((ticketRequestBody) => Promise.resolve(createdTicketBody));

        // Mock the email client
        const clientSpy = jest.spyOn(client, 'post').mockImplementation((url, args, cb) => cb('Test', null));

        // Execution of the test
        await ticketController.createTicket(req, res);

        // Validation
        expect(userSpy).toHaveBeenCalled();
        expect(ticketSpy).toHaveBeenCalled();
        expect(clientSpy).toHaveBeenCalled();

    });
});