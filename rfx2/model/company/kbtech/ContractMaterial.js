Ext.define('Rfx2.model.company.kbtech.ContractMaterial', {
	
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
        api: {
            read: CONTEXT_PATH + '/purchase/material.do?method=readExtendSrcahd&not_sp_code_list=KA,KB,KC,KL'
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
