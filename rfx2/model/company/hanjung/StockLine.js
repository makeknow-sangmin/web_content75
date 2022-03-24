Ext.define('Rfx2.model.company.hanjung.StockLine', {

    extend: 'Rfx.model.Base',
    proxy: {
        type: 'ajax',
        api: {
            //read: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahd&not_sp_code_list=KA,KB,KC,KL', /*1recoed, search by cond, search */
            //read: CONTEXT_PATH + '/inventory/prchStock.do?method=readStockWithWhouse&not_sp_code_list=PRD&standard_flag=R'
            read: CONTEXT_PATH + '/inventory/prchStock.do?method=readStock&not_sp_code_list=PRD&standard_flag=R'
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
