/**
 * Dept Store
 */
Ext.define('Mplm.store.DeptStoreDABP', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('DeptStore.initComponent');
        Ext.apply(this, {
        	dept_group: params.dept_group
        });

    },
    
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'dept_name', type: "string"  }
     		,{ name: 'dept_code', type: "string"  }
     	  	  ],
 	sorters: [{
         property: 'dept_name',
         direction: 'ASC'
     }],
         hasNull: false,
         dept_group : null,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admin/comdst.do?method=query&re_dept=true',
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
							dept_name: '',
							dept_code: ''
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
				
				this.getProxy().setExtraParam('dept_group', this.dept_group);
				
			}
		}//endoflistner
});