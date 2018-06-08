const
    tableDB = 'org_state',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
//------------------------------------------------------------
router
    .get('/department', (req, res) => {
        req.app.db.collection(tableDB).find({ dep_code: { $exists: true } }).sort({ dep_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/department/:dep_code', (req, res) => {
        req.app.db.collection(tableDB).find({ dep_code: req.params.dep_code }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/department', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/department', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).find({
            $or:
                [{
                    $and: [{ department: { $exists: true } }, { 'department._id': _id }]
                },
                { '_id': _objectId(_id) }
                ]
        }
        ).forEach(function (data) {
            if (data.department) {
                if (data.department._id == _id) {
                    data.department.dep_code = req.body.dep_code;
                    data.department.dep_name = req.body.dep_name;
                    req.app.db.collection(tableDB).save(data);
                }
            } else {
                req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(result);
                        res.end();
                    }
                });
            }
        })
    })
    //--------------------------------------------------------------------------------------
    .get('/hoze', (req, res) => {
        req.app.db.collection(tableDB).find({ hoze_code: { $exists: true } }).sort({ hoze_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/hoze/:hoze_code', (req, res) => {
        req.app.db.collection(tableDB).find({ hoze_code: req.params.hoze_code }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/hoze/find/by_dep_name/:dep_name', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [{ 'department.dep_name': req.params.dep_name }, { 'hoze_code': { $exists: true } }]
        }).sort({ hoze_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/hoze/find_by_dep_code/:dep_code', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [{ 'department.dep_code': req.params.dep_code }, { 'hoze_code': { $exists: true } }]
        }).sort({ hoze_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/hoze', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/hoze', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).find({
            $or:
                [
                    {
                        $and: [{ hoze: { $exists: true } }, { 'hoze._id': _id }]
                    },
                    { '_id': _objectId(_id) }
                ]
        }
        ).forEach(function (data) {
            if (data.hoze) {
                if (data.hoze._id == _id) {
                    data.hoze.hoze_code = req.body.hoze_code;
                    data.hoze.hoze_name = req.body.hoze_name;
                    req.app.db.collection(tableDB).save(data);
                }
            } else {
                req.app.db.collection(tableDB).update({ _id: _objectId(_id) }, req.body, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(result);
                        res.end();
                    }
                });
            }
        })
    })
    //--------------------------------------------------------------------------------------
    .get('/branch', (req, res) => {
        req.app.db.collection(tableDB).find({ branch_code: { $exists: true } }).sort({ branch_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/branch/parametric/:query', (req, res) => {
        var query = '{'+req.params.query+'}';
        req.app.db.collection(tableDB).find({
                $and:[
                    {branch_code: { $exists: true }},
                    JSON.parse(query)
                ]}).sort({ branch_code: 1 }).toArray((err, data) =>{
            res.json(data);
        })
    })
    .get('/branch/find/:branch_code', (req, res) => {
        req.app.db.collection(tableDB).find({ branch_code: req.params.branch_code }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/branch/find/:dep_code/:branch_code', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [{ branch_code: { $exists: true } }, { branch_code: req.params.branch_code }, { 'department.dep_code': req.params.dep_code }]
        }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/branch/find_by_hoze/:dep_code/:hoze_code', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [{ branch_code: { $exists: true } }, { 'hoze.hoze_code': req.params.hoze_code }, { 'department.dep_code': req.params.dep_code }]
        }).sort({ branch_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/branch/find_by_dep_name/:dep_name', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [
                { 'department.dep_name': req.params.dep_name }, { 'branch_code': { $exists: true } }]
        }).sort({ branch_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/branch/find_by_dep_code/:dep_code', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [
                { 'department.dep_code': req.params.dep_code }, { branch_code: { $exists: true } }]
        }, { fields: { branch_code: 1, branch_name: 1 } }).sort({ branch_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/branch/find_by_branch_list/:branch_list', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [
                { branch_code: { $exists: true } },
                { branch_code: { $in: req.params.branch_list.split(',') } }]
        }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/branch', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/branch', (req, res) => {
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
module.exports = router