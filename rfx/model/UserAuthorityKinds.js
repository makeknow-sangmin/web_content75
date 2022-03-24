Ext.define('Rfx.model.UserAuthorityKinds', {
 extend: 'Rfx.model.Base',
   proxy: {
		type: 'ajax',
       api: {
           read: CONTEXT_PATH + '/admnMgmt/auth.do?method=authread',
           create: CONTEXT_PATH + '/admnMgmt/auth.do?method=authcreate',
           update: CONTEXT_PATH + '/admnMgmt/auth.do?method=authcreate',
           destroy: CONTEXT_PATH + '/admnMgmt/auth.do?method=authdestroy'
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