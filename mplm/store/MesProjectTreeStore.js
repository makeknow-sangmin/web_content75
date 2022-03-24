Ext.define('Mplm.store.MesProjectTreeStore', {
    extend: 'Ext.data.TreeStore',
	initComponent: function(params) {
	
		Ext.apply(this, {
        	lang: params.lang
        });

    },
    fields:[     
                 {name : 'id'}
                 ,{name : 'callType'}
                 ,{name : 'context'}
                 ,{name : 'parent'}
                 ,{name : 'node'}
                 ,{name : 'text'}
                 ,{name : 'ac_uid'}
                 ,{name : 'pl_no'}
                 ,{name : 'unique_uid'}
                 ,{name : 'folder'}
//	        { name: 'context', type: "string" },
//	         { name: 'id', type: "int" }
//	 	     ,{ name: 'name', type: "string"  }
//	 	     ,{ name: 'node', type: "string"  }
//	 	     ,{ name: 'parent', type: "string"  }
//	 	     ,{ name: 'callType', type: "string"  }
////	 	     ,{ name: 'description', type: "string"  }
////		 	 ,{ name: 'cav_no', type: "string"  }
////			 ,{ name: 'regist_date', type: "string"  }
////		     ,{ name: 'delivery_plan', type: "string"  }
////		     ,{ name: 'pj_type', type: "string"  }
////		     ,{ name: 'model_name', type: "string"  }
////		     ,{ name: 'pm_id', type: "string"  }
////		     ,{ name: 'is_complished', type: "string"  }
////		     ,{ name: 'selling_price', type: "string"  }
////		     ,{ name: 'reserved_double5', type: "string"  }
//		     
	 	  ],
    lang: '',
    proxy: {
         type: 'ajax',
         url: CONTEXT_PATH + '/design/project.do?method=getAllAssyTree',
//       params:{
//    	   menucode : 'DBM7'
//	 },
         reader: {
             type: 'json'//,
            // root: 'datas'
         }
           
     },
	listeners: {
	    beforeload: function(sender,node,records){
	    	var parent=node.node.data.text;
	    	var id = node.node.data.id;
	    	var context = node.node.data.context;
	    	var folder = node.node.data.folder;

	    	if(parent!='Root'){
//	    		var callType = '';
//	    		this.getProxy().setExtraParam('parent', id);
//		    	this.getProxy().setExtraParam('callType', callType);
		    	
		    	folder = Ext.JSON.encode(folder);
		    	
		    	this.getProxy().setExtraParam('parentFolder', folder);
	    	}
	    	else{
//	    		var callType = 'TOP';
//		    	this.getProxy().setExtraParam('callType', callType);
	    	}
	    },
	    load: function(a,b,c){
	    	
	    	console_logs('tree records a', a);
	    	console_logs('tree records b', b);
	    	console_logs('tree records c', c);
	    	console_logs('selMainPanelName', gMain.selMainPanelName);
	    	console_logs('selectedMenuId', gMain.selectedMenuId);
	    	
	    	switch(gMain.selectedMenuId) {
	    	case 'design-plan-DBM7':
	    	case 'design-plan-DBM9':
	    	case 'design-plan-DDW8':
	    		gMain.selPanel.expandAllTree();	
	    	}
	    	

//            setTimeout(function() {
//           	 console_logs('tree panel', 'expanding....');
//				gMain.selPanel.expandAllTree();
//            }, 2);
	    }//endofload
	}
});
