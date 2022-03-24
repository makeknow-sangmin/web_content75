Ext.define('Mplm.store.SpcProductListStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {

    },
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readSpcProductList'
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
