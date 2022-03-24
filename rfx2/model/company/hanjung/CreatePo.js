Ext.define('Rfx2.model.company.hanjung.CreatePo', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/prch.do?method=readrtgast&rtg_type=PR&state=R,G,GD',
            create: CONTEXT_PATH + '/purchase/prch.do?method=create',
            destroy: CONTEXT_PATH + '/purchase/prch.do?method=destroy'
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