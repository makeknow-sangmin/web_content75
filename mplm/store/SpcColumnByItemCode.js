Ext.define('Mplm.store.SpcColumnByItemCode', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
            item_code: params.item_code,
            process_type: params.process_type
        })
    },
    fields: [
        {name : 'legend_code', type: 'string'},
        {name : 'measuring_type', type: 'string'},
    ],
    autoLoad: false,
    pageSize: 100,
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readSpcColumnBySgCode',
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

            }));

        },
        beforeload: function () {
            this.getProxy().setExtraParams({
                item_code: this.item_code,
                process_type: this.process_type
            });
        }
    }
});
