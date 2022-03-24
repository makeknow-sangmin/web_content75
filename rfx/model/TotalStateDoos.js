Ext.define('Rfx.model.TotalStateDoos', {
	extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/mobile/process.do?method=getPopBlockList'
	        },
//		        extraParams: {
//			    	is_complished: 'P'//사용자 정보 필드 정보
//			    	//,inout_type : 'IN' //작업지시를 한 ast 정보
//			    },
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