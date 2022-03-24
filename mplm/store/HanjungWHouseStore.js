/**
 * Dept Store
 */
Ext.define('Mplm.store.HanjungWHouseStore', {
    extend: 'Ext.data.Store',

    initComponent: function(params) {

    },

    fields: [
        { name: 'whouse_uid', type: "string" },
        { name: 'pj_name', type: "string"  },
        { name: 'pj_code', type: "string"  }
    ],


    hasNull: false,
    sorters: [{
        property: 'unique_id',
        direction: 'ASC'
    }],

    data: [
        {"whouse_uid": "102", "name": "본사"},
        {"whouse_uid": "103", "name": "2공장"},
        {"whouse_uid": "104", "name": "칠곡A/S센터"}
    ]
});