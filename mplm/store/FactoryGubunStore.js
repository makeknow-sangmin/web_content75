/**
 * Dept Store
 */
 Ext.define('Mplm.store.FactoryGubunStore', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('RouteCodeStore.initComponent');
        Ext.apply(this, {
        	hasNull: params.hasNull
        });

    },
    
   fields : ['display','value'],
     	  	  
  	
 	 hasNull: false,
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
        
     	  	  
  	
	 data : [{
		 display : '전체',
		 value : 'ALL',
	 },{
		 display : '1공장',
		 value : 'CH01'
	 },{
		display : '2공장',
		value : 'CH02'
	}],
	 //data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	 proxy : {
		 type : 'memory'
	 },

});