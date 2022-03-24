Ext.define('Rfx2.model.company.bioprotech.PurchaseRequestDetail', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/request.do?method=readCartMapNoStoqty&rtg_type=PR',
            // create: CONTEXT_PATH + '/purchase/prch.do?method=create',
            // destroy: CONTEXT_PATH + '/purchase/prch.do?method=destroy'
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