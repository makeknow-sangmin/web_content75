
function callGantt(ac_uid) {
	setLink(CONTEXT_PATH +   "/statistics/task.do?method=ganttMain&pj_uid=" + ac_uid);
}
function setLink(link) {
	
   var panelId = 'tempport';
   setThisLoading(panelId);	
		console_log(link);
	var iframeId =  'iframeGantt';
	console_log(iframeId);
	var fr =Ext.getCmp(iframeId);
	console_log(fr);
	
	var the_iframe = fr.getEl().dom;
	console_log(the_iframe);
	the_iframe.src = link;
}

function setThisLoading() {
	var tempportPnl = Ext.getCmp('tempport');
	if(tempportPnl!=null) {
		tempportPnl.setLoading(true);
	}
}

function clearThisLoading() {
	var tempportPnl = Ext.getCmp('tempport');
	if(tempportPnl!=null) {
		tempportPnl.setLoading(false);
	}
}

var viewHandler = function() {
 	var rec = grid.getSelectionModel().getSelection()[0];
 	
 	var ac_uid = rec.get('unique_id');
 	callGantt(ac_uid);
};

function popup3rdParty(id, name, pj_uid, StartDate,EndDate, parentId) {
	
	var formInner3 =  Ext.create('Ext.form.Panel', {
	        defaultType: 'textfield',
	        border: false,
	        bodyPadding: 1,
	        id : 'formpopup3rdParty',
			html: '이 영역을 다른 사내시스템에 연결할 수 있습니다.<hr><center><h1>전송정보</h1></center>'
			+ 'Id:' + id +'<br>'
			+ 'Name:' + name +'<br>'
			+ 'Project UID:' + pj_uid +'<br>'
			+ 'StartDate:' + StartDate +'<br>'
			+ 'EndDate:' + EndDate +'<br>'
			+ 'ParentId:' + parentId +'<br>'
	});

	
	var win = Ext.create('ModalWindow', {
    	title: name  + ' :: ' + '3rd party application program Link',
        width: 400,
        height: 300,
        minWidth: 250,
        minHeight: 180,
        layout: 'fit',
        plain:true,
        items: formInner3,
        buttons: [{
            text: '확인',
        	handler: function(){
	               
		       	if(win){
		       		win.close();
		       		// lfn_gotoHome();
		       	} 
		       }
		     },{
		     	text: '취소',
		     	handler: function(){
		     		if(win){
			       		win.close();
			       	} 
		     	}
	     }]//endofbutton arr
	});
	
	win.show();
}

function popupFileDown(id, name) {
	var myWin = Ext.create('ModalWindow', {
    	title: name  + ' :: ' + '파일 보기',
        width: 420,
        height: 300,
        minWidth: 250,
        minHeight: 180,
        layout: 'fit',
        plain:true,
        items: Ext.create('Mplm.grid.FileDownGrid', {group_code: id})//,
//        buttons: [{
//            text: '확인',
//        	handler: function(){ 
//		       	if(win){
//		       		myWin.close();
//		       		// lfn_gotoHome();
//		       	} 
//		       }
//		     }]//endofbutton arr
	});
	
	myWin.show();
}

Ext.onReady(function() {  

	
	//Project Store 정의
	Ext.define('Project', {
   	 extend: 'Ext.data.Model',
   	 fields: /*(G)*/vCENTER_FIELDS,
   	    proxy: {
				type: 'ajax',
		        api: {
		            read: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudread&menu_code=EPJ2', /*1recoed, search by cond, search */
//    				create: CONTEXT_PATH + '/sales/poreceipt.do?method=create', /*create record, update*/
		            create: CONTEXT_PATH + '/sales/poreceipt.do?method=cloudcreateroute', 
		            update: CONTEXT_PATH + '/sales/poreceipt.do?method=update',
		            destroy: CONTEXT_PATH + '/sales/poreceipt.do?method=destroy' /*delete*/
		        },
				reader: {
					type: 'json',
					root: 'datas',
					totalProperty: 'count',
					successProperty: 'success',
					excelPath: 'excelPath'
				},
				writer: {
		            type: 'singlepost',
		            writeAllFields: false,
		            root: 'datas'
		        } 
			}
	});
	
	store = new Ext.data.Store({  
		pageSize: getPageSize(),
		model: 'Project',
		//remoteSort: true,
		sorters: [{
            property: 'unique_id',
            direction: 'DESC'
        }]
	});
			

	store.load(function() {

	 		//var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: true} );
	 		
			grid = Ext.create('Ext.grid.Panel', {
				        store: store,
				        ///COOKIE//stateful: true,
				        collapsible: true,
				        multiSelect: true,
	                region: 'west',
					minSize: 200,
				    width:'20%',
	                height: '100%',
				        stateId: 'stateGrid' + /*(G)*/vCUR_MENU_CODE,
				        autoScroll : true,
				        autoHeight: true,
			        
				        bbar: getPageToolbar(store),
				        
				        columns: /*(G)*/vCENTER_COLUMNS,
				        viewConfig: {
				            stripeRows: true,
				            enableTextSelection: true,
     			            getRowClass: function(record) { 
	     			              return record.get('creator_uid')  == vCUR_USER_UID ? 'my-row' : ''; 
     			            } ,
				            listeners: {
				        		'afterrender' : function(grid) {
									var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
									elments.each(function(el) {
													//el.setStyle("color", 'black');
													//el.setStyle("background", '#ff0000');
													//el.setStyle("font-size", '12px');
													//el.setStyle("font-weight", 'bold');
							
												}, this);
										
									}
				            		,
				                itemcontextmenu: function(view, rec, node, index, e) {
				                    e.stopEvent();
				                    contextMenu.showAt(e.getXY());
				                    return false;
				                },
				                itemdblclick: viewHandler,
				                itemclick: viewHandler
				            }
				        },
				        title: getMenuTitle()
				        //,renderTo: Ext.getCmp('mainview-content-panel').body  //'MAIN_DIV_TARGET'

				    });
				    
				
			var panel = Ext.create('Ext.Panel', {
	   	 	  						        id:'tempport',
	   	 	  						        //xtype : "component",
	   	 	  						     	height: getCenterPanelHeight(),
	   	 	  						        title: 'Gantt Chart',
	   	 	  						        layout:'column',
	   	 	  						        autoScroll:true,
											split: true,
							                region: 'east',
							                width: '80%',
							                //flex:1,
							                height: '100%', 
	   	 	  						        items: [{
			  	 			        xtype : "component",
		  	 			            id: "iframeGantt",
			  	 	                height:getCenterPanelHeight()-55,
			  	 			        autoEl : {
			  	 			            tag : "iframe",
			  	 			            height: '100%',
			  	 			    	    width: '100%',
			  	 			    	    background: "#EAEAEA",
			  	 			    	    border: 0,
			  	 			    	    scrolling: 'no',
			  	 				        frameBorder: 0
			  	 				        ,onLoad: "clearThisLoading()"
			  	 				     }
			  	 					}] /*,
					        	      dockedItems: [{
					 			            xtype: 'toolbar',
					 			            items: projectToolBar
		        					}]*/
   	 	  						    });    
				    
				fLAYOUT_CONTENTMulti([grid,panel]);  
				

				if(vSEL_PJ_UID!='-1' && vSEL_PJ_UID!='') {
				 callGantt(vSEL_PJ_UID);
				}
				
				cenerFinishCallback();//Load Ok Finish Callback
					    //Property를 가린다.
				//Ext.getCmp("mainview-property-panel").collapse();
			    //Ext.getCmp("mainview-west-panel").collapse();
						

			
		}); //store load

		 	

});//OnReady
