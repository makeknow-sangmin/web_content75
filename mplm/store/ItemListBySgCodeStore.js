Ext.define('mplm.store.ItemListBySgCodeStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull,
            sg_code: params.sg_code
        });

    },
    fields : [
        {name: 'item_name', type: "string"},
        {name: 'item_code', type: "string"},
    ],
    sorters: [{
        property: 'item_name',
        direction: 'ASC'
    }],
    hasNull: false,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/xdview/spcMgmt.do?method=readItemListBySgCode',
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

                };

                this.add(blank);
            }

        },
        beforeload: function(){
            this.getProxy().setExtraParams({
                'sg_code': this.sg_code,
            });

        }
    }
});