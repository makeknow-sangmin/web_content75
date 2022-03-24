/**
*	엑셀 업로드 스토어
*/

Ext.define('Mplm.store.ExcelStore', {
    extend: 'Ext.data.Store',
    storeId: 'ExcelStore',
    proxy: {
    	type: 'memory',
    	reader: {
    		type: 'json',
    		root: 'items'
    	}
    },
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },

	columns:[     
	        { text: 'h_gr_address', dataIndex: '요청장소' }
	        
	 	  ],
	 	  
	 	  
         extraParams : {
        	 group_code: ''
         },
         hasNull: false,
         group_code: '',
	     proxy: {
	        type: 'file',
	        //autoLoad: true
	     },
	/*	listeners: {
			
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
					this.getProxy().setExtraParam('group_code', this.group_code);
				}
		}*/
});