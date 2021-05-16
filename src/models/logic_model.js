// import { model } from "mongoose";

var dbops = require('../db/dbconnect.js')
var ticketSchema = require('../schema/ticketSchema.js')

var model = {}

//return today date in string
var today = function (format) {
    var now = new Date();
    var dd = ("0" + now.getDate()).slice(-2);
    var mm = ("0" + (now.getMonth() + 1)).slice(-2);
    var yyyy = now.getFullYear();
    switch (format) {
        case "yyyy-mm-dd":
            return yyyy + "-" + mm + "-" + dd;
        case "yyyy_mm_dd":
            return yyyy + "_" + mm + "_" + dd;
        case "dd-mm-yyyy":
            return dd + "-" + mm + "-" + yyyy;
        case "dd_mm_yyyy":
            return dd + "_" + mm + "_" + yyyy;
        case "yyyy_mm":
            return yyyy + "_" + mm;
        case "yyyy-mm":
            return yyyy + "-" + mm;
        default:
            return false;
    }
}

// check if a date string is valid,
// refactor and use moment for checking valid dates
var isValidDate = function (format, dateString) {

    if (typeof dateString !== "string" || typeof format !== "string" || dateString.length === 0 || format.length === 0) {
        return false;
    }

    format = format.toLowerCase();

    var reg1 = /\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/;
    var reg2 = /\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])/;
    var reg3 = /\d{4}_(0[1-9]|1[0-2])_(0[1-9]|[1-2][0-9]|3[0-1])/;
    var reg4 = /(0[1-9]|[1-2][1-9]|3[0-1])-(0[1-9]|1[0-2])-\d{4}/;
    var reg5 = /(0[1-9]|[1-2][1-9]|3[0-1])\/(0[1-9]|1[0-2])\/\d{4}/;
    var reg6 = /(0[1-9]|[1-2][1-9]|3[0-1])_(0[1-9]|1[0-2])_\d{4}/;
    var reg7 = /\d{4}-(0[1-9]|1[0-2])/;

    switch (format) {
        case "yyyy-mm-dd":

            return reg1.test(dateString);

        case "yyyy/mm/dd":

            return reg2.test(dateString);

        case "yyyy_mm_dd":
            return reg3.test(dateString);


        case "dd-mm-yyyy":
            return reg4.test(dateString);


        case "dd/mm/yyyy":
            return reg5.test(dateString);


        case "dd_mm_yyyy":
            return reg6.test(dateString);

        case "yyyy-mm":
            return reg7.test(dateString);

        default:
            return false;
    }
}
//converts a string  to javascript date object and returns it
var strToDate = function (strDate) {

    let d = new Date(strDate);

    if (Object.prototype.toString.call(d) == "[object Date]") {
        if (!isNaN(d)) {
            return d;
        } else {
            throw new TypeError("Invalid date string");
        }
    } else {
        throw new TypeError("Invalid date string");
    }
};

// compares two dates, input can be in form of string or date object

var compareDates = function (date1, operator, date2) {
    // check if it is a date object

    try {
        if (Object.prototype.toString.call(date1) !== '[object Date]') {

            // check if it is a valid date string
            if (typeof date1 === "string" && (isValidDate("yyyy-mm-dd", date1) || isValidDate("dd-mm-yyyy", date1))) {
                date1 = strToDate(date1);
            } else {
                console.log("helo");
                throw new Error("Invalid first date argument");
            }
        }

        // check if it is a date object
        if (Object.prototype.toString.call(date2) !== '[object Date]') {
            // check if it is a valid date string
            if (typeof date2 === "string" && (isValidDate("yyyy-mm-dd", date2) || isValidDate("dd-mm-yyyy", date2))) {
                date2 = strToDate(date2);
            } else {

                throw new Error("Invalid second date argument");
            }
        }

        var result = false;
        switch (operator) {
            case "eq":
                result = (date1.getTime() === date2.getTime()) ? true : false;
                break;
            case "lt":
                result = (date1.getTime() < date2.getTime()) ? true : false;
                break;
            case "gt":
                result = (date1.getTime() > date2.getTime()) ? true : false;
                break;
            case "le":
                result = (date1.getTime() <= date2.getTime()) ? true : false;
                break;
            case "ge":
                result = (date1.getTime() >= date2.getTime()) ? true : false;
                break;
            default:
                throw Error("Invalid operator parameter");

        }

        return result;
    } catch (e) {
        return false;
    }

}

//return month from  date in string
var getmonthfromdate = function (date) {
    var now = new Date(date);
    var dd = ("0" + now.getDate()).slice(-2);
    var mm = ("0" + (now.getMonth() + 1)).slice(-2);
    return mm
}


model.creation = async function (req, res) {
    var creationdate = new Date().toISOString()

    let filter = {}
    req.payload.customerName ? filter.customerName = req.payload.customerName : null
    req.payload.performanceTitle ? filter.performanceTitle = req.payload.performanceTitle : null
    req.payload.performanceTime ? filter.performanceTime = req.payload.performanceTime : null
    req.payload.ticketPrice ? filter.ticketPrice = req.payload.ticketPrice : null
    req.payload.theater ? filter.theater = req.payload.theater : null

    if (Object.keys(filter).length < 5) {
        return "missing field"
    }

    const eachobj = new ticketSchema(filter);

    dbops.save(eachobj)
    return {
        "success": true
    }
}

model.find = function (req, res) {
    let filter = {}
    req.payload.customerName ? filter.customerName = req.payload.customerName : null
    req.payload.performanceTitle ? filter.performanceTitle = req.payload.performanceTitle : null
    req.payload.performanceTime ? filter.performanceTime = req.payload.performanceTime : null
    req.payload.ticketPrice ? filter.ticketPrice = req.payload.ticketPrice : null
    req.payload.creationDate ? filter.creationDate = req.payload.creationDate : null

    if (Object.keys(filter).length == 0) {
        return "req filter"
    }
    return dbops.find(ticketSchema, filter)
}

model.returnAlldocs = function (req, res) {
    // console.log(res)
    // let authorizedTo = ['admin']
    let isAuthorized = res.request.isAuthorized ? res.request.isAuthorized : false
    console.log(res.request)
    if(!isAuthorized){
        const data = {
            "sucess":false,
            "message":"you are not authorized to use this service"
        }
        return res.response(data).code(401)
    }
    return dbops.returnAlldocs(ticketSchema)
}

model.deletewithFilter = function (req, res) {
    let filter = {}
    req.payload.customerName ? filter.customerName = req.payload.customerName : null
    req.payload.performanceTitle ? filter.performanceTitle = req.payload.performanceTitle : null
    req.payload.performanceTime ? filter.performanceTime = req.payload.performanceTime : null
    req.payload.ticketPrice ? filter.ticketPrice = req.payload.ticketPrice : null
    req.payload.creationDate ? filter.creationDate = req.payload.creationDate : null

    if (Object.keys(filter).length == 0) {
        return "req filter"
    }
    return dbops.deletewithFilter(ticketSchema, filter)
}

model.summary_visits = async function (req, res) {
    try {
        if (req.query.method == "aggregation") {
            let filter = {}
            req.query.toDate ? filter.toDate = req.query.toDate : null
            req.query.fromDate ? filter.fromDate = req.query.fromDate : null
            req.query.performanceTitle ? filter.performanceTitle = req.query.performanceTitle : null
            req.query.theater ? filter.theater = req.query.theater : null

            if (Object.keys(filter).length < 4) {
                return {
                    "success": false,
                    "result": "req mandatory params"
                }
            }
            return dbops.aggregation(ticketSchema, filter)
        } else {
            let filter = {}
            req.query.toDate ? filter.toDate = req.query.toDate : null
            req.query.fromDate ? filter.fromDate = req.query.fromDate : null
            req.query.performanceTitle ? filter.performanceTitle = req.query.performanceTitle : null
            req.query.theater ? filter.theater = req.query.theater : null
            let alldocs = await dbops.returnAlldocs(ticketSchema)

            let monthwisedata = {}
            const restricteddocs = alldocs.map(function filterlist(eachDoc) {
                if ((eachDoc['theater'] == filter.theater) && !(compareDates(eachDoc['performanceTime'], "gt", filter.toDate)) && !(compareDates(eachDoc['performanceTime'], "lt", filter.fromDate)) && eachDoc['performanceTitle'] == filter.performanceTitle) {
                    // monthwisedata
                    monthname = dbops.getmonth_inwords(getmonthfromdate(eachDoc['performanceTime']))
                    if (!monthwisedata[monthname]) {
                        monthwisedata[monthname] = 0
                    }
                    monthwisedata[monthname] += 1
                    return eachDoc
                } else {
                    return false
                }
            });

            let resp = []
            for (let eachmonthdata in monthwisedata) {
                resp.push({
                    "month": eachmonthdata,
                    "summaryvisits": monthwisedata[eachmonthdata]
                })
            }
            return {
                "success": true,
                "result": resp,
                "message": "from js logic",
                "filterApplied": filter
            }
        }

    } catch (err) {
        return {
            "success": false,
            "result": [],
            "message": "some error",
            "error": err,
            "filterApplied": filter
        }
    }
}

model.amountviabooking = async function (req, res) {
    try {

        if (req.query.method == "aggregation") {
            let filter = {}
            req.query.toDate ? filter.toDate = req.query.toDate : null
            req.query.fromDate ? filter.fromDate = req.query.fromDate : null
            req.query.performanceTitle ? filter.performanceTitle = req.query.performanceTitle : null
            req.query.theater ? filter.theater = req.query.theater : null
            return dbops.totalamountviabooking(ticketSchema, filter)
        } else {
            let filter = {}
            req.query.toDate ? filter.toDate = req.query.toDate : null
            req.query.fromDate ? filter.fromDate = req.query.fromDate : null
            req.query.performanceTitle ? filter.performanceTitle = req.query.performanceTitle : null
            req.query.theater ? filter.theater = req.query.theater : null
            let alldocs = await dbops.returnAlldocs(ticketSchema)

            let monthwisedata = {}
            const restricteddocs = alldocs.map(function filterlist(eachDoc) {
                if ((eachDoc['theater'] == filter.theater) && !(compareDates(eachDoc['performanceTime'], "gt", filter.toDate)) && !(compareDates(eachDoc['performanceTime'], "lt", filter.fromDate)) && eachDoc['performanceTitle'] == filter.performanceTitle) {
                    // monthwisedata
                    monthname = dbops.getmonth_inwords(getmonthfromdate(eachDoc['performanceTime']))
                    if (!monthwisedata[monthname]) {
                        monthwisedata[monthname] = 0
                    }
                    monthwisedata[monthname] += eachDoc['ticketPrice']
                    return eachDoc
                } else {
                    return false
                }
            });

            let resp = []
            for (let eachmonthdata in monthwisedata) {
                resp.push({
                    "month": eachmonthdata,
                    "profit": monthwisedata[eachmonthdata]
                })
            }
            return {
                "success": true,
                "result": resp,
                "message": "from js logic",
                "filterApplied": filter
            }
        }

    } catch (err) {
        return {
            "success": false,
            "result": [],
            "message": "some error",
            "error": err,
            "filterApplied": filter
        }
    }
}

model.updatewithFilter = function (req, res) {
    let filter = {}
    req.payload.customerName ? filter.customerName = req.payload.customerName : null
    req.payload.performanceTitle ? filter.performanceTitle = req.payload.performanceTitle : null
    req.payload.performanceTime ? filter.performanceTime = req.payload.performanceTime : null
    req.payload.ticketPrice ? filter.ticketPrice = req.payload.ticketPrice : null
    req.payload.creationDate ? filter.creationDate = req.payload.creationDate : null

    let updateField = req.payload.updateField
    let updateValue = req.payload.updateValue

    if(!updateField || !updateValue){
        return {"success":false,"message":"update field and update value should be passed"}
    }

    if (Object.keys(filter).length <= 1) {
        return "req filter"
    }
    let updatefilter = {}
    updatefilter[updateField] = updateValue
    return dbops.updatewithFilter(ticketSchema, filter,updatefilter)
}


module.exports = model