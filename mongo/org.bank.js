const
    tableDB = 'org_bank',
    express = require('express'),
    _objectId = require('mongodb').ObjectID,
    router = express.Router();
//---------------------------------------
router
    .get('/', (req, res) => {
        req.app.db.collection(tableDB).find({}).toArray((err, data) => {
            res.json(data);
        })
    })
    .post('/', (req, res) => {
        req.app.db.collection(tableDB).insertOne(req.body, (err, data) => {
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
//---------------------------------------
module.exports = router