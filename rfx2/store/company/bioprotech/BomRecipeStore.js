/**
 * AssemblySearchStore Store
 */

Ext.define('Rfx2.store.company.bioprotech.BomRecipeStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
    },
    fields:[
        {
            name: 'unique_id',
            type: "string"
        }, {
            name: 'request_comment',
            type: "string"
        }, {
            name: 'pl_no',
            type: "string"
        }, {
            name: 'reserved_integer1',
            type: "string"
        }, {
            name: 'reserved_integer2',
            type: "string"
        }, {
            name: 'reserved_integer3',
            type: "string"
        }, {
            name: 'sp_code',
            type: "string"
        }, {
            name: 'item_code',
            type: "string"
        }, {
            name: 'item_name',
            type: "string"
        }, {
            name: 'specification',
            type: "string"
        }, {
            name: 'unit_code',
            type: "string"
        }, {
            name: 'notify_flag',
            type: "string"
        }, {
            name: 'bm_quan',
            type: "string"
        }, {
            name: 'lead_time',
            type: "string"
        }, {
            name: 'supplier_name',
            type: "string"
        }, {
            name: 'stock_qty',
            type: "string"
        }, {
            name: 'remark',
            type: "string"
        }
    ],
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/design/bom.do?method=cloudread&orderBy=disp_order,reserved_integer3',
        reader: {
            type:'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
        ,autoLoad: true
    },
    listeners: {

        load: function(store, records, successful,operation, options) {
            console_logs('load records', records);

        },
        beforeload: function(){

            switch(vCompanyReserved4) {
                case 'KBTC01KR':
                case 'BIOT01KR':
                    this.getProxy().setExtraParam('ac_uid_minus_one', 'Y');
                    break;
                default:
                    break;
            }

            console_logs('beforeload', 'beforeload');
        }
    }
});