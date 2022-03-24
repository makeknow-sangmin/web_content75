Ext.define('Mplm.store.SpcColumnNameStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {

    },
    autoLoad: false,
    pageSize: 100,
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readSpcColumn',
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
    },
    listeners: {
        load: function (store, records, successful, operation, options) {

            this.insert(0,new Ext.data.Record({
                legend_code_kr: '항목 선택 안함'
            }));

        },
        beforeload: function () {
        }
    }
});
