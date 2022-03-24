/**
 * User Store
 */
Ext.define('Mplm.store.MchnUserStore', {
    extend: 'Ext.data.Store',
    fields: [     
     		{ name: 'unique_id', type: 'string' }
     		,{ name: 'user_id', type: 'string'  }
     		,{ name: 'user_name', type: 'string'  }
     		,{ name: 'dept_name', type: 'string'  }
     		,{ name: 'dept_code', type: 'string'  }
     		,{ name: 'email', type: 'string'  }
     		,{ name: 'hp_no', type: 'string'  }
     		,{ name: 'tel_no', type: 'string'  }
     		,{ name: 'finder_uid', type: 'string' }
     		,{ name: 'fixer_uid', type: 'string' }
     	  	  ],
 	sorters: [{
         property: 'user_name',
         direction: 'ASC'
     }],
     cmpName: 'userUid',
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
				if(this.hasNull) {
					
					var blank ={
							unique_id: '',
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
//				console_log('this:');
//				console_log(this.cmpName);
				/*var obj = Ext.getCmp(this.cmpName); 
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
				}*/
			}
		}//endoflistner
});