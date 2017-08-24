let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RecordFieldSchema = new Schema({
    fieldName: String,
    value: String
});
let RecordSchema = new Schema({

    tableName: { type: String, required: true },
    record: [RecordFieldSchema],


});


RecordSchema.methods.getField= function (fieldName) {
    for(let i=0;i<this.record.length;i++) {
        if (this.record[i].fieldName == fieldName) {
            return this.record[i];
        }
    }
    return null;
}

RecordSchema.statics.isAccepted = function(fieldSet, filter) {
    if (fieldSet.length < filter.length) {
        return false;
    }
    for (let i = 0; i < filter.length; i++) {
        let found = false;
        for (let j = 0; j < fieldSet.length; j++) {
            if (fieldSet[j].fieldName == filter[i].fieldName) {
                if (!fieldSet[j].value.startsWith(filter[i].value)) {
                    
                    return false;
                } else {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            
            return false;
        }
        
    }
    return true;

}


RecordSchema.statics.getPage = function(tableName, pageNr, pageSize, filter, order) {
    
    

    return new Promise(function(resolve, reject) {
        //have to fetch all data due records value in nested array
        RecordsModel.find({ tableName: tableName }, function(err, records) {

         

            if (err) {
                reject(err);
            }
            else {

                if (records.length > 0) {

                    let recordData = {
                        length: 0,
                        records: []
                    }
                    
                    let recs = [];
                    if (typeof filter !== 'undefined') {
                        for (let i = 0; i < records.length; i++) {
                            if (RecordsModel.isAccepted(records[i].record,filter)) {
                                recs.push(records[i]);
                            }
                        }
                    }else {
                        recs = records;
                    }


                    if (typeof order !==undefined) {
                        recs.sort(function (a,b) {
                            
                           let direction = (order.isAsc)?1:-1;    
                           let firstRecField = a.record.find((elem)=>elem.fieldName==order.fieldName);
                           
                           let secondRecField = b.record.find((elem)=>elem.fieldName==order.fieldName);
                          
                           if (typeof firstRecField == 'undefined') {
                               return -1*direction;
                           }else if (typeof secondRecField == 'undefined') {
                               return 1*direction;
                           }else {
                               return direction*((firstRecField.value<secondRecField.value)?-1:1);
                           }
                        });
                    }
                    
                    if (typeof pageNr != 'undefined' && typeof pageSize != 'undefined') {
                        recordData.pageNr = pageNr;
                        recordData.pageSize = pageSize;
                        
                        let start = +pageNr*pageSize;
                        let end = (+pageNr+1)*pageSize;
                        recordData.pagesRemaining = Math.ceil((recs.length-end)/pageSize);
                        
                        if (start>=recs.length) {
                            recs = [];
                        }else {
                            recs = recs.slice(start,end);
                        }
                        

                    }
                    recordData.records = recs;
                    recordData.length = recs.length;
                    resolve(recordData);

                }
                else {

                    let error = new Error();
                    error.status = 404;
                    error.message = 'record not found';
                    reject(error);
                }

            }

        });
    });




}
let RecordsModel = mongoose.model('Records', RecordSchema);
module.exports = RecordsModel;