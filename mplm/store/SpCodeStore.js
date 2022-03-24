/**
 * Dept Store
 */
Ext.define('Mplm.store.SpCodeStore', {
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
		value : 'ALL'
	},{
		 display : '제품',
		 value : 'P',
	 },{
		 display : '상품',
		 value : 'M'
	 },{
		display : '원자재',
		value : 'S'
	},{
		display : '부자재',
		value : 'B'
	}],
	 //data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	 proxy : {
		 type : 'memory'
	 },

});