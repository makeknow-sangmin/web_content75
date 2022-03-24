Ext.define('Rfx.model.SalWthdRawList', {
 extend: 'Rfx.model.Base',

 initComponent: function(params) {
	// !! here may be some calculations and params alteration !!
	Ext.apply(this, {
		account_name:account_name,
		regist_date:regist_date
		// some else customization
	});
 },
    proxy: {
			type: 'ajax',
	        url: CONTEXT_PATH + '/account/arap.do?method=selectWdDetailView&division=out',
			
				reader : {
					type : 'json',
					root : 'datas',
					totalProperty : 'count',
					successProperty : 'success'
				},
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
		
});
