let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let FunctionGraphSchema = new Schema({
    graphName: {type:String,required:true, unique:true},
    graphFunction: {type:String,required:true},
    minX: {type:Number, required:true},
    maxX: {type:Number, required:true},
    graphColor:String
});
FunctionGraphSchema.pre('save', function(next) {
  if(this.minX > this.maxX) {
    next(new Error('left bound should be less than right bound '));
    return;
  }

  next();
});
let FunctionGraphModel = mongoose.model('functiongraphs', FunctionGraphSchema);
module.exports = FunctionGraphModel;