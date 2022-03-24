console_log('loading WareHouseStore....');
/**
 * Item Store
 */
Ext.define('Mplm.store.WareHouseStore', {
    extend: 'Ext.data.Store',
    initComponent: function (params) {

        console_log('WareHouseStore.......');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
            hasNull: params.hasNull
            // some else customization
        });
    },
    fields: [
        {name: 'unique_id', type: "string"}
        , {name: 'uid_comast', type: "string"}
        , {name: 'combst_uid', type: "string"}
        , {name: 'wh_code', type: "string"}
        , {name: 'wh_name', type: "string"}
    ],
    hasNull: false,
    sorters: [{
        property: 'wh_name',
        direction: 'DESC'
    }],
    proxy: {
        type: 'ajax',
        url: CONTEXT_PATH + '/sales/delivery.do?method=query',
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
        , autoLoad: false
    },
    listeners: {
        load: function (store, records, successful, operation, options) {
            if (this.hasNull) {
                var blank = {
                    unique_id: '-1',
                    wh_code: 'ALL',
                    wh_name: '전체'
                };

                this.add(blank);
            }

        },
        beforeload: function () {
            var obj = Ext.getCmp(this.cmpName);
            if (obj != null) {
                var val = obj.getValue();
                console_log(val);
                if (val != null) {
                    var enValue = Ext.JSON.encode(val);
                    console_log(enValue);
                    this.getProxy().setExtraParam('queryUtf8', enValue);
                } else {
                    this.getProxy().setExtraParam('queryUtf8', '');
                }
            }
        }
    }
});