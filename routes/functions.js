let express = require('express');
let router = express.Router();
module.exports = router;

let funcData = require('../models/functiongraph');

let sys = require('../lib/').sys;



router.get('/', function(req, res, next) {
    funcData.find({}, function(err, record) {

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

router.get('/function/:graphId', function(req, res, next) {
    funcData.findById(req.params.graphId , function(err, record) {

console.log(record.toString());
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



    let func = new funcData();
    func.graphName = sys.getProp(req.query, 'name');
    func.graphFunction = sys.getProp(req.query, 'graph_function');
    func.minX = sys.getProp(req.query, 'min_x');
    func.maxX = sys.getProp(req.query, 'max_x');
    func.graphColor = sys.getProp(req.query, 'color');

    func.save(function(err, savedRec) {
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


router.put('/function/:graphId', function(req, res, next) {

    funcData.findById(req.params.graphId, function(err, record) {


        if (err) {
            let error = new Error();
            error.status = 500;
            error.message = 'error during update';
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
            record.graphFunction = sys.getProp(req.query, 'graph_function');
            record.minX = sys.getProp(req.query, 'min_x');
            record.maxX = sys.getProp(req.query, 'max_x');
            record.graphColor = sys.getProp(req.query, 'color');
            
            record.save(function(err, savedRec) {
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
        }

    });


});

router.delete('/function', function(req, res, next) {
    if (req.query.function_id !== 'undefined') {
        funcData.remove({ _id: req.query.function_id }, function(err, record) {
            if (err) {
                let error = new Error();
                error.status = 500;
                error.message = 'error during delete';
                next(error);
            }
            else {
                res.json({ status: 'ok', record_id: req.query.graph_id });
            }
        });
    }
});




module.exports = router;