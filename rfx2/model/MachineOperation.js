Ext.define('Rfx2.model.MachineOperation', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/production/machine.do?method=getMchnOprHst'
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
