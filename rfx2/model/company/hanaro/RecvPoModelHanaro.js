Ext.define('Rfx2.model.company.hanaro.RecvPoModelHanaro', {
    extend: 'Rfx.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/sales/poreceipt-hanaro.do?method=cloudread'
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