const mongoose = require('mongoose')
mongoose.connect("mongodb://db:27017/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection


db.on('error', (error) => {
    console.log("DB connection failure \n ", error)
})

var init = () => {
    // const kittySchema = new mongoose.Schema({
    //     name: String
    // });
    // let test_model = mongoose.model('testcollection',kittySchema)

    // const eachobj = new test_model({ name: 'test_name' });

    // eachobj.save(function (err, eachobj) {
    //     if (err) return console.error(err);
    //     console.log(eachobj.name)
    // });

    // let da = test_model.find({ name: 'test_name' }, function(err,data){
    //     console.log("data \n ",data,data.length)
    // });


    // test_model.deleteOne({ name: 'test_name' }, function (err) {
    //     if (err) return console.error(err);
    // });

    // test_model.deleteMany({ name: 'test_name' }, function (err) {
    //     if (err) return console.error(err);
    // });


}

db.once('open', () => {
    console.log("DB connection successful")
})


var dboperations = {}

dboperations.save = function (eachobj) {
    return eachobj.save(function (err, eachobj) {
        if (!err) {
            return {
                success: false,
                err: err
            }
        }
        return {
            success: true
        }
    });
}

dboperations.find = function (eachobj, searchquery) {
    return eachobj.find(searchquery, function (err, data) {
        if (!err) {
            return data
        }
        return err
    });
}

dboperations.returnAlldocs = function (eachobj) {
    return eachobj.find(function (err, data) {
        if (!err) {
            return data
        }
        return err
    });
}


dboperations.deletewithFilter = function (eachobj, filter) {
    return eachobj.deleteMany(filter, function (err) {
        if (err)
        {
            console.error(err);
            return {success: false}
        }
        else
            return {
                success: true
            }
    });
}


dboperations.updatewithFilter = function (eachobj, filter,update) {
    return eachobj.findOneAndUpdate(filter,update, {new:true} );
}

dboperations.getmonth_inwords = function(index){
    let months = [
        "January ",
        "February",
        "March ",
        "April ",
        "May",
        "June",
        "July",
        "August ",
        "September",
        "October",
        "November ",
        "December ",
    ]
    return months[index-1]
}

dboperations.aggregation = async function (model, filter) {
    // const agg = model.aggregate([{ $match: { ticketPrice: { $gte: 150 } } }]);

    var toDate = new Date(filter.toDate)
    var fromDate = new Date(filter.fromDate)

    const agg = model.aggregate([{
            //filter
            $match: {
                $and: [{
                        "performanceTime": {
                            '$gte': fromDate,
                            '$lte': toDate
                        }
                    },
                    {
                        performanceTitle: filter.performanceTitle
                    },
                    {
                        theater: filter.theater
                    }
                ]
            }
        },
        {
            $group: { //inorder to group by month
                _id: {
                    $month: "$performanceTime"
                },
                summaryvisits: {
                    $sum: 1
                }
            }
        },
        {
            $project: { //inorder to source the data as we want
                'month': `$_id`,
                'summaryvisits': 1,
                "_id": 0
            }
        }
    ]);

    let docs = []
    
    for await (const doc of agg) {
        doc['month'] = this.getmonth_inwords(doc['month'])
        docs.push(doc)
    }
    return {"success":true,"result":docs,"message":"from DB aggregation","filterApplied":filter}
}


dboperations.totalamountviabooking = async function (model, filter) {
    var toDate = new Date(filter.toDate)
    var fromDate = new Date(filter.fromDate)

    const agg = model.aggregate([{
            //filter
            $match: {
                $and: [{
                    "performanceTime": {
                        '$gte': fromDate,
                        '$lte': toDate
                    }
                },
                {
                    performanceTitle: filter.performanceTitle
                },
                {
                    theater: filter.theater
                }
            ]
            }
        },
        {
            $group: { //inorder to group by month
                _id: {
                    $month: "$performanceTime"
                },
                totaldocs: {
                    $sum: "$ticketPrice"
                },
            }
        },
        {
            $project: { //inorder to source the data as we want
                'month': `$_id`,
                'profit': `$totaldocs`,
                "_id": 0
            }
        }
    ]);

    let docs = []

    for await (const doc of agg) {
        doc['month'] = this.getmonth_inwords(doc['month'])
        docs.push(doc)
    }
    
    return {"success":true,"result":docs,"message":"from DB aggregation","filterApplied":filter}

}


module.exports = dboperations