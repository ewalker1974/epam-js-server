let express = require('express');
let router = express.Router();
module.exports = router;


let graphEd = require('../models/grapheditor');

let sys = require('../lib/').sys;




router.get('/', function(req, res, next) {
    graphEd.find({}, 'graphName', function(err, record) {

        if (err) {
            let error = new Error();
            error.status = 404;
            error.message = 'record not found';
            next(error);
        }
        else {
            if (record && record.length > 0) {
                res.json(record);
            }
            else {
                let error = new Error();
                error.status = 404;
                error.message = 'record not found';
                next(error);
            }

        }

    });


});

router.get('/graph/:graphId', function(req, res, next) {
    graphEd.findById(req.params.graphId, function(err, record) {

        if (err) {
            let error = new Error();
            error.status = 404;
            error.message = 'record not found';
            next(error);
        }
        else {
            if (record) {
                res.json(record);
            }
            else {
                let error = new Error();
                error.status = 404;
                error.message = 'record not found';
                next(error);
            }

        }

    });


});




router.post('/', function(req, res, next) {



    let graph = new graphEd();
    graph.graphName = sys.getProp(req.query, 'name');

    let objects = sys.getProp(req.query, 'objects');
    if (objects) {
        try {
            let objTest = JSON.parse(objects);
            if (objTest instanceof Array) {
                graph.objects = objects;

            }
        }
        catch (err) {

            let error = new Error();
            error.status = 500;
            error.message = 'error during the save';
            next(error);

        }
    }


    graph.save(function(err, savedRec) {
        if (err) {
            let error = new Error();
            error.status = 500;
            error.message = 'error during the save';
            next(error);
        }
        else {
            res.json({ status: 'ok', record_id: savedRec.id });
        }
    });


});


router.put('/graph/:graphId', function(req, res, next) {

    graphEd.findById(req.params.graphId, function(err, record) {


        if (err) {
            let error = new Error();
            error.status = 500;
            error.message = 'error during the update';
            next(error);

        }
        else {

            if (!record) {
                let error = new Error();
                error.status = 404;
                error.message = 'record not found';
                next(error);
                return;
            }

            record.graphName = sys.getProp(req.query, 'name');



            let objects = sys.getProp(req.query, 'objects');
            if (objects) {
                try {
                    let objTest = JSON.parse(objects);
                    if (objTest instanceof Array) {
                        record.objects = objects;

                    }
                }
                catch (err) {

                    let error = new Error();
                    error.status = 500;
                    error.message = 'bad input params';
                    next(error);

                }
            }

            record.save(function(err, savedRec) {
                if (err) {
                    let error = new Error();
                    error.status = 500;
                    error.message = 'error during the update';
                    next(error);
                }
                else {
                    res.json({ status: 'ok', record_id: savedRec.id });
                }
            });
        }

    });


});

router.delete('/graph', function(req, res, next) {
    if (req.query.graph_id !== 'undefined') {
        graphEd.remove({ _id: req.query.graph_id }, function(err, record) {
            if (err) {
                let error = new Error();
                error.status = 500;
                error.message = 'error during the delete';
                next(error);
            }
            else {
                res.json({ status: 'ok', record_id: req.query.graph_id });
            }
        });
    }
});




module.exports = router;
