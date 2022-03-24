/**
 * 수주정보 상태구분 Store
 */

Ext.define('Mplm.store.StockPosClaAstStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
        });

    },
    fields:[
        { name: 'class_code', type: 'string' }
    ],
    hasNull: false,
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/admin/stdClass.do?method=readMaterial&identification_code=RC',
        reader: {
            type:'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        },
        autoLoad: true
    },
    listeners: {
        load: function(store, records, successful,operation, options) {
            if(this.hasNull) {

                var blank ={
            
                    //codeOrder: -1
                };

                this.add(blank);
            }

        },
        beforeload: function(){
            var obj = Ext.getCmp(this.cmpName);
            if(obj!=null) {
                var val = obj.getValue();
                console_log(val);
                if(val!=null) {
                    var enValue = Ext.JSON.encode(val);
                    console_log(enValue);
                    this.getProxy().setExtraParam('queryUtf8', enValue);
                }else {
                    this.getProxy().setExtraParam('queryUtf8', '');
                }
            }//endofif

        }

    }//endoflistner
});