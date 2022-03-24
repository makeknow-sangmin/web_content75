Ext.define('Rfx2.model.company.bioprotech.ImportInspection', {
    extend: 'Rfx.model.Base',
    idProperty: 'custom_uid',
    proxy: {
        type: 'ajax',
        api: {
            read : CONTEXT_PATH + '/xdview/spcMgmt.do?method=readMabufferForImportInspection',
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