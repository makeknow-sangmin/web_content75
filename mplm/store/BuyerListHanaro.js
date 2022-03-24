Ext.define('Rfx2.model.company.hanaro.BuyerListHanaro', {
    extend: 'Rfx.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/sales/buyer-hanaro.do?method=read' /*1recoed, search by cond, search */
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