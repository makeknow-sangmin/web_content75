/**
 * MachineStore
 */

Ext.define('Mplm.store.MoldInfoStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull
            // some else customization
        });

    },
	fields:[     
	        { name: 'unique_id', type: "string" }
	 	     ,{ name: 'mchn_code', type: "string"  }
	 	     ,{ name: 'operator_id', type: "string"  }
	 	    ,{ name: 'operator_name', type: "string"  }
	 	    ,{ name: 'name_ko', type: "string"  }
	 	   ,{ name: 'name_cn', type: "string"  }
	 	   ,{ name: 'name_en', type: "string"  }
	 	  ,{ name: 'group_code', type: "string"  }
	 	 ,{ name: 'group_name', type: "string"  }
	 	 ,{ name: 'is_complished', type: "string"  }
	 	 ,{ name: 'rework', type: "string"  }
	 	  ],
         extraParams : {
        	 pcs_code: ''
         },
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/index/process.do?method=getMoldMapInfo',
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
				
				if(this.hasNull) {
					
					var blank ={
							unique_id: -1,
							mchn_code: '설비지정안함',
							operator_id: '',
							operator_name: '',
							name_ko: '',
							name_cn: '',
							name_en: '',
							group_code: '',
							group_name: ''
						};
						
						this.add(blank);
				}

			},
				beforeload: function(){
				
					
					switch(vCUR_MENU_CODE) {
					case 'EPC8':
						console_log('vSELECTED_PCSCODE=' + vSELECTED_PCSCODE);
						this.getProxy().setExtraParam('pcs_code', vSELECTED_PCSCODE);
						//this.proxy.extraParams.pcs_code = vSELECTED_PCSCODE;
					case 'EPC7':
						console_log('vSELECTED_PCSCODE=' + vSELECTED_PCSCODE);
						this.getProxy().setExtraParam('pcs_code', vSELECTED_PCSCODE);
						//this.proxy.extraParams.pcs_code = vSELECTED_PCSCODE;
					}
					
				}
		}
});