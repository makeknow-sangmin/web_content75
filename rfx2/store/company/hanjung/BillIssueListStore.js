Ext.define('Rfx2.store.company.hanjung.BillIssueListStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull
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
    sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/purchase/prch.do?method=readBillHistory&po_type=SB',
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

        }
    }
});