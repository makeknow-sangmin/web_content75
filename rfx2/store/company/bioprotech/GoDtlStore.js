Ext.define('Rfx2.store.company.bioprotech.GoDtlStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull
        });

    },
    fields : [],
    hasNull: false,
    srchNull : true,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/purchase/request.do?method=readGoNstock',
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

        }
    }
});