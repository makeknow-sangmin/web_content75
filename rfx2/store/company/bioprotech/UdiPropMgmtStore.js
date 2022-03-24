Ext.define('Rfx2.store.company.bioprotech.UdiPropMgmtStore', {
    extend: 'Rfx.model.Base',
       proxy: {
           type: 'ajax',
           api: {
               read: CONTEXT_PATH + '/quality/qualitymgmt.do?method=udiPropRead'
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
   