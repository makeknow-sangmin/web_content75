Ext.define('Rfx2.store.company.bioprotech.PcsInspectionRSDetailStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
    },
    fields : [],
    hasNull: false,
    srchNull : true,
    pageSize: 100,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/quality/pcsQuality.do?method=readPcsInspectionRSDetail',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : false
    },
    listeners: {
        load: function(store, records, successful,operation, options) {
        },
        beforeload: function(){
        }
    }
});