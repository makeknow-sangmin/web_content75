/**
 * Claast Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Mplm.store.ClaastStoreMTPD', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	level1_1: params.level1_1,
        	identification_code_1: params.identification_code_1,
        	level1_2: params.level1_2,
        	identification_code_2: params.identification_code_2,
        	parent_class_code: params.parent_class_code,
        });

    },
    fields: [     
     		{ name: 'level1', type: "string" }
     		,{ name: 'identification_code', type: "string"  }
     		,{ name: 'parent_class_code', type: "string"  }
     		,{ name: 'class_name', type: "string"  }
     		,{ name: 'class_code', type: "string"  }
     		],
 	sorters: [{
         property: 'class_code',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/b2b/cadnpart.do?method=getclaastMTPD',
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

				this.getProxy().setExtraParam('level1_1', this.level1_1);
				this.getProxy().setExtraParam('identification_code_1', this.identification_code_1);
				if(this.level1_2 != null && this.identification_code_2 != null){
					this.getProxy().setExtraParam('level1_2', this.level1_2);
					this.getProxy().setExtraParam('identification_code_2', this.identification_code_2);
				}
				if(this.parent_class_code!=null){
					this.getProxy().setExtraParam('parent_class_code', this.parent_class_code);
				}
			},
			 load: function(store, records, successful,operation, options) {

				 if(this.hasNull) {
					 var blank ={
						 unique_id: '-1',
						 class_code: '-',
						 class_name: '* 전체 *'
					 };

					 this.add(blank);
				 }

			 }
		}//endoflistner
});