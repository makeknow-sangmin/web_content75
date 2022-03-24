/**
 * Dept Store
 */
Ext.define('Mplm.store.PjCode', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('PjStore.initComponent');
        Ext.apply(this, {
        	group_code: params.group_code
        });

    },
    
    fields: [   
             { name: 'unique_id', type: "string" }, 
			 { name: 'pj_name', type: "string"  },
			 { name: 'pj_code', type: "string"  }
     	  	  ],
     	  	  
  	
 	 hasNull: false,
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
        
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/schdule.do?method=getDistinctPjcode',
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
							pj_name: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
				var obj = Ext.getCmp(this.cmpName); 
				if(obj!=null) {
					var val = obj.getValue();
					console_log(val);
					if(val!=null) {
						var enValue = Ext.JSON.encode(val);
						console_log(enValue);
						this.getProxy().setExtraParam('queryUtf8', enValue);
					}else {
						this.getProxy().setExtraParam('queryUtf8', '');
					}
				}//endofif
				
//				this.getProxy().setExtraParam('unique_id', this.unique_id);
				
			}
		}//endoflistner
});