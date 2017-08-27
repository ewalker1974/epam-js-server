var mongoose = require('mongoose');

var Schema = mongoose.Schema;

let TestResultSchema = new Schema({
    questionNr: Number,
    isCorrect: Boolean
});
let TestLogSchema = new Schema({
    username: String,
    testId: String,
    questions: [TestResultSchema],

});

TestLogSchema.methods.getQuestion = function(questionNr) {

    for (let i = 0; i < this.questions.length; i++) {

        if (this.questions[i].questionNr == questionNr) {
            return this.questions[i];
        }
    }
    return null;
}

TestLogSchema.pre('save', function(next) {
    const RECORD_EXISTS = 1;
    const RECORD_NEW = 0;
    let saveRec = this;
    let check = new Promise(function(resolve, reject) {
        TestModel.findById(saveRec.id, function(err, record) {
            if (err) {
                reject(err);
            }
            else {
                if (record) {
                    resolve(RECORD_EXISTS);
                }
                else {
                    resolve(RECORD_NEW);
                }
            }
        })
    }).then(function(value) {
        if (value == RECORD_NEW) {
            
            TestModel.find({ username: saveRec.username, testId: saveRec.testId }, function(err, record) {
                if (!err && (typeof record !== 'undefined') && (record.length > 0)) {
console.log("double");
                    let error = new Error('The test already exists');
                    error.status = 400;
                    next(error);

                }
                else {

                    next();


                }
            });
        } else {
            
            next();
        }
    }).catch(function(error){
        error.status = 500;
        if (!error.message) {
            error.message = 'Error during the record check';
        }
    });



});


var TestModel = mongoose.model('Tests', TestLogSchema);
module.exports = TestModel;