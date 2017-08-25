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
    func.graphName = sys.getProp(req.body, 'name');
    func.graphFunction = sys.getProp(req.body, 'graph_function');
    func.minX = sys.getProp(req.body, 'min_x');
    func.maxX = sys.getProp(req.body, 'max_x');
    func.graphColor = sys.getProp(req.body, 'color');

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
            
            record.graphName = sys.getProp(req.body, 'name');
            record.graphFunction = sys.getProp(req.body, 'graph_function');
            record.minX = sys.getProp(req.body, 'min_x');
            record.maxX = sys.getProp(req.body, 'max_x');
            record.graphColor = sys.getProp(req.body, 'color');
            
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
    if (req.body.function_id !== 'undefined') {
        funcData.remove({ _id: req.body.function_id }, function(err, record) {
            if (err) {
                let error = new Error();
                error.status = 500;
                error.message = 'error during delete';
                next(error);
            }
            else {
                res.json({ status: 'ok', record_id: req.body.graph_id });
            }
        });
    }
});




module.exports = router;