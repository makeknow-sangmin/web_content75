Ext.define('Mplm.store.SrcAhdStoreDS', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	/*level1: params.level1,
        	identification_code: params.identification_code,
        	parent_class_code: params.parent_class_code,*/
        	storeMode: params.storeMode
        });

    },
    fields: [     
    		{ name: 'area_code', type: "string", 
    		  name: 'class_code', type: "string"
    		}
     		],
 	sorters: [{
         property: 'area_code',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=srcahdarearead',
         reader: {
         	type:'json',
             root: 'datas',
             totalProperty: 'count',
             successProperty: 'success'
         }
         ,autoLoad: true
     },
     listeners: {
			beforeload: function(){
				//this.getProxy().setExtraParam('pcs_code', this.pcs_code);
					//this.getProxy().setExtraParam('level1', this.level1);
					//this.getProxy().setExtraParam('identification_code', this.identification_code);
				/*if(this.parent_class_code!=null){
					this.getProxy().setExtraParam('parent_class_code', this.parent_class_code);
				}*/
				this.getProxy().setExtraParam('storeMode', this.storeMode);
				this.getProxy().setExtraParam('pj_type', this.pj_type);
			}
		}//endoflistner
});