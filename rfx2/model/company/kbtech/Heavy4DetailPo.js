Ext.define('Rfx2.model.company.kbtech.Heavy4DetailPo', {
	extend: 'Rfx.model.Base',
	    proxy: {
			type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/purchase/prch.do?method=readDetailHeavy' + (vCUR_DEPT_CODE == 'D301' ? '&business_registration_no=' + vCUR_USER_ID : '')
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success',
				excelPath: 'excelPaㅜth'
			},
			writer: {
	            type: 'singlepost',
	            writeAllFields: false,
	            root: 'datas'
	        } 
	}
});