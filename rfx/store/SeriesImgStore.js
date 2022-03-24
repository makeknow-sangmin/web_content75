Ext.define('Rfx.store.SeriesImgStore', {
    extend: 'Ext.data.Store',
       fields: [{
           unique_id : 'unique_id'
       }],
       proxy: {
           type: 'ajax',
           url : CONTEXT_PATH + '/admin/Series.do?method=readSeriesImg', /* 시리즈 이미지 가져오기 */
           reader: {
               type: 'json',
               root: 'datas',
               totalProperty: 'count',
               successProperty: 'success',
               excelPath: 'excelPath'
           },
           autoLoad: false
       },
           
           listeners: {
               load: function(store, records, successful,operation, options) {
               }
   
           },
       
   });
   
   
   