/**
 * Dept Store
 */
 Ext.define('Mplm.store.YearStore', {
    extend: 'Ext.data.Store',
    
	initComponent: function(params) {
		
		console_log('RouteCodeStore.initComponent');
        Ext.apply(this, {
        	hasNull: params.hasNull
        });

    },
    
   fields : ['year','view'],
     	  	  
  	
 	 hasNull: false,
 	sorters: [{
         property: 'unique_id',
         direction: 'ASC'
     }],
        
     data: [
		{ "year": "2018", "view": "2018" },
		{ "year": "2019", "view": "2019" },
		{ "year": "2020", "view": "2020" },
		{ "year": "2021", "view": "2021" },
		{ "year": "2022", "view": "2022" },
		{ "year": "2023", "view": "2023" },
		{ "year": "2024", "view": "2024" },
		{ "year": "2025", "view": "2025" },
		{ "year": "2026", "view": "2026" },
		{ "year": "2027", "view": "2027" },
		{ "year": "2028", "view": "2028" },
		{ "year": "2029", "view": "2029" },
		{ "year": "2030", "view": "2030" }
	],
	 //data 속성에 fix값이 정의되있으므로 type을 memory로 정해줍니다.
	 proxy : {
		 type : 'memory'
	 },

});