/**
 * User Store
 */
Ext.define('Mplm.store.WhouseStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
    // !! here may be some calculations and params alteration !!
    Ext.apply(this, {
    	wh_code: params.wh_code,
    	unique_id: params.unique_id
    });
	},
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'wh_code', type: "string"  }
     		,{ name: 'wh_name', type: "string"  }
     	  	],
 	sorters: [{
         property: 'wh_name',
         direction: 'DESC'
     }],
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/sps1.do?method=whouseListRead',
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
				console_logs('>>>>> Aaa asd', store);
			},//endofload
			beforeload: function(){
				console_logs('>>>>>>>>> user beforeload', gUtil.getDeptCode);
				if(this.wh_code!=null){
					this.getProxy().setExtraParam('dept_code', this.wh_code);
					this.getProxy().setExtraParam('unique_id', this.unique_id);	
				}
				if(this.dept_code_list!=null) {
                    this.getProxy().setExtraParam('dept_code_list', this.dept_code_list);
                    this.getProxy().setExtraParam('unique_id', this.unique_id);
				}
			},
		}//endoflistner
});