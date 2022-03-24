
/**
 * 
 * 
 * 스카나 파트 합계 계산 스토어
 * 
 * 'Mplm.store.PartLineValveStore' 참조
 * 만드는중
 * 
 */
Ext.define('Mplm.store.PartSumSearchStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('MyPartStore.initComponent');
		// !! here may be some calculations and params alteration !!
		

        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });
    },
	fields:[     
	 	      { name: 'unique_id_long', type: "int" }
	 	     ,{ name: 'unique_id', type: "string" }
	 	     ,{ name: 'item_code', type: "string"  }
	 	     ,{ name: 'bm_quan', type: "int"  }
			  ,{ name: 'reserved1', type: "string"  }
			  ,{ name: 'reserved2', type: "string"  }
	 	     
	 	  ],
	         
	         
	 	 hasNull: true,
	 	 sorters: [{
	         property: 'unique_id',
	         direction: 'DESC'
   	     }],
	     proxy: {
			 type: 'ajax',
			 
			 //기존
			 //url: CONTEXT_PATH + '/design/bom.do?method=valveread',
			 url: CONTEXT_PATH + '/design/bom.do?method=valveReadSum',
			 
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
				 successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			load: function(store, records, successful,operation, options) {
					//console_logs("PartSumSearchStore 로드     ====>   ", records);
					console_log('로드');
				},
				
			    beforeload: function(records, yam, queary, combo){
					console_log('비포어 로드');
					console_logs("PartSumSearchStore records 츨략     ====>   ", records);
					console_logs("PartSumSearchStore query 출력     ====>   ", queary);
					console_logs("PartSumSearchStore combo 출력     ====>   ", combo);
					//console_logs("스토어 전역 출력 >>", gm.me().vSELECTED_SELECTION_SCANA);
					


					//parent_uid 출력
					//console_logs("PartSumSearchStore parent_uid 출력     ====>   ", parent_uid)



				}
		}
});