Ext.define('Rfx2.store.company.kbtech.PjCodeStore', {
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
    fields : [],
    hasNull: false,
    srchNull : true,
    sorters: [{
        property: 'reserved_varchar7',
        direction: 'DESC'
    }],
    proxy : {
        type : 'ajax',
        url : CONTEXT_PATH + '/production/schdule.do?method=readPjCodeKb',
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