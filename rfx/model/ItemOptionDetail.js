Ext.define('Rfx.model.ItemOptionDetail', {
    extend: 'Rfx.model.Base',
          proxy: {
               type: 'ajax',
               api: {
                   // read: CONTEXT_PATH + '/gencode.do?method=read',
                   read: CONTEXT_PATH + '/admin/itemInfo.do?method=read',
                   create: CONTEXT_PATH + '/admin/itemInfo.do?method=create', /*create record, update*/
                   update: CONTEXT_PATH + '/admin/itemInfo.do?method=create',
                   destroy: CONTEXT_PATH + '/admin/itemInfo.do?method=destroy' /*delete*/
               },
               reader: {
                   type: 'json',
                   root: 'datas',
                   totalProperty: 'count',
                   successProperty: 'success',
                   excelPath: 'excelPath'
               },
               writer: {
                   type: 'singlepost',
                   writeAllFields: false,
                   root: 'datas'
               } 
           }
   });