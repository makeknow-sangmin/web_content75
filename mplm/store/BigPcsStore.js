/**
 * Dept Store
 */
Ext.define('Mplm.store.BigPcsStore', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('BigPcsCodeStore.initComponent');
        Ext.apply(this, {
        //	group_code: params.group_code
        });

    },
    
    fields: [ {
		name : 'systemCode',
		type : "string"
		}, {
			name : 'codeName',
			type : "string"
		}, {
			name : 'codeNameEn',
			type : "string"
		}, {
			name : 'codeOrder',
			type : "int"
		}

	],
 	sorters: [{
         property: 'codeOrder',
         direction: 'ASC'
     }],
         hasNull: false,
         dept_group : null,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/code.do?method=read&parentCode=STD_PROCESS_NAME',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: true
	     },
		listeners: {
			
			load: function(store, records, successful,operation, options) {
				
				if(this.hasNull) {
					
					/*var blank ={
							unique_id: '',
							pcs_name: '',
							pcs_code: ''
						};
						
						this.add(blank);*/
				}//endofif

			},//endofload
			beforeload: function(){
//				var obj = Ext.getCmp(this.cmpName); 
//				if(obj!=null) {
//					var val = obj.getValue();
//					console_log(val);
//					if(val!=null) {
//						var enValue = Ext.JSON.encode(val);
//						console_log(enValue);
//						this.getProxy().setExtraParam('queryUtf8', enValue);
//					}else {
//						this.getProxy().setExtraParam('queryUtf8', '');
//					}
				//}//endofif
				
			//	this.getProxy().setExtraParam('group_code', this.group_code);
				
			}
		}//endoflistner
});