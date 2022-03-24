Ext.define('Rfx2.store.company.bioprotech.WarehouseStore', {
    extend: 'Ext.data.Store',
    config: {
        sorters: [
            {
                property: 'unique_id_long',
                direction: 'ASC'
            }
        ]
    },
    initComponent: function (params) {
        Ext.apply(this, {
            hasNull: params.hasNull,
            item_code: params.item_code,
            cmpName: params.cmpName,
            srchNull: params.srchNull
        });

    },
    fields: [{
        name: 'unique_id',
        type: "number"
    }, {
        name: 'wh_name',
        type: 'string'
    }, {
        name: 'wh_code',
        type: 'string'
    }
    ],
    hasNull: false,
    srchNull: true,
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/quality/warehoused.do?method=readWarehouse',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        },
        autoLoad: true
    },
    listeners: {
        load: function (store, records, successful, operation, options) {

            if (this.hasNull) {

                var blank = {
                    unique_id_long: -1,
                    wh_code: '-',
                    wh_name: '* 전체 *'
                };

                this.add(blank);
            }

        },
        beforeload: function () {

        }
    }
});