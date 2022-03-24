/**
 * Dept Store
 */
Ext.define('Mplm.store.MchnCodeStore', {
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
		 display : '1호실',
		 value : 'CUR01',
	 },{
		 display : '2호실',
		 value : 'CUR02'
	 },{
		display : '3호실',
		value : 'CUR03'
	},{
		display : '4호실',
		value : 'CUR04'
	},{
		display : '5호실',
		value : 'CUR05'
	},{
		display : '6호실',
		value : 'CUR06'
	},{
		display : '7호실',
		value : 'CUR07'
	},{
		display : '8호실',
		value : 'CUR08'
	},{
		display : '9호실',
		value : 'CUR09'
	},{
		display : '10호실',
		value : 'CUR10'
	}],
	 //data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	 proxy : {
		 type : 'memory'
	 },

});