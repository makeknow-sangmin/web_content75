Ext.define('Mplm.store.CpkStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {

    },
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/examTest.do?method=readCpk'
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
