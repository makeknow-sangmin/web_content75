Ext.define('Rfx.model.InspectItemMgmt', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/xdview/xdmInspect.do?method=readDimensionComp',
            create: CONTEXT_PATH + '/xdview/xdmInspect.do?method=create',
            update: CONTEXT_PATH + '/xdview/xdmInspect.do?method=create',
            destroy: CONTEXT_PATH + '/xdview/xdmInspect.do?method=destroy'
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