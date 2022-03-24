/**
 * Process Name Store
 */

Ext.define('Rfx2.store.company.bioprotech.CommonCodeStore', {
    extend : 'Ext.data.Store',
    autoLoad : false,
    initComponent: function(params) {
        Ext.apply(this, {
            hasNull: params.hasNull,
            parentCode: params.parentCode,
            cmpName: params.cmpName
        });

    },
    fields : [ {
        name : 'systemCode',
        type : "string"
    }, {
        name : 'codeName',
        type : "string"
    }, {
        name : 'code_name_en',
        type : "string"
    }, {
        name : 'code_order',
        type : "int"
    }

    ],
    hasNull: false,
    parentCode: 'NULL',
    excludeCode: null,
    sorters: [{
        property: 'code_order',
        direction: 'ASC'
    }],
    proxy : {
        type : 'ajax',
        url: CONTEXT_PATH + '/code.do?method=read',
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

            if (this.excludeCode !== null) {
                for (var i = 0; i < store.count(); i++) {
                    var rec = store.getAt(i);
                    var system_code = rec.get('system_code');
                    if (this.excludeCode.includes(system_code)) {
                        store.remove(rec);
                    }
                }
            }
        },
        beforeload: function(){
            this.proxy.setExtraParam('parentCode', this.parentCode);
        }//endofbeforeload
    }//endoflistener

});