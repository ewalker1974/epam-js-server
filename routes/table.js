let express = require('express');
let router = express.Router();

let table = require('../models/table');


/* GET users listing. */
router.get('/:tablename', function(req, res, next) {


    let pageNr = undefined;
    let pageSize = undefined;
    let filter = [];
    let order = undefined;

    if (req.query.page != 'undefined' && req.query.size != 'undefined') {
        pageNr = req.query.page;
        pageSize = req.query.size;

    }

    if (req.query.order != 'undefined') {
        order = { fieldName: req.query.order };
        order.isAsc = (typeof req.query.desc == 'undefined');
    }
    for (var i in req.query) {
        if (i.startsWith('filter')) {
            let filterItem = {
                fieldName: i.substring(6),
                value: req.query[i]
            }
            filter.push(filterItem);
        }

    }
    if (filter.length == 0) {
        filter = undefined;
    }

    table.getPage(req.params.tablename, pageNr, pageSize, filter, order).then(function(value) {
            res.json(value);
        },
        function(value) {
            next(value);
        }

    );



});

router.post('/', function(req, res, next) {

    if (typeof req.query.table_name !== 'undefined') {
        let tableName = req.query.table_name;
        let fieldSet = [];
        for (let i in req.query) {
            if (i != 'table_name') {
                let item = {
                    fieldName: i,
                    value: req.query[i]
                }
                fieldSet.push(item);
            }
        }
        let rec = new table;
        rec.tableName = tableName;
        rec.record = fieldSet;
        rec.save(function(err, savedRec) {
            if (err) {
                let error = new Error();
                error.status = 500;
                error.message = 'error during save operation';
                next(error);
            }
            else {
                res.json({ status:'ok', record_id: savedRec.id });
            }
        });


    }
    else {
        let error = new Error();
        error.status = 400;
        error.message = 'input parameters are invalid';
        next(error);
    }

});
 
router.patch('/record/:recordId', function(req, res, next) {



        table.findById(req.params.recordId, function(err, record) {
           
        if (err) {
            let error = new Error();
            error.status = 500;
            error.message = 'error during record update occured';
            next(error);

        } else {
            for (let i in req.query) {
                let field = record.getField(i);
                if (field!=null) {
                   field.value = req.query[i];    
                } else {
                    let error = new Error();
                    error.status = 400;
                    error.message = 'input parameters are invalid';
                    next(error);
                    return;
                }
                 
                
            }
            record.save(function (err,record) {
               if(err) {
                 let error = new Error();
                    error.status = 500;
                    error.message = 'error during the update';
                    next(error);  
               } else {
                   res.json({status:'ok',record_id:record.id});
               } 
            });
            
        }
    });


});

router.delete('/record', function(req, res, next) {
    if (req.query.record_id!=='undefined') {
       table.remove({_id:req.query.record_id},function(err,record){
           if(err) {
                 let error = new Error();
                    error.status = 500;
                    error.message = 'error during the delete';
                    next(error);  
               } else {
                   res.json({status:'ok',record_id:req.query.record_id});
               } 
       }); 
    }
});





module.exports = router;