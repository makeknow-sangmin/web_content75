var arrGroupsMc = [];
var arrGroupsHu = [];
var dayDiv = 'Day';
var selectedTab = 'MACHINE';
function seLinkAll(tabType) {
	var arr =null;
	if(tabType=='MACHINE') {
		arr = arrGroupsMc;
	} else if(tabType=='HUMAN') {
		arr = arrGroupsHu;
	}
	 for(var j=0; j<arr.length; j++) {
     	var systemCode = arr[j]['systemCode'];
     	var roleCode = arr[j]['roleCode'];
     	var link = CONTEXT_PATH +   "/statistics/chart.do?method=main&cubeCode=VMF7&group_code=" + systemCode + "&work_unit_gubun=" + roleCode
     				+ "&dayDiv=" + dayDiv;
     	
     	var panelId = 'panel' + systemCode;
             setThisLoading(panelId);
             setLink(systemCode, link);
	 }
}

function setLink(systemCode, link) {
	
   var panelId = 'panel' + systemCode;
   setThisLoading(panelId);	
		console_log(link);
	var iframeId = 'iframe' + systemCode;
	console_log(iframeId);
	var fr =Ext.getCmp(iframeId);
	console_log(fr);
	
	var the_iframe = fr.getEl().dom;
	console_log(the_iframe);
	the_iframe.src = link;
}

function setLinkLoad(systemCode) {

	//alert(systemCode)
	//sleep(3000);
   var panelId = 'panel' + systemCode;
   setThisLoading(panelId);	
	
	var iframeId = 'iframe' + systemCode;
	console_log(iframeId);
	var fr =Ext.getCmp(iframeId);
	console_log(fr);
	
	var the_iframe = fr.getEl().dom;
	console_log(the_iframe);

	the_iframe.contentWindow.location.reload();
}

function clearThisLoading(panelId) {
	var tempportPnl = Ext.getCmp(panelId);
	if(tempportPnl!=null) {
		console_log('clearThisLoading:' + panelId);
		tempportPnl.setLoading(false);
	}
}

function setThisLoading(panelId) {
	var tempportPnl = Ext.getCmp(panelId);
	if(tempportPnl!=null) {
		console_log('setThisLoading:' + panelId);
		tempportPnl.setLoading(true);
	}
}

//searchField = 
//	[
//		{
//			field_id: 'group_code'
//			,store: 'ProcessNameStore'
//			,displayField: 'systemCode'
//			,valueField: 'systemCode'
//			,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}] {codeName}</div>'
//		}
//	];

Ext.onReady(function() { 
//	makeSrchToolbar(searchField);
	LoadJs('/js/util/getdayDivToolBar.js');
	Ext.define('CodeStructure', {
	   	 extend: 'Ext.data.Model',
	   	 fields: /*(G)*/vCENTER_FIELDS,
	   	   proxy: {
					type: 'ajax',
			        api: {
			            read: CONTEXT_PATH + '/admin/codeStructure.do?method=read&menuCode=STD_PROCESS_NAME' //WORK_GROUP1'/*1recoed, search by cond, search */
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
			model: 'CodeStructure',
			sorters: [{
	            property: 'parent_system_code',
	            direction: 'ASC'
	        }]
		});
		
	 	store.load(function(records) {
	 			console_log('-----------------------------------------------------------------------------------'); 
				console_log(records); 
				console_log('-----------------------------------------------------------------------------------'); 
				
				if(records != undefined && records != null) {
					 for (var i=0; i<records.length; i++){ 
  	   	                	var codeName = records[i].get('codeName');
  	   	                	var roleCode = records[i].get('role_code');
  	   	                	var systemCode = records[i].get('system_code');
  	   	                	console_log('codeName:' + codeName);
  	   	                	console_log('roleCode:' + roleCode);
  	   	                	console_log('systemCode:' + systemCode);
  	   	                	console_log('dayDiv:' + dayDiv);
  	   	                	
  	   	                	var o = {
  	   	                			codeName: codeName,
  	   	                			systemCode: systemCode,
  	   	                			roleCode: roleCode,
  	   	                			dayDiv:dayDiv
  	   	                	};
  	   	                	
  	   	                	if(roleCode=='MACHINE') {
  	   	                		console_log('adding machine');
  	   	                		arrGroupsMc.push(o);
  	   	                	} else if(roleCode=='HUMAN') {
  	   	                		console_log('adding human');
  	   	                		arrGroupsHu.push(o);
  	   	                	}
					 } //endof for
					 console_log(arrGroupsMc);
					 var arrGroupsMc1 = [];
					 var arrGroupsMc2 = [];
					 var arrGroupsMc3 = [];
					 
					 for(var j=0; j<arrGroupsMc.length; j++) {
						 var o1 = arrGroupsMc[j];
						 console_log('arrGroupsMc : ');
						 console_log(o1);
						 var codeName = o1['codeName'];
						 var systemCode = o1['systemCode'];
						 var roleCode = o1['roleCode'];
						 console_log(codeName);
						 var panelId = 'panel' + systemCode;
						 var o = {
		  	                     title: '[' + roleCode.substring(0,1) + '] ' + systemCode + ' - ' + codeName,
	  	                    	 id: panelId,
		  	                     height:180,
		  	                   bodyStyle: { background: "#EAEAEA"        		}, 
		  	                   //style: 'background:#EAEAEA',
		  	                   bodyStyle:  'background:#EAEAEA',
		  	                     items: [{
			  	 			        xtype : "component",
		  	 			            id: "iframe" + systemCode,
			  	 	                height:180,
			  	 			        autoEl : {
			  	 			            tag : "iframe",
			  	 			            height: '100%',
			  	 			    	    width: '100%',
			  	 			    	    background: "#EAEAEA",
			  	 			    	    border: 0,
			  	 			    	    scrolling: 'no',
			  	 			            //src : CONTEXT_PATH +   "/statistics/chart.do?method=main&cubeCode=VMF7&group_code=" + systemCode + "&work_unit_gubun=" + roleCode,
			  	 				        frameBorder: 0
			  	 				        ,onLoad: "clearThisLoading('" + panelId + "')"
			  	 				     }
			  	 					}]
		  	   	           };
  	   	                	var pos = j%3;
  	   	                	if(pos==0) {
  	   	                		arrGroupsMc1.push(o);
  	   	                	} else if(pos==1) {
  	   	                		arrGroupsMc2.push(o);
  	   	                	} else {
  	   	                		arrGroupsMc3.push(o);
  	   	                	}
					 }//endof for
					 
					 console_log(arrGroupsHu);
					 var arrGroupsHu1 = [];
					 var arrGroupsHu2 = [];
					 var arrGroupsHu3 = [];
					 
					 console_log();
					 for(var j=0; j<arrGroupsHu.length; j++) {
						 var o1 = arrGroupsHu[j];
						 console_log(o1);
						 var codeName = o1['codeName'];
						 var systemCode = o1['systemCode'];
  	   	                var roleCode = o1['roleCode'];
						 console_log(codeName);
						 var panelId = 'panel' + systemCode;
						 var o = {
		  	                     title: '[' + roleCode.substring(0,1) + '] ' + systemCode + ' - ' + codeName,
	  	                    	 id: panelId,
		  	                     height:180,
		  	                   bodyStyle: { background: "#EAEAEA"        		}, 
		  	                   //style: 'background:#EAEAEA',
		  	                   bodyStyle:  'background:#EAEAEA',
		  	                     items: [{
			  	 			        xtype : "component",
		  	 			            id: "iframe" + systemCode,
			  	 	                height:180,
			  	 			        autoEl : {
			  	 			            tag : "iframe",
			  	 			            height: '100%',
			  	 			    	    width: '100%',
			  	 			    	    background: "#EAEAEA",
			  	 			    	    border: 0,
			  	 			    	    scrolling: 'no',
			  	 			            //src : CONTEXT_PATH +   "/statistics/chart.do?method=main&cubeCode=VMF7&group_code=" + systemCode + "&work_unit_gubun=" + roleCode,
			  	 				        frameBorder: 0
			  	 				        ,onLoad: "clearThisLoading('" + panelId + "')"
			  	 				     }
			  	 					}]
		  	   	           };
  	   	                	var pos = j%3;
  	   	                	if(pos==0) {
  	   	                		arrGroupsHu1.push(o);
  	   	                	} else if(pos==1) {
  	   	                		arrGroupsHu2.push(o);
  	   	                	} else {
  	   	                		arrGroupsHu3.push(o);
  	   	                	}
					 }//endof for
					 
					    var machineChartPnl = Ext.create('Ext.Panel', {
					        id:'main-panel-machine',
					        title: 'Machine',
					        //margins:'35 5 5 0',
					        layout:'column',
					        autoScroll:true,
					        defaults: {
					            layout: 'anchor',
					            defaults: {
					                anchor: '100%'
					            }
					        },
					        items:[ 
								{
								    columnWidth: 1/3,
								    baseCls:'x-plain',
								    bodyStyle:'padding:5px 0 5px 5px',
								    items: arrGroupsMc1
								},
								{
					                columnWidth: 1/3,
					                baseCls:'x-plain',
					                bodyStyle:'padding:5px 0 5px 5px',
								    items: arrGroupsMc2
								},
								{
					                columnWidth: 1/3,
					                baseCls:'x-plain',
					                bodyStyle:'padding:5px 0 5px 5px',
					                items:arrGroupsMc3
					            }
					      ],
					      dockedItems: [{
							  	xtype: 'toolbar',
							  	items: getdayDivToolBar()
						  	}],
	    	                listeners: {
	    	                    activate: function(tab){
	    	                        setTimeout(function() {
	    	                        	selectedTab = 'MACHINE';
//	    	                        	console_log(selectedTab);
//	    	                        	seLinkAll('MACHINE');
	    	                        }, 1);
	    	                    }
	    	                }
					    });
					    
					    var humanChartPnl = Ext.create('Ext.Panel', {
					        id:'main-panel-Human',
					        title: 'Worker',
					        //margins:'35 5 5 0',
					        layout:'column',
					        autoScroll:true,
					        defaults: {
					            layout: 'anchor',
					            defaults: {
					                anchor: '100%'
					            }
					        },
					        items:[ 
								{
								    columnWidth: 1/3,
								    baseCls:'x-plain',
								    bodyStyle:'padding:5px 0 5px 5px',
								    items: arrGroupsHu1
								},
								{
					                columnWidth: 1/3,
					                baseCls:'x-plain',
					                bodyStyle:'padding:5px 0 5px 5px',
								    items: arrGroupsHu2
								},
								{
					                columnWidth: 1/3,
					                baseCls:'x-plain',
					                bodyStyle:'padding:5px 0 5px 5px',
					                items:arrGroupsHu3
					            }
					      ],
					      dockedItems: [{
							  	xtype: 'toolbar',
							  	items: getdayDivToolBar()
						  	}],
	    	                listeners: {
	    	                    activate: function(tab){
	    	                        setTimeout(function() {
	    	                        	selectedTab = 'HUMAN';
//	    	                        	console_log(selectedTab);
//	    	                        	seLinkAll('HUMAN');
	    	                        }, 1);
	    	                    }
	    	                }
					    });
					    
					    var tabPanel  = Ext.widget('tabpanel', {
							id : 'tempport',
							title: getMenuTitle(),
					        activeTab: 0,
					        multiSelect: true,
					        stateId: 'stateGrid1' + /*(G)*/vCUR_MENU_CODE,
					        autoScroll: true,
					        split: true,
					        region: 'east',
					        width: '55%',
					        height: '100%',
					        items: [ machineChartPnl,  humanChartPnl]
					    });
						 
					fLAYOUT_CONTENT(tabPanel);
					cenerFinishCallback();
					
//					seLinkAll('MACHINE');

				}//endofif
	 	});//endof storeload
	
	
	
});