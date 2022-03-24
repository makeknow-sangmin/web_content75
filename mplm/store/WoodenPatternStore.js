/**
 * WoodenPatternStore
 */

Ext.define('Mplm.store.WoodenPatternStore', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull
        });

    },
	fields : [ 
				{name : 'unique_id',type : "string"	},
				{name : 'pl_no',type : "string"}, 
				{name : 'sp_code',type : "string"}, 
				{name : 'item_name',type : "string"}, 
				{name : 'description',type : "string"}, 
				{name : 'specification',type : "string"}, 
				{name : 'bm_quan',type : "int"}, 
				{name: 'srcahd_uid',type: 'int'}, 
				{name: 'unit_code',type: 'string'}, 
				{name: 'create_date',type: 'string'}, 
				{name: 'model_no',type: 'string'}, 
				{name: 'item_code',type: 'string'}, 
				{name: 'cost_qty',type: 'string'}

	],
	proxy : {
		type : 'ajax',
		url : CONTEXT_PATH + '/purchase/material.do?method=read&standard_flag=K&sp_code=M&start=0&limit=50&orderBy=item_code&ascDesc=desc',
		reader : {
			type : 'json',
			root : 'datas',
			totalProperty : 'count',
			successProperty : 'success'
		},
		autoLoad : true
	},
	listeners: {
		load: function(store, records, successful,operation, options) {
			
//			if(this.hasNull) {
				
				var blank ={
						unique_id: -1,
						item_name: '없음',
						item_code: '',
					};
					
					this.add(blank);
//			}

		},
		beforeload: function(){
			
			if(this.cmpName!=null&&this.cmpName.length>0){
				var obj = Ext.getCmp(this.cmpName); 
				console_logs(obj);
					if(obj!=null) {
						var val = obj.getValue();
						if(val!=null) {
							var enValue = Ext.JSON.encode(val);
							if(val.length>0){
								this.getProxy().setExtraParam('queryUtf8', enValue);
							}
							
						}else {
							this.getProxy().setExtraParam('queryUtf8', '');
						}//endofelse
					}//endofif
			}
			
		}
}
});