Ext.define('Rfx.model.DesignVersion', {
	extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	        api: {
	        	read: CONTEXT_PATH + '/design/bom.do?method=readBomVersion', 
	            create: CONTEXT_PATH + '/design/bom.do?method=createBomVersion', 
	            update: CONTEXT_PATH + '/design/bom.do?method=createBomVersion',
	            destroy: CONTEXT_PATH + '/design/bom.do?method=destroyBomVersion'
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