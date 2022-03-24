Ext.define('Rfx.store.CustomBtnPermStore', {
    extend : 'Ext.data.Store',
    storeId: 'CustomBtnPermStore',
    initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
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
        url : CONTEXT_PATH + '/admin/codeStructure.do?method=readAmc1&parent_system_code=CUSTOM_BUTTONS',
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