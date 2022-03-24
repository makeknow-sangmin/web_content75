/**
 * Dept Store
 */
 Ext.define('Mplm.store.DeliveryStateCodeStore', {
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
		 display : '수주등록',
		 value : 'BM'
	 },{
		display : '출하요청',
		value : 'DO'
	},{
		display : '부분출하',
		value : 'DS'
	},{
		display : '납품완료',
		value : 'DC'
	},{
		display : '부분정산',
		value : 'PS'
	},{
		display : '정산완료',
		value : 'PC'
	},{
		display : '부분반품',
		value : 'ST'
	},{
		display : '전량반품',
		value : 'RT'
	},{
		display : '관급변경',
		value : 'GC'
	}],
	 //data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	 proxy : {
		 type : 'memory'
	 },

});