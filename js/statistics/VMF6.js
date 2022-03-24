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

//그룹의멤버정보
var GroupMemberInfo = [];
var selectedTab = '';
var ROLE_CODE = 'HUMAN';
var dayDiv = 'Day';

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
function getArrFromInfo(tabType) {
	console_log('tabType=' + tabType);
	for(var i=0; i<GroupMemberInfo.length; i++) {
		var o = GroupMemberInfo[i];
		var system_code = o['system_code'];
		var arr = o['members'];
		console_log('system_code=' + system_code);
		if(system_code==tabType) {
			console_log('returnning arr...');
			return arr;
		}
	}
	return null;
}

function setLink(systemCode, user_id, link) {

	   var panelId = 'panel' + systemCode  + user_id;
	   setThisLoading(panelId);	
			console_log(link);
		var iframeId = 'iframe' + systemCode  + user_id;
		console_log(iframeId);
		var fr =Ext.getCmp(iframeId);
		console_log(fr);
		
		var the_iframe = fr.getEl().dom;
		console_log(the_iframe);
		the_iframe.src = link;
	}

function seLinkAll(tabType) {
	console_log(GroupMemberInfo);
	var arr = getArrFromInfo(tabType);
	console_log(arr);
	if(arr!=null) {
		 for(var j=0; j<arr.length; j++) {
	     	var user_id = arr[j]['user_id'];
	     	var user_name = arr[j]['user_name'];
	     	var link = CONTEXT_PATH +   "/statistics/chart.do?method=main&cubeCode=VMF7&group_code=" + tabType + "&work_unit_gubun=" + ROLE_CODE
	     				+ '&work_unit=' + 'H_'+user_id + "&dayDiv=" + dayDiv;
	     	
	     	var panelId = 'panel' + tabType + user_id;
	     	console_log(panelId);
	         setThisLoading(panelId);
	         setLink(tabType, user_id, link);
		 }
	}
}

function getIframeArr(arrMember, systemCode) {
	var arrGroups = [];
	var arrGroups1 = [];
	var arrGroups2 = [];
	var arrGroups3 = [];
//	console_log('*********************************************************');
//	console_log('systemCode=' + systemCode);
	var qty=0;
	for(var i=0; i<arrMember.length; i++) {
		var o = arrMember[i];
		var group_code = o['group_code'];
		var user_id = o['user_id'];
		var user_name = o['user_name'];
//		console_log('group_code=' + group_code);
		if(systemCode==group_code) {
			 var panelId = 'panel' + systemCode + user_id;
			 var o = {
	                 title: user_id.substring(1) + ' - ' + user_name,
                  	 id: panelId,
	                  height:180,
	                   bodyStyle: { background: "#EAEAEA"        		}, 
	                   //style: 'background:#EAEAEA',
	                   bodyStyle:  'background:#EAEAEA',
	                     items: [{
  	 			        xtype : "component",
	 			            id: "iframe" + systemCode + user_id,
  	 	                height:180,
  	 			        autoEl : {
  	 			            tag : "iframe",
  	 			            height: '100%',
  	 			    	    width: '100%',
  	 			    	    background: "#EAEAEA",
  	 			    	    border: 0,
  	 			    	    scrolling: 'no',
  	 				        frameBorder: 0
  	 				        ,onLoad: "clearThisLoading('" + panelId + "')"
  	 				     }
  	 					}]
	   	           };
//			 console_log(i);
//			 console_log(o);
	                	var pos = qty%3;
	                	qty++;
	                	arrGroups.push({
	                		user_id : user_id,
	                		user_name : user_name,
	                		dayDiv:dayDiv
	                	});
	                	if(pos==0) {
	                		arrGroups1.push(o);
	                	} else if(pos==1) {
	                		arrGroups2.push(o);
	                	} else {
	                		arrGroups3.push(o);
	                	}
			
		}
	}
	
	var iO = {
			system_code : systemCode,
			members : arrGroups
	};
	GroupMemberInfo.push(iO);
	
//	console_log(systemCode);
//	console_log(arrGroups);
//	console_log(GroupMemberInfo);
	
//	console_log('arrGroups1=' + arrGroups1.length);
//	console_log('arrGroups2=' + arrGroups2.length);
//	console_log('arrGroups3=' + arrGroups3.length);
//	var nullO =  {
//	    title: '-',
//	    height:180,
//	    bodyStyle:  'background:#EAEAEA'
//	};
//	if(arrGroups1.length==0) {
//		arrGroups1.push(nullO);
//	}
//	if(arrGroups2.length==0) {
//		arrGroups2.push(nullO);
//	}
//	if(arrGroups3.length==0) {
//		arrGroups3.push(nullO);
//	}


	var retArr = [ 
					{
					    columnWidth: 1/3,
					    baseCls:'x-plain',
					    bodyStyle:'padding:5px 0 5px 5px',
					    items: arrGroups1
					},
					{
		             columnWidth: 1/3,
		             baseCls:'x-plain',
		             bodyStyle:'padding:5px 0 5px 5px',
					    items: arrGroups2
					},
					{
		             columnWidth: 1/3,
		             baseCls:'x-plain',
		             bodyStyle:'padding:5px 0 5px 5px',
		             items:arrGroups3
		         }
		   ];
//	console_log('==================');
//	console_log(retArr);
//	console_log('==================');
	return retArr;
		
		
}

function getMember(arrMember, systemCode) {

	
	var ret = '';
	for(var i=0; i<arrMember.length; i++) {
		var o = arrMember[i];
		var group_code = o['group_code'];
		var user_id = o['user_id'];
		var user_name = o['user_name'];
//		console_log(group_code);
		if(systemCode==group_code) {
			ret = ret + '[' + user_id + '] ' + user_name;
		}
	}
//	console_log(ret);
	return ret;
}

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
			model: 'CodeStructure',
			sorters: [{
	            property: 'parent_system_code',
	            direction: 'ASC'
	        }]
		});
		
	 	store.load(function(records) {
	 			//console_log('-----------------------------------------------------------------------------------'); 
				//console_log(records); 
				//console_log('-----------------------------------------------------------------------------------'); 
				
	 		
				if(records != undefined && records != null) {
					 
					var arrGroupCode = [];
					for (var i=0; i<records.length; i++){ 
   	                	var roleCode = records[i].get('role_code');
   	                	var systemCode = records[i].get('system_code');
   	                	if(roleCode==ROLE_CODE) {
     	   	               arrGroupCode.push(systemCode);	   	                	 
   	                	} //endofif
					 } //endof for
					
   	           		//소속멤버정보가져오기
   	           	    Ext.Ajax.request({
   	           			url: CONTEXT_PATH + '/production/schdule.do?method=readPcsMember',
   	           			params:{
   	           				arrGroupCode : arrGroupCode,
   	           				member_type: ROLE_CODE
   	           			},
   	           			success : function(result, request) {
   	           				var obj = Ext.decode(result.responseText);
   	           				var arrMember = obj['datas'];

	   	 					var panelArr = [];

	   	 					for (var i=0; i<records.length; i++){ 
	   	   	   	                	var codeName = records[i].get('codeName');
	   	   	   	                	var roleCode = records[i].get('role_code');
	   	   	   	                	var systemCode = records[i].get('system_code');
	   	   	   	                	
//	   	   	   	                	console_log('codeName:' + codeName);
//	   	   	   	                	console_log('roleCode:' + roleCode);
//	   	   	   	                	console_log('systemCode:' + systemCode);
	   	   	   	                	if(roleCode==ROLE_CODE ) {
	   	   	   	                		
	   	   	   	                		if(selectedTab=='') {
	   	   	   	                			selectedTab = systemCode;
	   	   	   	                		}
	   	   	   	                		
	   	   	   	                		var items = getIframeArr(arrMember, systemCode);
//	   	   	   	                		console_log('-------------------------------');
//	   	   	   	                		console_log(items);
//	   	   	   	                		console_log('-------------------------------');
	   	 	  	   	                	 var panel = Ext.create('Ext.Panel', {
	   	 	  						        id:'main-panel-' + systemCode,
	   	 	  						        title: systemCode, 
	   	 	  						        layout:'column',
	   	 	  						        autoScroll:true,
	   	 	  						        defaults: {
	   	 	  						            layout: 'anchor',
	   	 	  						            defaults: {
	   	 	  						                anchor: '100%'
	   	 	  						            }
	   	 	  						        },
	   	 	  						        
	   	 	  						        items: items, 
			   	 	  						dockedItems: [{
			   								  	xtype: 'toolbar',
			   								  	items: getdayDivToolBar()
				   							}],
	   	 	  						        listeners: {
	   	 		    	                    activate: function(tab){
	   	 		    	                        setTimeout(function() {
	   	 		    	                        	selectedTab = tab.title;
	   	 		    	                        	console_log(selectedTab);
	   	 		    	                        	//seLinkAll(selectedTab);
	   	 		    	                        }, 1);
	   	 		    	                    }
	   	 		    	                }
   	 	  						    });
	   	  	   	                	panelArr.push(panel);
	   	   	   	                }//endofif
	   	 					 } //endof for

   	           				
   	    				    var tabPanel  = Ext.widget('tabpanel', {
   	    						id : 'tempport',
   	    						title: getMenuTitle(),
   	    				        activeTab: 0,
   	    				        multiSelect: true,
   	    				        stateId: 'stateGrid'+ i + /*(G)*/vCUR_MENU_CODE,
   	    				        autoScroll: true,
   	    				        split: true,
   	    				        region: 'east',
   	    				        width: '55%',
   	    				        height: '100%',
   	    				        items:panelArr
   	    				    });
   	    						 
   	    					fLAYOUT_CONTENT(tabPanel);
   	    					cenerFinishCallback();
	   	                	//seLinkAll(selectedTab);
   	           			},
   	           			failure: extjsUtil.failureMessage
   	           		});	//endof Ext.Ajax.request({
	   	           	    
				}//endofif
	 	});//endof storeload
	
	
	
});