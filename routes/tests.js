let express = require('express');
let router = express.Router();

let test = require('../models/test');


/* GET users listing. */
router.get('/:user/:test', function(req, res, next) {
    test.find({ username: req.params.user, testId: req.params.test }, function(err, record) {
       
        
        if (err) {
            let error = new Error();
            error.status = 404;
            next(error);
        }
        else {
            if (record && record.length > 0) {
                res.json(record);
            }
            else {
                let error = new Error();
                error.status = 404;
                next(error);
            }

        }

    });


});

router.post('/', function(req, res, next) {

    if (typeof req.query.user !== 'undefined' && typeof req.query.test !== 'undefined') {
        let rec = new test;
        rec.username = req.query.user;
        rec.testId = req.query.test;

        if (typeof req.query.question_nr !== 'undefined' && typeof req.query.is_correct !== 'undefined') {
            let testItem = { questionNr: req.query.question_nr, isCorrect: req.query.is_correct };

            rec.questions = [];
            rec.questions.push(testItem);
        }

        rec.save(function(err, savedRec) {
            if (err) {
                let error = new Error();
                error.status = 500;
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
            next(error);

        }
        else {

            if(!record) {
               let error = new Error();
            error.status = 404;
            next(error);
            return;
            }
            if (typeof req.query.question_nr !== 'undefined' && typeof req.query.is_correct !== 'undefined') {

                
                
                let testData = record.getQuestion(req.query.question_nr);
                if (testData) {
                    testData.isCorrect = req.query.is_correct;
                }
                else {

                    record.questions.push({ questionNr: req.query.question_nr, isCorrect: req.query.is_correct });
                }
                
                record.save(function(err, savedRec) {
                    if (err) {
                        let error = new Error();
                        error.status = 500;
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
                next(error);
            }



        }
    });


});

router.delete('/test', function(req, res, next) {
    if (req.query.test_id !== 'undefined') {
        test.remove({ _id: req.query.test_id }, function(err, record) {
            if (err) {
                let error = new Error();
                error.status = 500;
                next(error);
            }
            else {
                res.json({ status: 'ok', record_id: req.query.record_id });
            }
        });
    }
});




module.exports = router;