Ext.define('Rfx.store.StochkListStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull
        });

    },
    hasNull: false,
    sorters: [{
        property: 'item_code',
        direction: 'ASC'
    }],
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/sales/sps1.do?method=readDetailStocktaking',
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