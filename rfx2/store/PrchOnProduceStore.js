Ext.define('Rfx2.store.PrchOnProduceStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        Ext.apply(this, {
            hasNull: params.hasNull
        });
    },
    hasNull: false,
    sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/purchase/request.do?method=readPrchOnProduce',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : false
    }
});