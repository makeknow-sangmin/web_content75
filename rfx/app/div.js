Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Rfx.model.*',
    'Rfx.store.*',
    'Rfx.view.*'
]);
function console_logs(tag, val) {
	try {
		console.log(tag, val);
	} catch(e) {}
}
Ext.onReady(function(){
	
//    Ext.define('UsrAst', {
//    	 extend: 'Ext.data.Model',
//    	 fields: [ 
//	               {name: 'user_id', type: 'string'},
//	               {name: 'user_name',  type: 'string'},
//	               {name: 'id',       type: 'int'},
//	               {name: 'email',  type: 'string'}
//		  	],
//    	    proxy: {
//				type: 'ajax',
//		        api: {
//		            read: CONTEXT_PATH + '/userMgmt/user.do?method=read',
//		            create: CONTEXT_PATH + '/userMgmt/user.do?method=create',
//		            update: CONTEXT_PATH + '/userMgmt/user.do?method=create',
//		            destroy: CONTEXT_PATH + '/userMgmt/user.do?method=destroy'
//		        },
//				reader: {
//					type: 'json',
//					root: 'datas',
//					totalProperty: 'count',
//					successProperty: 'success',
//					excelPath: 'excelPath'
//				},
//				writer: {
//		            type: 'singlepost',
//		            writeAllFields: false,
//		            root: 'datas'
//		        }
//			}
//    });
	 //UsrAst Store 정의
 	store = new Ext.data.Store({  
 		pageSize: 100,
   	 fields: [ 
              {name: 'user_id', type: 'string'},
              {name: 'user_name',  type: 'string'},
              {name: 'id',       type: 'int'},
              {name: 'email',  type: 'string'}
	  	],
//	    proxy: {
//			type: 'ajax',
//	        api: {
//	            read: CONTEXT_PATH + '/userMgmt/user.do?method=read',
//	            create: CONTEXT_PATH + '/userMgmt/user.do?method=create',
//	            update: CONTEXT_PATH + '/userMgmt/user.do?method=create',
//	            destroy: CONTEXT_PATH + '/userMgmt/user.do?method=destroy'
//	        },
//			reader: {
//				type: 'json',
//				root: 'datas',
//				totalProperty: 'count',
//				successProperty: 'success',
//				excelPath: 'excelPath'
//			},
//			writer: {
//	            type: 'singlepost',
//	            writeAllFields: false,
//	            root: 'datas'
//	        }
//		},
	  	proxy : {
  		type : 'ajax',
          url: CONTEXT_PATH + '/userMgmt/user.do?method=read',
  		reader : {
  			type : 'json',
  			root : 'datas',
  			totalProperty : 'count',
  			successProperty : 'success'
  		},
  		autoLoad : false
  	},
 		sorters: [{
             property: 'unique_id',
             direction: 'DESC'
         }]
 	}); 
//
//	 var store = Ext.create('Ext.data.Store', {
//			fields : [ 
//		               {name: 'board_name', type: 'string'},
//		               {name: 'board_title',  type: 'string'},
//		               {name: 'unique_id',       type: 'int'},
//		               {name: 'creator',  type: 'string'}
//			  	],
//			  	parentCode: '',
//			  	hasNull: true,
//			  	sorters: [{
//			          property: 'codeOrder',
//			          direction: 'ASC'
//			      }],
//			  	proxy : {
//			  		type : 'ajax',
//			          url: CONTEXT_PATH + '/admin/board.do?method=read',
//			  		reader : {
//			  			type : 'json',
//			  			root : 'datas',
//			  			totalProperty : 'count',
//			  			successProperty : 'success'
//			  		},
//			  		autoLoad : false
//			  	},
//			  	listeners: {
//			  		load: function(store, records, successful,operation, options) {
//			  			
////			  			console_logs('records', records);
//			  			
//			  			if(this.hasNull) {
//			  				
//			  				var blank ={
//			  					code: '',
//			  					codeName: '[전체]',
//			  					codeOrder: -1
//			  				};
//			  				this.add(blank);
//			  			}
//
//			  		},
//			  		beforeload: function(){
//			  			if(this.parentCode!=null && this.parentCode!='' && this.parentCode!=undefined) {
//			  				this.proxy.setExtraParam('parentCode', this.parentCode);
//			  			}
//			  		}
//			  }
//	 });		 

	grid = Ext.create('Ext.grid.Panel', {
		columns: [ 
        { text: '아이디',dataIndex: 'user_id', 
     	   width:100,
	            cls:'rfx-grid-header', 
	            style: 'text-align:center',     
	            align:'center'},
        { text: '이름',dataIndex: 'user_name',  
         	width:100,
	            cls:'rfx-grid-header', 
	            style: 'text-align:center',     
	            align:'center'},
	        { text: 'UID',dataIndex: 'unique_id',       
         	width:100,
	            cls:'rfx-grid-header', 
	            style: 'text-align:center',     
	            align:'center'},
	        {text: 'email', dataIndex: 'email',  width:100,
		            cls:'rfx-grid-header', 
		            style: 'text-align:center',     
		            align:'center'}
	           ],
		store: store
	});
	
	store.load(function(records){
		console_logs('records', records);
		grid.render(document.body);	
	});

});


