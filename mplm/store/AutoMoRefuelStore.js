/**
 * Delivery Detail Store
 */
Ext.define('Mplm.store.AutoMoRefuelStore', {
    extend: 'Ext.data.Store',
initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
		 Ext.apply(this, {
			rtgastuid: params.rtgastuid
	        });

    },
	pageSize: 100,
	fields:[     
	
	 	  ],
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/production/machine.do?method=readRefuel&category=R',
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