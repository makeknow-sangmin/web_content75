/**
 * Dept Store
 */
 Ext.define('Mplm.store.InnoutCategoryStore', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('RouteCodeStore.initComponent');
        Ext.apply(this, {
        	hasNull: params.hasNull
        });

    },
    
   fields : ['value','view'],
     	  	  
  	
 	 hasNull: false,
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
        
     data: [
		{ "value": "ALL", "view": "전체" },
		{ "value": "IN", "view": "입고" },
		{ "value": "OUT", "view": "출고" }
	],
	 //data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	 proxy : {
		 type : 'memory'
	 },

});