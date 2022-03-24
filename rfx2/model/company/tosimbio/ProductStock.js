Ext.define('Rfx2.model.company.bioprotech.ProductStock', {
	
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
           // read: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahd&sp_code_list=G,F,H', /*1recoed, search by cond, search */
            read: CONTEXT_PATH + '/inventory/prchStock.do?method=readStockWithWhouse&not_sp_code_list=S&standard_flag=A',
            create: CONTEXT_PATH + '/purchase/material.do?method=create'+ '&vCUR_MENU_CODE=' + vCUR_MENU_CODE, /*create record, update*/
            update: CONTEXT_PATH + '/purchase/material.do?method=update',
            destroy: CONTEXT_PATH + '/purchase/material.do?method=destroy' /*delete*/
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
