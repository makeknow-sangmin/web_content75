/**
 * BoardAsParentStore Store
 */
Ext.define('Mplm.store.BoardAsParentStore', {
    extend: 'Ext.data.Store',
	initComponent: function(params) {
		
		console_log('BoardStroreNotice.initComponent');
        // !! here may be some calculations and params alteration !!
        Ext.apply(this, {
        	hasNull: params.hasNull,
        	boardType: params.boardType,
        	pageSize: params.pageSize
        });

    },
    extraParams : {
    	gubun: '',
    	uid_comast: '-1'
    },
    boardType: '',
    pageSize: 5,
	fields:[     
	 	     { name: 'unique_id', type: "string" }
	 	     ,{ name: 'board_title', type: "string"  }
	 	     ,{ name: 'board_title_cng', type: "string"  }
	 	    ,{ name: 'board_name', type: "string"  }
	 	     ,{ name: 'board_content', type: "string"  }
	 	     ,{ name: 'board_name_cng', type: "string"  }
	 	    ,{ name: 'board_count', type: "string"  }
	 	   ,{ name: 'board_date', type: "string"  }
	 	   ,{ name: 'file_name', type: "string"  }
	 	  ,{ name: 'gubun', type: "string"  }
	 	 ,{ name: 'create_date', type: "string"  }
	 	     
	 	  ],
	 	 hasNull: false,
	 	sorters: [{
	        property: 'unique_id',
	        direction: 'DESC'
	    }],
	     proxy: {
	         type: 'ajax',
	         url: CONTEXT_PATH + '/admin/board.do?method=readReply&gubun=ASR',
	         reader: {
	         	type:'json',
	             root: 'datas',
	             totalProperty: 'count',
	             successProperty: 'success'
	         }
	         ,autoLoad: false
	     },
		listeners: {
			load: function(value) {
				if(this.hasNull) {
					var blank ={
							unique_id: '-1',
							board_title: '*',
							board_name: ''
					};
					this.add(blank);
				}
			},
			beforeload: function(){
				this.getProxy().setExtraParam('gubun', this.boardType);
				this.getProxy().setExtraParam('uid_comast', 0);
			}
		}
});