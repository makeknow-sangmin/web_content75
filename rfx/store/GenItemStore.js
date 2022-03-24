/**
 * Process Name Store
 */
Ext.define('Rfx.store.GenItemStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        });

    },
	fields : [ {
		name : '',  //자재코드(번호)   srcahd
		type : "string"
		}, {
			name : 'item_name',   //설계자재번호 srcahd
			type : "string"
		}, {
			name : 'qty',    //도장외부스펙1 pjdetail
			type : "int"
		}, {
			name : 'price',    //도장외부스펙1 pjdetail
			type : "int"
		}, {
			name : 'total_price',    //납품기준일 project
			type : "int"
		},{
			name : 'cartmap_uid',    //납품기준일 project
			type : "string"
		},{
			name : 'unique_id',    //납품기준일 project
			type : "string"
		}

	],
	hasNull: false,
	sorters: [{
        property: 'unique_id',
        direction: 'DESC'
    }],
	proxy : {
		type : 'ajax',
        url: CONTEXT_PATH + '/purchase/establish.do?method=readGenItem',
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
			console_logs('store genitem');
			if(this.hasNull) {
				
				var blank ={
						systemCode: '',
						codeName: '[]',
						codeNameEn: ''
					};
					
					this.add(blank);
			}

		},
		beforeload: function(){
		}
}
});