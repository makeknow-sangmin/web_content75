/**
 * UnassignedPalletStore
 */
Ext.define('Rfx.store.UnassignedPalletStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [ {
			name : 'po_no',
			type : "string",
		},
		{
			name : 'po_no_custom',
			type : 'string',
            convert: function(v, record) {
				if(record.data.po_no != '변경할 파레트 선택') {
                    return record.data.po_no + '-' + record.data.total_qty;
				}
            }
		},
		{
			name: 'po_type',
			type : "string"
		},
		{
			name: 'reserved_number2',
			type: 'int'
		},
		{
			name: 'unique_id_long',
			type: 'string'
		}
	],
	sorters: [{
        property: 'po_no',
        direction: 'ASC'
    }],
    autoLoad: true,
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/sales/productStock.do?method=getUnassignedPallet',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : false
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
		

		},
		beforeload: function(){
		}
}
});