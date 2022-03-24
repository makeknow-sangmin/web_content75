Ext.define('Rfx2.store.company.bioprotech.WearingDetail', {
    extend : 'Ext.data.Store',
    config : {
        sorters: [
            {
                property: 'barcode',
                direction: 'ASC'
            }
        ]
    },
    initComponent: function(params) {
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull
        });

    },
    fields : [ {
        name : 'unique_id',
        type : "number"
    }, 
    {
        name : 'wh_name',
        type : 'string'
    }, {
        name : 'wh_code',
        type : 'string'
    }
    ],
    hasNull: false,
    srchNull : true,
    proxy : {
        type : 'ajax',
        // url : CONTEXT_PATH + '/quality/wgrast.do?method=wearingBarcode',
        url : CONTEXT_PATH + '/quality/wgrast.do?method=read&po_type=MN',
        reader : {
            type : 'json',
            root : 'datas',
            totalProperty : 'count',
            successProperty : 'success'
        },
        autoLoad : true
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