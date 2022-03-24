
/**
 * Item Store
 */
Ext.define('Mplm.store.MenuStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('MenuStoreStruct.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	comboType: params.comboType
            // some else customization
        });
    },
	fields:[     
	 	      { name: 'menu_key', type: "string" }
	 	     ,{ name: 'service_name', type: "string" }
	 	     ,{ name: 'menu_type', type: "string"  }
	 	     ,{ name: 'linkPath', type: "string"  }
	 	     ,{ name: 'parentName', type: "string"  }
	 	     ,{ name: 'menuPerm', type: "string"  }
		 	 ,{ name: 'class_code', type: "string"  }
			 ,{ name: 'display_name', type: "string"  }
			 ,{ name: 'flag1', type: "string"  }
			 ,{ name: 'flag2', type: "string"  }
			 ,{ name: 'flag3', type: "string"  }
			 ,{ name: 'flag4', type: "string"  }
			 ,{ name: 'flag5', type: "string"  }

	 	  ],
	       extraParams : {
	    	   menuCode: '',
	    	   method: 'readStruct'
	       },
	         
	 	hasNull: true,
	 	comboType: 'struct', //struct or object
	 	 sorters: [{
	         property: 'display_name',
	         direction: 'ASC'
   	     }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admin/menu.do',
	         reader: {
	         	 type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			select: function (combo, record) {	
//				console_log('Mplm.store.MenuStore select');
//				var selected = this.getValue();
//	           	console_log('selected: ' + selected);
//
//				if(this.comboType == 'object') {
//					switch(vCUR_MENU_CODE) {
//					case 'AMC1' :
//						{
//							parent_system_code = selected;
//							alert(parent_system_code);
//							this.getProxy().setExtraParam('menuCode', parent_system_code);
//							store.load(function() {});
//						}
//						break;
//					}
//				}
			},//endofselect
			load: function(store, records, successful,operation, options) {
				if(this.hasNull) {
					var blank ={
							menu_key: '',
							service_name: ''
					};
					this.add(blank);
				}
			},
			beforeload: function(){
			    if(this.comboType == 'object') {
			    	this.getProxy().setExtraParam('method', 'readChildObject');
			    	this.getProxy().setExtraParam('menuStruct', menu_key);
			    } else {
			    	this.getProxy().setExtraParam('method', 'readStruct');

			    }
			}
		}
});