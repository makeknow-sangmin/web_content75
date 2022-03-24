Ext.define('Rfx.store.AttCalculateStore', {
    extend: 'Ext.data.Store',
    fields: [],
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/account/attitude.do?method=readSalIndividual'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});