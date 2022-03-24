Ext.define('Rfx2.store.company.chmr.BomverListStore', {
    extend : 'Ext.data.Store',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull
            // some else customization
        });

    },
    fields : [ {
        name : 'item_code',
        type : "string"
    }
    ],
    hasNull: false,
    sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],
    pageSize: 10000000,
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/design/bom.do?method=getBomverList&sg_code=MIX',
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