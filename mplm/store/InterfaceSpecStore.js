/**
 * InterfaceSpec Store
 */
//console_log('loading Mplm.store.SupastStore....');
Ext.define('Mplm.store.InterfaceSpecStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
        Ext.apply(this, {
        	pk: params.pk
        });

    },
    fields: [     
    		{ name: 'unique_id', type: "string" }
 			,{ name: 'revDate', type: "string" }
     		,{ name: 'pk', type: "string"  }
     		,{ name: 'f_Length', type: "string"  }
     		,{ name: 'unit', type: "string"  }
     		,{ name: 'wd_Direction', type: "string"  }
     		,{ name: 'ground', type: "string"  }
     		,{ name: 'add_Sticker', type: "string"  }
     		,{ name: 'start_Tape', type: "string"  }
     		,{ name: 'end_Tape', type: "string"  }
     		,{ name: 'finishing', type: "string"  }
     		,{ name: 'printed', type: "string"  }
     		,{ name: 'sppk', type: "string"  }
     		,{ name: 'double_tape', type: "string"  }
     		,{ name: 'custbl_min', type: "string"  }
     		,{ name: 'custbl_max', type: "string"  }
     		,{ name: 'custel_min', type: "string"  }
     		,{ name: 'custel_max', type: "string"  }
     		,{ name: 'innerbl_min', type: "string"  }
     		,{ name: 'innerbl_max', type: "string"  }
     		,{ name: 'innerel_min', type: "string"  }
     		,{ name: 'innerel_max', type: "string"  }
     		,{ name: 'el_goal', type: "string"  }
     		,{ name: 'rsize', type: "string"  }
     		,{ name: 'cust_size_low', type: "string"  }
     		,{ name: 'cust_size_high', type: "string"  }
     		,{ name: 'mk_size_low', type: "string"  }
     		,{ name: 'mk_size_high', type: "string"  }
     		,{ name: 'mk_size_mid', type: "string"  }
     		],
 	sorters: [{
         property: 'level1',
         direction: 'ASC'
     }],
     proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/interface/interface.do?method=readIFSpec',
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
	
				if(this.pk!=null){
					this.getProxy().setExtraParam('pk', this.pk);
				}
			}
		}//endoflistner
});