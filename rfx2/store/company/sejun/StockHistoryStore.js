Ext.define('Rfx2.store.company.sejun.StockHistoryStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull,
            saveType: params.saveType,
            saveDate: params.saveDate,
            classCode: params.classCode
            // some else customization
        });

    },
    fields : [ {
        name : 'item_code',
        type : "string"
    }
    ],
    hasNull: false,
    srchNull : true,
    // sorters: [{
    //     property: 'bom_level',
    //     direction: 'ASC'
    // }],
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/sales/productStock.do?method=readStockHistory',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : true
    },
    autoLoad:false,
    listeners: {
        load: function(store, records, successful,operation, options) {

            if(this.hasNull) {

                var blank ={
                    systemCode: '',
                    codeName: '',
                    codeNameEn: ''
                };

                this.add(blank);
            }

        },
        beforeload: function(){
            if(this.srchNull){
                if(this.cmpName!=null){
                    this.getProxy().setExtraParam('item_code', this.cmpName);
                }
                if(this.cmpName!=null){
                    console_logs('Mplm.store.ProductStore beforeload', this.cmpName);
                    var obj = Ext.getCmp(this.cmpName);
                    console_logs(obj);
                    if(obj!=null) {
                        var val = obj.getValue();
                        console_logs(val);
                        if(val!=null) {
                            var enValue = Ext.JSON.encode(val);
                            console_logs("queryUtf8:" + enValue);
                            this.getProxy().setExtraParam('item_code', enValue);
                        }//endofelse
                    }
                }

            }
            if(this.saveType!=null){
                this.getProxy().setExtraParam('saveType', this.saveType);
            }

            if(this.classCode!=null){
                this.getProxy().setExtraParam('classCode', this.classCode);
            }

        },
        afterload: function(){

        }
    }
});