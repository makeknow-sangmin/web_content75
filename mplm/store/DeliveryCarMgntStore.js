/**
 * Claast Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Mplm.store.DeliveryCarMgntStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	level1: params.level1,
        	identification_code: params.identification_code,
        	parent_class_code: params.parent_class_code,
        	class_code:params.class_code,
        	class_name:params.class_name,
        	class_type:params.class_type
        });

    },
    fields: [     
     		{ name: 'level1', type: "string" }
     		,{ name: 'identification_code', type: "string"  }
     		,{ name: 'parent_class_code', type: "string"  }
     		,{ name: 'class_name', type: "string"  }
     		,{ name: 'class_code', type: "string"  }
     		,{ name: 'class_type', type: "string"  }
     		],
 	sorters: [{
         property: 'level1',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaast',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: false
     },
     listeners: {
			beforeload: function(combo){
				//this.getProxy().setExtraParam('pcs_code', this.pcs_code);	
				if(this.level1!=null){
						this.getProxy().setExtraParam('level1', this.level1);
				}
				if(this.class_type!=null){
						this.getProxy().setExtraParam('class_type', this.class_type);
				}	
				if(this.parent_class_code!=null){
					this.getProxy().setExtraParam('parent_class_code', this.parent_class_code);
				}
				if(this.class_code!=null){
					this.getProxy().setExtraParam('class_code', this.class_code);
				}
				if(this.class_name!=null){
					this.getProxy().setExtraParam('class_name', this.class_name);
				}
			}
		}//endoflistner
});