let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CellSchema = new Schema({
   row :{type: Number,required:true},
   col :{type: String,required:true},
   value: String
});
let SpreadsheetSchema = new Schema({
    spreadsheetName: {type:String,required:true, unique:true},
    rows:{type: Number,required:true},
    cols:{type: Number,required:true},
    cells:[CellSchema]
});

let SpreadsheetModel = mongoose.model('spreadsheets', SpreadsheetSchema);
module.exports = SpreadsheetModel;
