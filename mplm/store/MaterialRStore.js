/**
 * Product Store
 */
Ext.define('Mplm.store.MaterialRStore', {
    extend: 'Ext.data.Store',
    initComponent: function (params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            class_code: params.class_code,
            cmpName: params.cmpName
        });

    },
    fields: [
        {name: 'unique_id', type: "string"}
        , {name: 'specification', type: "string"}
        , {name: 'class_code', type: "string"}
        , {name: 'item_code', type: "string"}
        , {name: 'item_name', type: "string"}
        , {name: 'supplier_name', type: "string"}
        , {name: 'description', type: "string"}
        , {name: 'model_no', type: "string"}
        , {name: 'comment', type: "string"}
    ],
    sorters: [{
        property: 'item_code',
        direction: 'ASC'
    }],
    pageSize: 10000000,
    queryMode: 'remote',
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahd&not_sp_code_list=KA,KB,KC,KL&not_standard_flag=A',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: "excelPath"
        }
        , autoLoad: true
    },
    listeners: {
        beforeload: function () {
            this.getProxy().setExtraParam('class_code2', this.class_code);

            console_logs('Mplm.store.ProductStore beforeload');
            console_logs(this.cmpName);
            var obj = Ext.getCmp(this.cmpName);
            console_logs(obj);
            if (obj != null) {
                var val = obj.getValue();
                console_logs(val);
                if (val != null) {
                    var enValue = Ext.JSON.encode(val);
                    console_logs("queryUtf8:" + enValue);
                    this.getProxy().setExtraParam('queryUtf8', enValue);
                } else {
                    this.getProxy().setExtraParam('queryUtf8', '');
                }//endofelse
            }
        }
    }
});