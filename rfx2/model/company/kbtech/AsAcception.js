Ext.define('Rfx2.model.company.kbtech.AsAcception', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/collab/svcqst.do?method=readAsAcception', /*1recoed, search by cond, search */
            create: CONTEXT_PATH + '/collab/svcqst.do?method=create', /*create record, update*/
            update: CONTEXT_PATH + '/collab/svcqst.do?method=create',
            destroy: CONTEXT_PATH + '/collab/svcqst.do?method=destroy' /*delete*/
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