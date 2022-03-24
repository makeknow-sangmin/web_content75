Ext.define('Rfx2.model.sales.estimateRequest', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/sales/estimate.do?method=estReq', /*1recoed, search by cond, search */
            create: CONTEXT_PATH + '/sales/estimate.do?method=create', /*create record, update*/
            update: CONTEXT_PATH + '/sales/estimate.do?method=update',
            destroy: CONTEXT_PATH + '/sales/estimate.do?method=delete' /*delete*/
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
