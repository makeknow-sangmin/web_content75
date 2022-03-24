/**
 * CatonListStore
 */

Ext.define('Mplm.store.CatonListStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		hasNull: params.hasNull
    },
	fields:[     
	      { name: 'unique_id', type: "string" }
	 	 ,{ name: 'specification', type: "string"  }
	 	 ,{ name: 'class_code', type: "string"  }
	 	 ,{ name: 'item_code', type: "string"  }
	 	 ,{ name: 'item_name', type: "string"  }
	 	 ,{ name: 'description', type: "string"  }
	 	 ,{ name: 'model_no', type: "string"  }
	 	 ,{ name: 'comment', type: "string"  }
	 	 ,{ name: 'buyer_name', type: "string"  }
	 	 ,{ name: 'salesmap_uid', type: "string" }
	 	 ,{ name: 'description', type: "string"  }
	 	 ,{ name: 'stock_qty', type: "string"  }
	 	 ,{ name: 'srcahd_uid', type: "string"  }
	 	 ,{ name: 'useful_qty', type: "string"  }//유효재고(이월재고+입고수량-사용량)
	 	 ,{ name: 'total_useful_qty', type: "string"  }//총재고(이월재고-Lot대기수량+발주수량+발주예정수량)
	 	
	 	  ],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/purchase/material.do?method=readBuyCaton&standard_flag=K&item_code_is_not_null=Y&outbound_flag=N&class_code=B&start=0&limit=150&orderBy=item_code&ascDesc=asc',/**/
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         },
	         autoLoad: true
	     },
		listeners: {
			
			load: function(store, records, successful,operation, options) {
				console_logs('load records', records);
//				if(this.hasNull) {				
				var blank ={
						unique_id: '-1',
						item_name:'카톤없음',
						description:' ',
						item_code:' ',
						stock_useful_qty: 0
					};
					
					this.add(blank);
//					}
			},
				beforeload: function(){
					
						
				    var fullYear = gUtil.getFullYear() + '';
			        var month = gUtil.getMonth() + '';
			        if (month.length == 1) {
			            month = '0' + month;
			        }

			        var CurDate = fullYear+ month;
			        
			        //this.store.getProxy().setExtraParam('not_standard_flag', 'O');
			        this.getProxy().setExtraParam('parent_uid_assymap', CurDate);
					if(this.cmpName!=null&&this.cmpName.length>0){
						var obj = Ext.getCmp(this.cmpName); 
						console_logs(obj);
							if(obj!=null) {
								var val = obj.getValue();
								if(val!=null) {
									var enValue = Ext.JSON.encode(val);
									if(val.length>0){
										this.getProxy().setExtraParam('queryUtf8', enValue);
									}
									
								}else {
									this.getProxy().setExtraParam('queryUtf8', '');
								}//endofelse
							}//endofif
					}
					
//					var gUtil = Ext.create('Rfx.app.Util', {});
					

				}
		}
});