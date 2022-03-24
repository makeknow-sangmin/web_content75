Ext.define('Rfx2.model.company.hanaro.IfSPurchaseRequest', {
    extend: 'Rfx.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/interface/interface.do?method=readPrchIf' /*1recoed, search by cond, search */
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