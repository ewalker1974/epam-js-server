let mongoose = require('mongoose');

let Schema = mongoose.Schema;


let SketchGraphSchema = new Schema({
    graphName: {type:String,required:true, unique:true},
    objects:String
});

let SketchGraphModel = mongoose.model('grapheditors', SketchGraphSchema);
module.exports = SketchGraphModel;


