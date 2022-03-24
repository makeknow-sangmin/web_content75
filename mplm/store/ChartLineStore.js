Ext.define('Mplm.store.ChartLineStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {

    },
    autoLoad: false,
    pageSize: 100,
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readSpcChart'
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
