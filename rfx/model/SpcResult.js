Ext.define('Rfx.model.SpcResult', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        // fields: [
        //     { name: 'inspection_date', type: 'date' },
        // ],
        api: {
            read: CONTEXT_PATH + '/xdview/spcMgmt.do?method=readMabufferForSpc',
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