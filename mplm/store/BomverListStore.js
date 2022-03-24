Ext.define('Mplm.store.BomverListStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
            sg_code: params.sg_code
        });
    },
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/design/bom.do?method=getBomverList'
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
        },
        autoLoad: false
    },
    listeners: {
        beforeload: function(){
            if(this.sg_code){
                this.getProxy().setExtraParam('sg_code', this.sg_code);
            }

        }
    }
});
