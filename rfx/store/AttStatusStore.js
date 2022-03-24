Ext.define('Rfx.store.AttStatusStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/account/attitude.do?method=readAtCalculate',
            //read: CONTEXT_PATH + '/account/attitude.do?method=readSalStatus'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});
