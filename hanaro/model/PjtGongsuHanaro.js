Ext.define('Hanaro.model.PjtGongsuHanaro', {
    extend: 'Hanaro.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/design/pjtgongsu.do?method=read', /*1recoed, search by cond, search */
               create: CONTEXT_PATH + '/design/pjtgongsu.do?method=create', /*create record, update*/
               update: CONTEXT_PATH + '/design/pjtgongsu.do?method=update',
               destroy: CONTEXT_PATH + '/design/pjtgongsu.do?method=destroy' /*delete*/
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