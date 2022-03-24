/**
 * Buyer Store
 */

Ext.define('Mplm.store.BomVersionSelStore', {
    extend: 'Ext.data.Store',
    initComponent: function (params) {
    },
    fields: [
        {
            name: 'unique_id',
            type: "string"
        }, {
            name: 'ver',
            type: "string"
        }, {
            name: 'minor',
            type: "string"
        }
    ],
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/design/bom.do?method=getBomverList',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
        , autoLoad: true
    },
    listeners: {

        load: function (store, records, successful, operation, options) {
            console_logs('load records', records);

        },
        beforeload: function () {
            console_logs('beforeload', 'beforeload');
        }
    }
});