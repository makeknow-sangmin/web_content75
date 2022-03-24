/**
 * Buyer Store
 */

Ext.define('Mplm.store.AttachFileWoodenStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	group_code: params.group_code
        });

    },
	fields:[     
	        { name: 'id', type: "int" }
	        ,{ name: 'unique_id', type: "string" }
	 	     ,{ name: 'group_code', type: "string"  }
	 	     ,{ name: 'file_path', type: "string"  }
	 	    ,{ name: 'file_size', type: "string"  }
	 	    ,{ name: 'fileobject_uid', type: "string"  }
	 	   ,{ name: 'object_name', type: "string"  }
		   ,{ name: 'file_ext', type: "string"  }
	 	  ],
         extraParams : {
        	 group_code: ''
         },
         hasNull: false,
         group_code: '',
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/fileObject.do?method=readFileWoodenList',
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
							object_name: ''
						};
						
						this.add(blank);
				}

			},
				beforeload: function(){
					if(this.group_code!=null) {
						this.getProxy().setExtraParam('group_code', this.group_code);
					}

				}
		}
});