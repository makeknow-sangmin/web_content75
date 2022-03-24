/**
 * ProjectStore Store
 */
Ext.define('Mplm.store.MyDeptStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('MyDeptStore.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[
                       	    { name: 'unique_id', type: "string"    }           
                             ,{ name: 'dept_code', type: "string"    }
                             ,{ name: 'dept_name', type: "string"    }            
         ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'pj_code',
	        direction: 'ASC'
	    }],
	     proxy: {
                 type: 'ajax',
                 url: CONTEXT_PATH + '/userMgmt/user.do?method=myDept',
                 reader: {
                 	type:'json',
                     root: 'comboDept',
                     totalProperty: 'count',
                     successProperty: 'success'
                 }
                 ,autoLoad: false
             	},
		listeners: {
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							unique_id: '',
							pj_code: ' ',
							pj_name: ''
					};
					
					this.add(blank);
				}

			    },
			beforeload: function(){
				
			}
		}
});