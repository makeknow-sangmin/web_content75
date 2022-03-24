Ext.define('Rfx2.model.company.chmr.StoqtyLineWires', {

    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            //read: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahd&not_sp_code_list=KA,KB,KC,KL', /*1recoed, search by cond, search */
            read: CONTEXT_PATH + '/inventory/prchStock.do?method=getStocklineStoqtyWithWhouseWires'
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
