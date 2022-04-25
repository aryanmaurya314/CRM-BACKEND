const ticketController = require("../controllers/ticket.controller");
const { authJwt } = require("../middlewares");



module.exports = (app) => {
    // api to create ticket
    app.post("/crm/api/v1/tickets", [authJwt.verifyToken], ticketController.createTicket);

    // route to GET all the tickets
    app.get("/crm/api/v1/tickets", [authJwt.verifyToken], ticketController.getAllTickets);
    // route to GET ticket by id
    app.get("/crm/api/v1/tickets/:id", [authJwt.verifyToken], ticketController.getOneTicket);
    // route to PUT ticket by 
    app.put("/crm/api/v1/tickets/:id", [authJwt.verifyToken], ticketController.updateTicket);
}