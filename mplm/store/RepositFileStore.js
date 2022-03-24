/**
 * Buyer Store
 */

Ext.define('Mplm.store.RepositFileStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	group_code: params.group_code
        });

    },
	fields:[     
	        { name: 'uid', type: "string" }  
		   ,{ name: 'name', type: "string"  } //ftp
		   ,{ name: 'size', type: "string"  }
		   ,{ name: 'date', type: "string"  }
		   ,{ name: 'link', type: "string"  }
	 	  ],
         extraParams : {
        	 group_code: ''
         },
         hasNull: false,
         group_code: '',
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/fileObject.do?method=readFtpFileList',
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