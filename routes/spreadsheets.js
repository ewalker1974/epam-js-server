let express = require('express');
let router = express.Router();
module.exports = router;
let spreadsheetData = require('../models/spreadsheet');

let sys = require('../lib').sys;



router.get('/', function(req, res, next) {
    spreadsheetData.find({}, 'SpreadsheetName', function(err, record) {

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

router.get('/spreadsheet/:spreadsheetId', function(req, res, next) {
    spreadsheetData.findById(req.params.spreadsheetId, function(err, record) {

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



    let sheet = new spreadsheetData();
    sheet.spreadsheetName = sys.getProp(req.query, 'name');
    sheet.cols = sys.getProp(req.query, 'cols');
    sheet.rows = sys.getProp(req.query, 'rows');

    let cells = sys.getProp(req.query, 'cells');

    if (cells) {
        try {
            cells = JSON.parse(cells);
            if (cells instanceof Array) {
                sheet.cells = cells;
            }
        }
        catch (err) {

            let error = new Error();
            error.status = 500;
            error.message = 'input parameters error';
            next(error);

        }
    }




    sheet.save(function(err, savedRec) {
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


router.put('/spreadsheet/:sheetId', function(req, res, next) {

    spreadsheetData.findById(req.params.sheetId, function(err, record) {


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

            record.spreadsheetName = sys.getProp(req.query, 'name');
            record.cols = sys.getProp(req.query, 'cols');
            record.rows = sys.getProp(req.query, 'rows');

            let cells = sys.getProp(req.query, 'cells');

            if (cells) {
                try {
                    cells = JSON.parse(cells);
                    if (cells instanceof Array) {
                        record.cells = cells;
                  }
                }
                catch (err) {

                    let error = new Error();
                    error.status = 500;
                    error.message = 'input paramters error';
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

router.delete('/spreadsheet', function(req, res, next) {
    if (req.query.sheet_id !== 'undefined') {
        spreadsheetData.remove({ _id: req.query.sheet_id }, function(err, record) {
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
