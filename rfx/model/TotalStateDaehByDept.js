Ext.define('Rfx.model.TotalStateDaeh', {
	extend: 'Rfx.model.Base',
	 proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/userMgmt/user.do?method=readMemberByDept'
	        },
//		        extraParams: {
//			    	wa_code: 'DAEH01KR', // 회사 코드
//			    	uid_comast : 3060000085 
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