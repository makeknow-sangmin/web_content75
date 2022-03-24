/**
 * Dept Store
 */
Ext.define('Mplm.store.KbTechWHouseStore', {
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
        {"whouse_uid": "102", "name": "본사창고"},
        {"whouse_uid": "103", "name": "KB테크"},
        {"whouse_uid": "104", "name": "와이제이"},
        {"whouse_uid": "105", "name": "정민테크"},
        {"whouse_uid": "106", "name": "용현테크"},
        {"whouse_uid": "107", "name": "SMT사업부(KB텍)"},
        {"whouse_uid": "108", "name": "씨에스테크원"},
        {"whouse_uid": "109", "name": "제이와이테크"},
        {"whouse_uid": "110", "name": "세연전자"}
    ]
});