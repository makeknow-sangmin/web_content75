/**
 * Dept Store
 */
Ext.define('Mplm.store.BigPcsCodeStore', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('BigPcsCodeStore.initComponent');
        Ext.apply(this, {
        //	group_code: params.group_code
        });

    },
    
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'pcs_name', type: "string"  }
     		,{ name: 'pcs_code', type: "string"  }
     	  	  ],
 	sorters: [{
         property: 'pcs_name',
         direction: 'ASC'
     }],
         hasNull: false,
         dept_group : null,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/pcstpl.do?method=bringBigPcsCode&groupby=T',
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
					
					var blank ={
							unique_id: '',
							pcs_name: '',
							pcs_code: ''
						};
						
						this.add(blank);
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