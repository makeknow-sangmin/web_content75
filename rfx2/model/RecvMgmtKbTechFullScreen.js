Ext.define('Rfx2.model.RecvMgmtKbTechFullScreen', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/tablet.do?method=readAssyEditMap',
            create: CONTEXT_PATH + '/index/generalData.do?method=create',
            // update: CONTEXT_PATH + '/purchase/material.do?method=edit'

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