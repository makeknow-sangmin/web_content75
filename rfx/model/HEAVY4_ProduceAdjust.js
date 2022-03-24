Ext.define('Rfx.model.HEAVY4_ProduceAdjust', {
	extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/production/pcsline.do?method=readLotDetail&type=PRD',
	            create: CONTEXT_PATH + '/production/pcsline.do?method=create',
	            update: CONTEXT_PATH + '/production/pcsline.do?method=update',
	            destroy: CONTEXT_PATH + '/production/pcsline.do?method=destroy'
	        },
//	        extraParams: {
//		    	is_complished: 'P'//사용자 정보 필드 정보
//		    	//,inout_type : 'IN' //작업지시를 한 ast 정보
//		    },
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