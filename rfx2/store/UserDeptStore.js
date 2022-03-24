/**
 * User Store
 */
Ext.define('Rfx2.store.UserDeptStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
    // !! here may be some calculations and params alteration !!
    Ext.apply(this, {
    	dept_code: params.dept_code,
    	unique_id: params.unique_id,
    	cmpName: params.cmpName
    });
	},
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'user_id', type: "string"  }
     		,{ name: 'user_name', type: "string"  }
     		,{ name: 'dept_name', type: "string"  }
     		,{ name: 'dept_code', type: "string"  }
     		,{ name: 'email', type: "string"  }
     		,{ name: 'hp_no', type: "string"  }
     		,{ name: 'tel_no', type: "string"  }
     	  	  ],
 	sorters: [{
         property: 'user_name',
         direction: 'ASC'
     }],
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/userMgmt/user.do?method=query',
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

            },
			beforeload: function(){
				if(this.dept_code!=null){
					this.getProxy().setExtraParam('dept_code', this.dept_code);
					this.getProxy().setExtraParam('unique_id', this.unique_id);	
				}
//				console_log('this:');
//				console_log(this.cmpName);
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
//				}
			}
		}//endoflistner
});