const
    tableDB = 'org_branchwork',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
//------------------------------------------------------------
router
    .get('/:mah_date/:dep_code', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [
                { mah_date: +req.params.mah_date }, { dep_code: req.params.dep_code }
            ]
        }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/distinct_mah_date', (req, res) => {
        req.app.db.collection(tableDB).distinct('mah_date', (err, data) => {
            if (err) res.send(err);
            else {
                res.send(data)
                res.end();
            }
        })
    })
    .post('/', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        })
    })
    //-------------------------------------------------------------
    .get('/max_in_month_items_branch/:mah_date/:dep_code/:fldcode', (req, res) => {
        req.app.db.collection(tableDB).aggregate([
            { $match: { $and: [{ 'dep_code': req.params.dep_code }, { 'mah_date': parseInt(req.params.mah_date) }] } },
            { $unwind: "$items" },
            { $unwind: "$items.items_branch" },
            {
                $group: {
                    '_id': '$items.items_branch.fldcode',
                    'max': { $max: '$items.items_branch.amount' },
                    'field': { $push: { 'branch_code': '$items.branch_code', 'fldcode': '$items.items_branch.fldcode', 'amount': '$items.items_branch.amount' } },
                }
            }, {
                $project: {
                    _id: 1, max: 1,
                    items: {
                        $filter: {
                            input: '$field', as: 'id', cond: { $and: [{ $eq: ['$$id.amount', '$max'] }, { $eq: ['$$id.fldcode', parseInt(req.params.fldcode)] }] }
                        }
                    }
                }
            }, {
                $match: { '_id': parseInt(req.params.fldcode) }
            }

        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/min_in_month_items_branch/:mah_date/:dep_code/:fldcode', (req, res) => {
        req.app.db.collection(tableDB).aggregate([
            { $match: { $and: [{ 'dep_code': req.params.dep_code }, { 'mah_date': parseInt(req.params.mah_date) }] } },
            { $unwind: "$items" },
            { $unwind: "$items.items_branch" },
            {
                $group: {
                    '_id': '$items.items_branch.fldcode',
                    'min': { $min: '$items.items_branch.amount' },
                    'field': { $push: { 'branch_code': '$items.branch_code', 'fldcode': '$items.items_branch.fldcode', 'amount': '$items.items_branch.amount' } },
                }
            }, {
                $project: {
                    _id: 1, min: 1,
                    items: {
                        $filter: {
                            input: '$field', as: 'id', cond: { $and: [{ $eq: ['$$id.amount', '$min'] }, { $eq: ['$$id.fldcode', parseInt(req.params.fldcode)] }] }
                        }
                    }
                }
            }, {
                $match: { '_id': parseInt(req.params.fldcode) }
            }

        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/min_in_month_items_dep/:mah_date/:dep_code/:fldcode', (req, res) => {
        req.app.db.collection(tableDB).aggregate([
            { $match: { $and: [{ 'dep_code': req.params.dep_code }, { 'mah_date': parseInt(req.params.mah_date) }] } },
            { $unwind: "$items" },
            { $unwind: "$items.items_dep" },
            {
                $group: {
                    '_id': '$items.items_dep.fldcode',
                    'min': { $min: '$items.items_dep.amount' },
                    'field': { $push: { 'branch_code': '$items.branch_code', 'fldcode': '$items.items_dep.fldcode', 'amount': '$items.items_dep.amount' } },
                }
            }, {
                $project: {
                    _id: 1, min: 1,
                    items: {
                        $filter: {
                            input: '$field', as: 'id', cond: { $and: [{ $eq: ['$$id.amount', '$min'] }, { $eq: ['$$id.fldcode', parseInt(req.params.fldcode)] }] }
                        }
                    }
                }
            }, {
                $match: { '_id': parseInt(req.params.fldcode) }
            }

        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/max_in_month_items_dep/:mah_date/:dep_code/:fldcode', (req, res) => {
        req.app.db.collection(tableDB).aggregate([
            { $match: { $and: [{ 'dep_code': req.params.dep_code }, { 'mah_date': parseInt(req.params.mah_date) }] } },
            { $unwind: "$items" },
            { $unwind: "$items.items_dep" },
            {
                $group: {
                    '_id': '$items.items_dep.fldcode',
                    'max': { $max: '$items.items_dep.amount' },
                    'field': { $push: { 'branch_code': '$items.branch_code', 'fldcode': '$items.items_dep.fldcode', 'amount': '$items.items_dep.amount' } },
                }
            }, {
                $project: {
                    _id: 1, max: 1,
                    items: {
                        $filter: {
                            input: '$field', as: 'id', cond: { $and: [{ $eq: ['$$id.amount', '$max'] }, { $eq: ['$$id.fldcode', parseInt(req.params.fldcode)] }] }
                        }
                    }
                }
            }, {
                $match: { '_id': parseInt(req.params.fldcode) }
            }

        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/find_amount_by_fldcode_in_items_dep/:mah_date/:dep_code/:fldcode', (req, res) => {
        req.app.db.collection(tableDB).aggregate([
            { $match: { $and: [{ 'dep_code': req.params.dep_code }, { 'mah_date': parseInt(req.params.mah_date) }] } },
            { $unwind: "$items" },
            { $unwind: "$items.items_dep" },
            { $project: {
                    'items': { 'branch_code': '$items.branch_code', 'fldcode': '$items.items_dep.fldcode', 'amount': '$items.items_dep.amount' }
                }
            }, 
            { $match: { 'items.fldcode': parseInt(req.params.fldcode) } },
            { $sort: { 'items.amount': -1 }}
        ]).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/find_amount_by_fldcode_in_items_branch/:mah_date/:dep_code/:fldcode', (req, res) => {
        req.app.db.collection(tableDB).aggregate([
            { $match: { $and: [{ 'dep_code': req.params.dep_code }, { 'mah_date': parseInt(req.params.mah_date) }] } },
            { $unwind: "$items" },
            { $unwind: "$items.items_branch" },
            { $project: {
                    'items': { 'branch_code': '$items.branch_code', 'fldcode': '$items.items_branch.fldcode', 'amount': '$items.items_branch.amount' }
                }
            },
            { $match: { 'items.fldcode': parseInt(req.params.fldcode) } }, 
            { $sort: { 'items.amount': -1 }}
        ]).toArray((err, data) => {
                res.json(data);
            })
    })
module.exports = router