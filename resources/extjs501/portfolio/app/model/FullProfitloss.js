Ext.define('ExecDashboard.model.FullProfitloss', {
    extend: 'ExecDashboard.model.Base',

    fields: [
        { name: 'selling_price', type: 'int' },
        { name: 'q2_2010', type: 'int' },
        { name: 'q3_2010', type: 'int' },
        { name: 'q4_2010', type: 'int' },
        { name: 'q1_2011', type: 'int' },
        { name: 'q2_2011', type: 'int' },
        { name: 'q3_2011', type: 'int' },
        { name: 'q4_2011', type: 'int' }
    ],
      	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2', /*1recoed, search by cond, search */
//    				create: CONTEXT_PATH + '/sales/poreceipt.do?method=create', /*create record, update*/
		            create: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudcreateroute', 
		            update: CONTEXT_PATH + '/sales/poreceipt.do?method=update',
		            destroy: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy' /*delete*/
		        },
				reader: {
					type: 'json',
					rootProperty: 'datas',
					totalProperty: 'count',
					successProperty: 'success',
					excelPath: 'excelPath'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            rootProperty: 'datas'
		        } 
			}
});
