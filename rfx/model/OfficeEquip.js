Ext.define('Rfx.model.OfficeEquip', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/machine.do?method=readOfficeEquipment',
            create: CONTEXT_PATH + '/production/machine.do?method=create',
            update: CONTEXT_PATH + '/production/machine.do?method=create',
            destroy: CONTEXT_PATH + '/production/machine.do?method=destroy'
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