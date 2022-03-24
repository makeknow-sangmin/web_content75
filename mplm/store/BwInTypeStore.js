
Ext.define('Mplm.store.BwInTypeStore', {
    extend: 'Ext.data.Store',
    fields: ['code', 'name'],
    data : [
        {"code":"INBW", "name":"성분"},
        {"code":"PDBW", "name":"Pd 함량"}
    ]
});