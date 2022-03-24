/**
 * User Store
 */
Ext.define('Mplm.store.UserDeptStore', {
    extend: 'Ext.data.Store',
    initComponent: function(params) {
    // !! here may be some calculations and params alteration !!
    Ext.apply(this, {
    	dept_code: params.dept_code,
        dept_code_list: params.dept_code_list,
    	unique_id: params.unique_id,
    	cmpName: params.cmpName
    });
	},
    fields: [     
     		{ name: 'unique_id', type: "string" }
     		,{ name: 'user_id', type: "string"  }
     		,{ name: 'user_name', type: "string"  }
     		,{ name: 'dept_name', type: "string"  }
     		,{ name: 'dept_code', type: "string"  }
     		,{ name: 'email', type: "string"  }
     		,{ name: 'hp_no', type: "string"  }
     		,{ name: 'tel_no', type: "string"  }
     	  	  ],
 	sorters: [{
         property: 'user_name',
         direction: 'ASC'
     }],
         hasNull: false,
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/userMgmt/user.do?method=query',
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
				console_logs('>>>>> Aaa asd', store);
				if(gm.me().link == 'SRO2_CLD') {
					gUtil.deptUserStore = store;
				}
//				if(this.hasNull) {
//					
//					var blank ={
//							unique_id: '',
//							user_id: '',
//							user_name: '',
//							dept_name: '',
//							dept_code: '',
//							email: '',
//							hp_no: ''
//						};
//						
//						this.add(blank);
//				}//endofif

				switch(vCompanyReserved4) {
					case 'KBTC01KR':
						break;
					case 'BIOT01KR':
						break;
					default:
                        var blank ={
                            unique_id: '-1',
                            user_id: '',
                            user_name: '없음',
                            dept_name: '',
                            dept_code: '',
                            email: '',
                            hp_no: ''
                        };

                        this.add(blank);
				}
			},//endofload
			beforeload: function(){
				console_logs('>>>>>>>>> user beforeload', gUtil.getDeptCode);
				if(this.dept_code!=null){
					this.getProxy().setExtraParam('dept_code', this.dept_code);
					this.getProxy().setExtraParam('unique_id', this.unique_id);	
				}
				if(this.dept_code_list!=null) {
                    this.getProxy().setExtraParam('dept_code_list', this.dept_code_list);
                    this.getProxy().setExtraParam('unique_id', this.unique_id);
				}
				// if(gUtil.getDeptCode != null) {
				// 	this.getProxy().setExtraParam('dept_code', gUtil.getDeptCode);	
				// }
				
//				console_log('this:');
//				console_log(this.cmpName);
//				var obj = Ext.getCmp(this.cmpName); 
//				if(obj!=null) {
//					var val = obj.getValue();
//					console_log(val);
//					if(val!=null) {
//						var enValue = Ext.JSON.encode(val);
//						console_log(enValue);
//						this.getProxy().setExtraParam('queryUtf8', enValue);
//					}else {
//						this.getProxy().setExtraParam('queryUtf8', '');
//					}
//				}
			},
		}//endoflistner
});