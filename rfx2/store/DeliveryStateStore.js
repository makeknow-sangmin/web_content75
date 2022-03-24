Ext.define('Rfx2.store.DeliveryStateStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull,
            srch_type: params.srch_type
        });

    },
    fields : [],
    hasNull: false,
    srchNull : true,
    pageSize: 100,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/sales/delivery.do?method=readSleDel',
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
            if(this.srch_type!=null){
                this.getProxy().setExtraParam('srch_type', this.srch_type);
            }
        }
    }
});