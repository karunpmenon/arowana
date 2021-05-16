var logicController = require('../models/logic_model.js')
var Joi = require("@hapi/joi")
let routes = []

routes.push({
    method: 'POST',
    path: '/generate/ticket',
    options:{
        handler: logicController.creation,
        description: 'API to yield new ticket',
        notes: 'POST API which helps to create new movie ticket',
        tags: ['api','POST']   
    }
})

routes.push({
    method: 'GET',
    path: '/getalldocs',
    options:{
        handler: logicController.returnAlldocs,
        description: 'API to return all docs in the collection',
        notes: 'API to return all docs in the collection',
        tags: ['api','GET'],
        auth: 'simple',
    }
})

routes.push({
    method: 'GET',
    path: '/get/summaryvisits',
    options:{
        handler: logicController.summary_visits,
        description: 'API to return #customer in each month',
        notes: 'API to return #customer in each month',
        tags: ['api','GET']   
    }
})

routes.push({
    method: 'GET',
    path: '/get/totalamount',
    options:{
        handler: logicController.amountviabooking,
        description: 'API to return total amount received in each month',
        notes: 'API to return total amount received in each month',
        tags: ['api','GET']   
    }
})

routes.push({
    method: 'POST',
    path: '/finddocs',
    options:{
        handler: logicController.find,
        description: 'find docs based on filter',
        notes: 'find docs based on filter',
        tags: ['api','POST']
    }
})

routes.push({
    method: 'DELETE',
    path: '/deletewithFilter',
    options:{
        handler: logicController.deletewithFilter,
        description: 'delete docs based on filter',
        notes:  'delete docs based on filter',
        tags: ['api','DELETE']
    }
})

routes.push({
    method: 'PUT',
    path: '/updatewithFilter',
    options:{
        handler: logicController.updatewithFilter,
        description: 'update docs based on filter',
        notes:  'update docs based on filter',
        tags: ['api','PUT']   
    }
})


module.exports = routes