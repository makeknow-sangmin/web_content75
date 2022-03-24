Ext.define('Rfx2.model.company.kbtech.ConstructorList', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/sales/buyer.do?method=readConstructor'
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