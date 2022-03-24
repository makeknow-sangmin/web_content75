Ext.define('Rfx.model.ReportTemplateDef', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/xdmMeasure.do?method=readMeasureDataDetailAdvanced&type=BW',
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
