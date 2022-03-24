Ext.define('Rfx.model.StockReturnState', {
 extend: 'Rfx.model.Base',
 initComponent: function(params) {
	// !! here may be some calculations and params alteration !!
	Ext.apply(this, {
		item_name:item_name,
		item_code:item_code
	});
 },
    proxy: {
		type: 'ajax',
        api: {
        	read: CONTEXT_PATH + '/inventory/prchStock.do?method=readDetailStock&whouse_uid=101'
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