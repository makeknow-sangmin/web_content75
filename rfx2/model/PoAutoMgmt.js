Ext.define('Rfx2.model.PoAutoMgmt', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/prch.do?method=getAutoPoMgList',
            create: CONTEXT_PATH + '/index/generalData.do?method=create',
            update: CONTEXT_PATH + '/admin/board.do?method=create',
            destroy: CONTEXT_PATH + '/admin/board.do?method=destroy'
        },
        reader: {
            type: 'json',
            root: 'datas',
            totalProperty: 'count',
            successProperty: 'success',
            excelPath: 'excelPath'
        },
        writer: {
            type: "json",
            encode: true,
            writeAllFields: true,
            rootProperty: "datas"
        }
    }
});