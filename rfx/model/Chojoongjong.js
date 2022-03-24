Ext.define('Rfx.model.Chojoongjong', {
 extend: 'Rfx.model.Base',
	  proxy: {
			  type: 'ajax',
		      api: {
		          read: CONTEXT_PATH + '/production/mcfix.do?method=read&is_abnormal=0',
		          create: CONTEXT_PATH + '/production/mcfix.do?method=create',
		          update: CONTEXT_PATH + '/production/mcfix.do?method=create',
		          destroy: CONTEXT_PATH + '/production/mcfix.do?method=destroy'
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
		      },
		}
});