/**
 * User Store
 */
Ext.define('Mplm.store.UserDeptStoreOnly', {
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
         dept_code: '',
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
				if(this.hasNull) {
					
					var blank ={
							unique_id: '-1',
							user_id: '',
							user_name: '',
							dept_name: '',
							dept_code: '',
							email: '',
							hp_no: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
				if(this.dept_code!=null){
					this.getProxy().setExtraParam('dept_code', this.dept_code);
					this.getProxy().setExtraParam('unique_id', this.unique_id);	
				}
//				if(this.dept_code!=null){
//					this.getProxy().setExtraParam('unique_id', this.unique_id);					
//				}
				
				console_logs('Mplm.store.UserDeptStoreOnly beforeload');
				console_logs(this.cmpName);
				var obj = Ext.getCmp(this.cmpName); 
				console_logs(obj);
				if(obj!=null) {
					var val = obj.getValue();
					console_logs(val);
					if(val!=null) {
						var enValue = Ext.JSON.encode(val);
						console_logs("queryUtf8:" + enValue);
						if(val.length!=11){
							this.getProxy().setExtraParam('queryUtf8', enValue);
						}
					}else {
						this.getProxy().setExtraParam('queryUtf8', '');
					}//endofelse
				}//endofif
			}
		}//endoflistner
});