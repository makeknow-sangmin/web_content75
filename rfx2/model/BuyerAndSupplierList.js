Ext.define('Rfx2.model.BuyerAndSupplierList', {
    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/sales/buyer.do?method=readBuyerAndSupplier&not_mine=TOP&orderBy=wa_name', /*1recoed, search by cond, search */
            create: CONTEXT_PATH + '/sales/buyer.do?method=cloudcreate', /*create record, update*/
            update: CONTEXT_PATH + '/sales/buyer.do?method=update',
            destroy: CONTEXT_PATH + '/sales/buyer.do?method=destroy' /*delete*/
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
