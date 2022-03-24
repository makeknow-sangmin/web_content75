Ext.define('Rfx.model.DefineCalendar', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/admin/defineCalendar.do?method=readCalendar',
            create: CONTEXT_PATH + '/admin/defineCalendar.do?method=create',
            update: CONTEXT_PATH + '/admin/defineCalendar.do?method=edit',
            destroy: CONTEXT_PATH + '/admin/defineCalendar.do?method=destroy'
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
