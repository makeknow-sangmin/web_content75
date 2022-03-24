Ext.define('Rfx.model.WorkCode', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/account/attitude.do?method=readWorkCode',
            create: CONTEXT_PATH + '/account/attitude.do?method=create',
            update: CONTEXT_PATH + '/account/attitude.do?method=create',
            destroy: CONTEXT_PATH + '/account/attitude.do?method=destroy'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
        writer: {
            type: 'singlepost',
            writeAllFields: false,
            root: 'datas'
        }
    }
});