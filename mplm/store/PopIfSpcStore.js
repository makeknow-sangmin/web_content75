Ext.define('Mplm.store.PopIfSpcStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {

    },
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/examTest.do?method=readPopIfSpcBuffer'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: "excelPath"
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});
