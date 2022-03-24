Ext.define('Rfx.model.EquipmentProps', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/equipment/getChartForm.do?method=read',
            create: CONTEXT_PATH + '/equipment/getChartForm.do??method=create',
            update: CONTEXT_PATH + '/equipment/getChartForm.do??method=edit',
            destroy: CONTEXT_PATH + '/equipment/getChartForm.do??method=destroy'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
        // writer: {
        //     type: 'singlepost',
        //     writeAllFields: false,
        //     root: 'datas'
        // },
        writer: {
            type: "json",
            encode: true,
            writeAllFields: true,
            rootProperty: "datas"
        }
    }
});
