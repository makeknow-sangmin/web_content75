Ext.define('Rfx.model.SalWthdRaw', {
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
	        url: CONTEXT_PATH + '/account/arap.do?method=SalesHistoryVer&division=out',
	
				reader : {
					type : 'json',
					root : 'datas',
					totalProperty : 'count',
					successProperty : 'success',
					excelPath: 'excelPath'
				},
			
            writer: {
                type: 'singlepost',
                writeAllFields: false,
                root: 'datas'
            },
		}
});
