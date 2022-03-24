Ext.define('Rfx2.model.ProduceStateByPlan', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/index/process.do?method=readProduceStateByPlan'
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