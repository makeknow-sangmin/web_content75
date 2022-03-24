/**
 * Product Store
 */
Ext.define('Mplm.store.ProduceQtyStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			rtgastuid: params.rtgastuid
	        });

    },
	fields:[     
	
	 	  ],
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/sales/productStock.do?method=read',
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
					//this.getProxy().setExtraParam('rtgastuid', this.rtgastuid);
			}
		}
});