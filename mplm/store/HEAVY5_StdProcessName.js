/*
 * 공정템플리트의 모공정코드 
 */


Ext.define('Mplm.store.HEAVY5_StdProcessName', {
	extend : 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	unique_id: params.unique_id
        });

    },

 	fields:[     
 	       { name: 'unique_id', type: "string" }
 	      ,{ name: 'pcs_name', type: "string"  } 
 	      ,{ name: 'pcs_code', type: "string"  }  
 	     
 	  ],
 	 hasNull: false,
 	  sorters:[{
 		 property: 'pcs_name',
         direction: 'ASC'
 	  }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/production/pcstpl.do?method=getStdProcessName',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         },
         autoLoad: true
     	},
    	listeners: {
    		load: function(store, records, successful,operation, options) {
    			
    			if(this.hasNull) {
    				
    				var blank ={
    						unique_id: '',
    						pcs_name: '',
    						pcs_code: '',
    						//codeOrder: -1
    					};
    					
    					this.add(blank);
    			}

    		},
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