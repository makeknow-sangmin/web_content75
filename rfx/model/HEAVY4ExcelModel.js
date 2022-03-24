Ext.define('Rfx.model.HEAVY4ExcelModel', {
 extend: 'Rfx.model.Base',
    proxy: {
		type: 'ajax',
		
        api: {
            //read: CONTEXT_PATH + '/sales/excelRecvPo.do?method=readSessionPo', //세션에서 읽기
        	read: CONTEXT_PATH + '/sales/excelRecvPo.do?method=readBufferPo', //DB에서 읽기
            
//            create: CONTEXT_PATH + '/sales/buyer.do?method=cloudcreate', /*create record, update*/
            //update: CONTEXT_PATH + '/sales/excelRecvPo.do?method=createConfirmPo'
//            update: CONTEXT_PATH + '/sales/excelRecvPo.do?method=createConfirmPoBuffer'
//            destroy: CONTEXT_PATH + '/sales/buyer.do?method=destroy' /*delete*/
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