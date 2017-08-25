let express = require('express');
let router = express.Router();

let test = require('../models/test');


/* GET users listing. */
router.get('/:user/:test', function(req, res, next) {
    test.find({ username: req.params.user, testId: req.params.test }, function(err, record) {
       
        
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

router.post('/', function(req, res, next) {

    if (typeof req.body.user !== 'undefined' && typeof req.body.test !== 'undefined') {
        let rec = new test;
        rec.username = req.body.user;
        rec.testId = req.body.test;

        if (typeof req.body.question_nr !== 'undefined' && typeof req.body.is_correct !== 'undefined') {
            let testItem = { questionNr: req.body.question_nr, isCorrect: req.body.is_correct };

            rec.questions = [];
            rec.questions.push(testItem);
        }

        rec.save(function(err, savedRec) {
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


router.patch('/test/:testId', function(req, res, next) {

    test.findById(req.params.testId, function(err, record) {


        if (err) {
            let error = new Error();
            error.status = 500;
            error.message = 'error during the save';
            next(error);

        }
        else {

            if(!record) {
               let error = new Error();
            error.status = 404;
            error.message = 'record not found';
            next(error);
            return;
            }
            if (typeof req.body.question_nr !== 'undefined' && typeof req.body.is_correct !== 'undefined') {

                
                
                let testData = record.getQuestion(req.body.question_nr);
                if (testData) {
                    testData.isCorrect = req.body.is_correct;
                }
                else {

                    record.questions.push({ questionNr: req.body.question_nr, isCorrect: req.body.is_correct });
                }
                
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
            else {
                let error = new Error();
                error.status = 400;
                error.message = 'bad input parameters';
                next(error);
            }



        }
    });


});

router.delete('/test', function(req, res, next) {
    if (req.body.test_id !== 'undefined') {
        test.remove({ _id: req.body.test_id }, function(err, record) {
            if (err) {
                let error = new Error();
                error.status = 500;
                error.message = 'error during the delete';
                next(error);
            }
            else {
                res.json({ status: 'ok', record_id: req.body.test_id });
            }
        });
    }
});




module.exports = router;