var mongoose = require('mongoose');

var Schema = mongoose.Schema;

let TestResultSchema = new Schema({
    questionNr: Number,
    isCorrect: Boolean
});
let TestLogSchema = new Schema({
    username: String,
    testId: String,
    questions:[TestResultSchema],
    
});

TestLogSchema.methods.getQuestion= function (questionNr) {
    
    for(let i=0;i<this.questions.length;i++) {
        
        if (this.questions[i].questionNr == questionNr) {
            return this.questions[i];
        }
    }
    return null;
}


var TestModel = mongoose.model('Tests', TestLogSchema);
module.exports = TestModel;