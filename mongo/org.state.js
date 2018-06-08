const
    tableDB = 'org_state',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
//---------------------------------------
router
    .get('/ostan', (req, res) => {
        req.app.db.collection(tableDB).find({ ostan_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/ostan/validate_ostan/:ostan_code/:ostan_name', (req, res) => {
        req.app.db.collection(tableDB).find(
            { $or: [{ ostan_code: req.params.ostan_code }, { ostan_name: req.params.ostan_name }] }).toArray((err, data) => {
                res.json(data);
            });
    })
    .post('/ostan', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/ostan', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).find({
            $or:
                [
                    {
                        $and: [{ ostan: { $exists: true } }, { 'ostan._id': _id }]
                    },
                    { '_id': _objectId(_id) }
                ]
        }
        ).forEach(function (data) {
            if (data.ostan) {
                if (data.ostan._id == _id) {
                    data.ostan.ostan_code = req.body.ostan_code;
                    data.ostan.ostan_name = req.body.ostan_name;
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
//---------------------------------------
router
    .get('/tablecode', (req, res) => {
        req.app.db.collection(tableDB).find({ row_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/tablecode/find_by_table_name/:table_id', (req, res) => {
        req.app.db.collection(tableDB).find({ $and: [{ row_code: { $exists: true } }, { table_id: req.params.table_id }] }).sort({ row_code: 1 }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/tablecode', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/tablecode', (req, res) => {
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
//---------------------------------------    
router
    .get('/city', (req, res) => {
        req.app.db.collection(tableDB).find({ ostan_code: { $exists: false } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/city/find/by_ostan_name/:ostan_name', (req, res) => {
        req.app.db.collection(tableDB).find({
            $and: [{ 'ostan.ostan_name': req.params.ostan_name }, { 'city_code': { $exists: true } }]
        }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/city', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/city', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).find({
            $or:
                [
                    {
                        $and: [{ city: { $exists: true } }, { 'city._id': _id }]
                    },
                    { '_id': _objectId(_id) }
                ]
        }
        ).forEach(function (data) {
            if (data.city) {
                if (data.city._id == _id) {
                    data.city.city_code = req.body.city_code;
                    data.city.city_name = req.body.city_name;
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
//---------------------------------------
router
    .get('/deptype', (req, res) => {
        req.app.db.collection(tableDB).find({ deptype_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/deptype', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/deptype', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).find({
            $or: [
                {
                    $and: [{ 'deptype': { $exists: true } }, { 'deptype._id': _id }]
                },
                { '_id': _objectId(_id) }
            ]
        }).forEach(function (data) {
            if (data.deptype) {
                if (data._id == _id) {
                    data.deptype.deptype_code = req.body.deptype_code;
                    data.deptype.deptype_name = req.body.deptype_name;
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
//---------------------------------------
router
    .get('/equipment', (req, res) => {
        req.app.db.collection(tableDB).find({ equipment_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/equipment', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/equipment', (req, res) => {
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
//---------------------------------------
router
    .get('/circletype', (req, res) => {
        req.app.db.collection(tableDB).find({ circletype_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/circletype', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/circletype', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;
        req.app.db.collection(tableDB).find({
            $or: [
                {
                    $and: [{ 'circlelist': { $exists: true } }, { 'circlelist._id': _id }]
                },
                { '_id': _objectId(_id) }
            ]
        }).forEach(function (data) {
            if (data.circlelist) {
                data.circlelist.forEach(function (dc) {
                    if (dc._id == _id) {
                        dc.circletype_code = req.body.circletype_code;
                        dc.circletype_name = req.body.circletype_name;
                        dc.last_update_long = req.body.last_update_long;
                        dc.last_update_short = req.body.last_update_short;
                        req.app.db.collection(tableDB).save(data);
                    }
                })
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
//---------------------------------------
router
    .get('/posttype', (req, res) => {
        req.app.db.collection(tableDB).find({ posttype_code: { $exists: true } }).toArray((err, data) => {
            res.json(data);
        })
    })
    .get('/posttype/:posttype_group', (req, res) => {
        req.app.db.collection(tableDB).find({ $and: [{ posttype_group: req.params.posttype_group }, { posttype_code: { $exists: true } }] }).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/posttype', (req, res) => {
        req.app.db.collection(tableDB).insert(req.body, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.send(data);
                res.end();
            }
        });
    })
    .put('/posttype', (req, res) => {
        let _id = req.body._id;
        delete req.body._id;

        req.app.db.collection(tableDB).find({
            $or:
                [
                    {
                        $and: [{ 'circlelist': { $exists: true } },
                        { 'circlelist.personel.posttype._id': _id }]
                    },
                    { '_id': _objectId(_id) }
                ]
        }).forEach(function (data) {
            if (data.circlelist) {
                data.circlelist.forEach(function (c) {
                    c.personel.forEach(function (p) {
                        if (p.posttype._id == _id) {
                            p.posttype.posttype_code = req.body.posttype_code;
                            p.posttype.posttype_name = req.body.posttype_name;
                            p.posttype.last_update_long = req.body.last_update_long;
                            p.posttype.last_update_short = req.body.last_update_short;
                            p.posttype.posttype_group = req.body.posttype_group;
                        }
                    })
                })
                req.app.db.collection(tableDB).save(data)
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
module.exports = router