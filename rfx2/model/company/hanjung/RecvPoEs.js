Ext.define('Rfx2.model.company.hanjung.RecvPoEs', {
	
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/prch.do?method=readEst&rtg_type=ES&po_type=ES',
            // create: CONTEXT_PATH + '/purchase/material.do?method=create'+ '&vCUR_MENU_CODE=' + vCUR_MENU_CODE, /*create record, update*/
            // update: CONTEXT_PATH + '/purchase/material.do?method=update',
            // destroy: CONTEXT_PATH + '/purchase/material.do?method=destroy' /*delete*/
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
