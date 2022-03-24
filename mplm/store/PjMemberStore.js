/**
 * PjMemberStore Store
 */
Ext.define('Mplm.store.PjMemberStore', {
    extend: 'Ext.data.Store',
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'user_id', type: "string"  }
     		,{ name: 'user_name', type: "string"  }
     		,{ name: 'email', type: "string"  }
     		,{ name: 'role_type', type: "string"  }
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
				if(this.hasNull) {
					
					var blank ={
							unique_id: '',
							user_id: '',
							user_name: '',
							email: '',
							role_type: ''
						};
						
						this.add(blank);
				}//endofif

			},//endofload
			beforeload: function(){
			}
		}//endoflistner
});