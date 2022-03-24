/**
 * Process Name Store
 */

Ext.define('Mplm.store.SpCodeFlagProductStockStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {

		console_log('RouteCodeStore.initComponent');
		Ext.apply(this, {
			hasNull: params.hasNull
		});

	},

	fields : ['display','value'],


	hasNull: false,
	sorters: [{
		property: 'unique_id',
		direction: 'ASC'
	}],



	data : [{
		display : '제품',
		value : 'P',
	},{
		display : '상품',
		value : 'M'
	}],
	//data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	proxy : {
		type : 'memory'
	},
});