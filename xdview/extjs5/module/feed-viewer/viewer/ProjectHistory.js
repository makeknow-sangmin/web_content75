
var historyCustomerStore= Ext.create('Xdview.store.CmmCodeStore', {parentCode:'652', hasNull:true});
var historyCartypeStore= Ext.create('Xdview.store.CmmCodeStore', {parentCode:null, hasNull:true});//parent가 영구값이 아니고 초기값일 때 사용.
historyCartypeStore.getProxy().setExtraParam('orderBy', "CODE_NAME");
var searchPowerStore= Ext.create('Ext.data.ArrayStore', {
    fields: [
       {name: 'name'}
    ],
    data: [
//        ['특'],
//        ['상'],
//        ['중'],
//        ['하']
    ]
});

historyCustomerStore.load({
	callback:  function(records, operation, success) {
	    if(success){
	        for(var i=0; i<records.length; i++) {
	        	var rec = records[i];
	        	//console_logs('historyCustomerStore.load record', rec);
	        	//console_logs('historyCustomerStore.load record codeName', rec.get('codeName'));
	        	if( rec.get('codeName') == 'HMC') {
					historyCartypeStore.getProxy().setExtraParam('parentCode', rec.get('systemCode'));
					historyCartypeStore.load();	        	
	        	}
	        }
	        
	      }
    }
});

//Tree to Json  
function getJson(treeNode) {  
    treeNode.expandChildNodes();  
    var json = {};  
    var attributes = treeNode.attributes;  
    for(var item in attributes) {  
        //if (item == 'src' || item == 'text') {   //only use required attributes  
                    json[item] = attributes[item];  
        //}  
    }  
  
    json.children = [];  
    if(treeNode.childNodes.length > 0) {  
            for (var i=0; i < treeNode.childNodes.length; i++) {  
                    json.children.push(getJson(treeNode.childNodes[i]));  
            }  
    }  
    return json;  
}  


var projectStore=Ext.create('Xdview.store.ProjectStore', {hasNull:true});

Ext.define('HumanProjectHistory1', {
    extend: 'Ext.data.Model',
    fields: [
 {    name: 'id',   type: 'int' }, 
 {    name: 'no',   type: 'int' }, 
 'user_id', 'user_name', 'org', 'position', 'charge', 'gubun', 'ability', 'idp', 
 {    name: 'month',   type: 'float' },
 {    name: 'hour',   type: 'float' },
 'period', 'research_yn'
     ],
        proxy: {
			type: 'ajax',
	        api: {
	            read: CONTEXT_PATH + '/xdview/chart.do?method=getTable'
	        },
			reader: {
				type: 'json',
				root: 'datas',
				totalProperty: 'count',
				successProperty: 'success'
			}
		}
});

Ext.define('HumanProjectHistory2', {
            extend: 'Ext.data.Model',
            fields: ['p1', 'p2', 'p3', 'v2']
        });

Ext.define('HumanProjectHistory3', {
            extend: 'Ext.data.Model',
            fields: ['t1', 't2', 't3', 'v3']
        });

var storeHistory1=  Ext.create('Ext.data.Store', {
				pageSize: 35,
                model: 'HumanProjectHistory1'
            });
var storeHistory2=  Ext.create('Ext.data.Store', {
                model: 'HumanProjectHistory2'
            })
var storeHistory3=  Ext.create('Ext.data.Store', {
                model: 'HumanProjectHistory3'
            })

var gridHistoryTable1 = Ext.create('Ext.grid.Panel', {
	title:  makeGridTitle('<span style="color:#003471">조건검색 </span>결과'),
	store: storeHistory1,
	collapsible: false,
	border: true,
	resizable: true,
	scroll: true,
    width: "70%",
    region: 'center',
    layout   :'fit',
    forceFit: true,
    columns: [{
            	dataIndex: 'no',
            	text: 'Id',
            	cls:'mobis-grid-header', 
            	style: 'text-align:center',
            	//width: 50,
            	hidden:true,
            	sortable: true
            },{
                header: '사번',
                //width:70,
                cls:'mobis-grid-header', 
                dataIndex: 'user_id',
                resizable: true,
                style: 'text-align:center',
                hidden:true,
	            sortable: true
            },{
                header: '이름',
               // width:70,
                cls:'mobis-grid-header', 
                dataIndex: 'user_name',
                resizable: true,
                style: 'text-align:center',
	            sortable: true
            },
            {
				header: '소속',
				//width:100,
				cls:'mobis-grid-header', 
				dataIndex: 'org',
                resizable: true,
                style: 'text-align:center',
	            sortable: true
            },{
				header: '직급',
				//width:100,
				cls:'mobis-grid-header', 
				dataIndex: 'position',
                resizable: true,
                style: 'text-align:center',
	            sortable: true
            },{
                header: '직책',
                //width:60,
                cls:'mobis-grid-header', 
                dataIndex: 'charge',
                resizable: true,
                style: 'text-align:center',
	            sortable: true,
	            	           
		            field: {
		                xtype: 'textfield'
		            }
            },{

                header: '대표분야',
                cls:'mobis-grid-header', 
                dataIndex: 'gubun',
                resizable: true,
                style: 'text-align:center',
	            sortable: true,
	            	           
		            field: {
		                xtype: 'textfield'
		            }
            },{
                header: '대표기술',

                cls:'mobis-grid-header', 
                dataIndex: 'ability',
                resizable: true,
                style: 'text-align:center',
	            sortable: true,
	            	           
		            field: {
		                xtype: 'textfield'
		            }
            }
            ,
      		{
            	text: 'IDP Level',
                dataIndex: 'idp',
                cls:'mobis-grid-header', 
                //width:50,
               // resizable: true,
                 autoSizeColumn : true,
	                style: 'text-align:center',
	                align:'right',
	                summaryType: 'sum',
					summaryRenderer: function(value, summaryData, dataIndex) {
		                return '<b>' + Ext.util.Format.number(value, '0,000') + '</b>';
		            },
		            renderer: function(value, summaryData, dataIndex) {
		                return Ext.util.Format.number(value, '0,000');
		            },
	                field: {
	                    xtype: 'numberfield'
	                }
            }, {
				text: '투입기간',
				//width:5,
                dataIndex: 'month',
                cls:'mobis-grid-header', 
               // resizable: true,
                 autoSizeColumn : true,
                 width:50,
	                style: 'text-align:center',
	                align:'right',
		            renderer: function(value, summaryData, dataIndex) {
		                return Ext.util.Format.number(value, '0,000.0');
		            },
	                field: {
	                    xtype: 'numberfield'
	                }
            }/*, {
				text: '투입시기',
                dataIndex: 'period',
                cls:'mobis-grid-header', 
                resizable: true,
                autoSizeColumn : true,
               // flex:1,
	                style: 'text-align:center',
	                align:'center',
	                field: {
	                    xtype: 'numberfield'
	                }
            }*/
    ],
    bbar: getPageToolbar(storeHistory1, true, null, function () {
                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
                        })
});

var gridHistoryTable2 = Ext.create('Ext.grid.Panel', {
		store: storeHistory2,
            region: 'center',
			collapsible: false,
			height: '50%',
			width: '100%',
				title: makeGridTitle('제품별 투입이력'),
	border: true,
	resizable: true,
    columns: [{
        	dataIndex: 'id', text: 'ID',
        	hidden:true
            },
      {
        header: '제품',
        cls:'mobis-grid-header', 
        resizable: true,
        sortable: true,
        columns: [{
            	text: 'L1',
            	cls:'mobis-grid-header', 
                dataIndex: 'p1',
                width:120,
                resizable: true,
                autoSizeColumn : true,
                style: 'text-align:center',     
                align:'center'
            }, {
				text: 'L2',
				cls:'mobis-grid-header', 
                dataIndex: 'p2',
                width:120,
                resizable: true,
                autoSizeColumn : true,
                width:120,
                style: 'text-align:center',     
                align:'center'
            }, {
				text: 'L3',
				cls:'mobis-grid-header', 
                dataIndex: 'p3',
                width:120,
                resizable: true,
                autoSizeColumn : true,
                width:120,
                style: 'text-align:center',     
                align:'center'
            }]
    }, 
		{
            	text: '투입시기',
            	cls:'mobis-grid-header', 
                dataIndex: 'v2',
                resizable: true,
                autoSizeColumn : true,
                style: 'text-align:center',
                width: 150,
                align:'center'
            }]
//	,bbar: getPageToolbar(storeHistory2, true, '-', function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

var gridHistoryTable3 = Ext.create('Ext.grid.Panel', {
	store: storeHistory3,
	region: 'south',
    height: '50%',
    width: '100%',
    title: makeGridTitle('기술별 투입이력'),
	border: true,
	resizable: true,
	scroll: true,
 columns: [{
        	dataIndex: 'id', text: 'ID',
        	hidden:true
            },
      {
        header: '기술',
        cls:'mobis-grid-header', 
        resizable: true,
        sortable: true,
        columns: [{
            	text: 'L1',
            	cls:'mobis-grid-header', 
                dataIndex: 't1',
                resizable: true,
                width:120,
                autoSizeColumn : true,
                style: 'text-align:center',     
                align:'center'
            }, {
				text: 'L2',
				cls:'mobis-grid-header', 
                dataIndex: 't2',
                width:120,
                resizable: true,
                autoSizeColumn : true,
                //width:160,
                style: 'text-align:center',     
                align:'center'
            }, {
				text: 'L3',
				cls:'mobis-grid-header', 
                dataIndex: 't3',
                width:120,
                resizable: true,
                autoSizeColumn : true,
                //width:160,
                style: 'text-align:center',     
                align:'center'
            }]
    }, 
		{
            	text: '투입시기',
            	cls:'mobis-grid-header', 
                dataIndex: 'v3',
                resizable: true,
                autoSizeColumn : true,
                style: 'text-align:center',
                width: 150,
                align:'center'
            }]
//	,bbar: getPageToolbar(storeHistory3, true, '-', function () {
//                        	Ext.Msg.alert('안내', '준비중인 기능입니다.', function() {});
//                        })
});

function getTreeValues(records, target) {
    var ids = [];
    var names = [];
        	
    var values= [];
    Ext.Array.each(records, function(rec){
    	var id = rec.get('id');
    	var depth = rec.get('depth');
    	var text = rec.get('text');
    	
        ids.push(id);
        
        names.push(text);
        values.push(text+':'+depth);
    });
    
    var v = names.join(',');
    Ext.getCmp(target).setValue(v);
    HISTORY_PARAMS[target] = values.join(',');

				                    
}

function treatTechCombo() {

        	 var historyTechgTreeStore = Ext.create('Xdview.store.CmmTreeStore', {
		        root: {
			        text: '기술',
			        id: '1',
			        expanded: true
			    }
		    });
        	 
		    var tree = Ext.create('Ext.tree.Panel', {
		        store: historyTechgTreeStore,
		        rootVisible: false,
		        useArrows: true,
		        frame: false,
		        border: false,
		        width: 400,
				height: 400,
		        scroll  : true
		    });
		   
		     var win = Ext.create('Ext.Window', {
	            title:'기술',
	            width: 400,
	            height: 470,
	            modal : true,
	            resizable   : false,
	            closeAction: 'hide',
	            items: [tree],
	            buttons: [
	               	{
	                	text: '확인',
	            		handler: function(){
	            			if(win) {
	            				Ext.getCmp('projectHistory-tech').setValue('');
	            				HISTORY_PARAMS['projectHistory-tech'] = '';
								var records = tree.getView().getChecked();
	            				getTreeValues(records, 'projectHistory-tech');
	            				win.close();
	            			}
	            		}
	            	},{
	                	text: '취소',
	            		handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
	            }]
	        });
	        win.show();
	
} 
function treatProductCombo() {

        	 var historyProductTreeStore = Ext.create('Xdview.store.CmmTreeStore', {
		        root: {
			        text: '제품',
			        id: '3',
			        expanded: true
			    }
		    });
        	 
		    var tree = Ext.create('Ext.tree.Panel', {
		        store: historyProductTreeStore,
		        rootVisible: false,
		        useArrows: true,
		        frame: false,
		        border: false,
		        width: 400,
				height: 400,
		        scroll  : true
		    });
		   
		     var win = Ext.create('Ext.Window', {
	            title:'제품',
		        width: 400,
				height: 470,
	            modal : true,
	            resizable   : false,
	            closeAction: 'hide',
	            items: [tree],
	            buttons: [
	               	{
	                	text: '확인',
	            		handler: function(){
	            			if(win) {
	            				Ext.getCmp('projectHistory-product').setValue('');
	            				HISTORY_PARAMS['projectHistory-product'] = '';
	            				var records = tree.getView().getChecked();
	            				getTreeValues(records, 'projectHistory-product');
	            				win.close();
	            			}
	            		}
	            	},{
	                	text: '취소',
	            		handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
	            }]
	        });
	        win.show();
	
} 
function treatTaskCombo() {

        	 var historyTaskTreeStore = Ext.create('Xdview.store.CmmTreeStore', {
		        root: {
			        text: '태스크',
			        id: '2',
			        expanded: true
			    }
		    });
        	 
		    var tree = Ext.create('Ext.tree.Panel', {
		        store: historyTaskTreeStore,
		        rootVisible: false,
		        useArrows: true,
		        frame: false,
		        border: false,
		        width: 400,
				height: 400,
		        scroll  : true
		    });
		   
		     var win = Ext.create('Ext.Window', {
	            title:'태스크',
		        width: 400,
				height: 470,
	            modal : true,
	            resizable   : false,
	            closeAction: 'hide',
	            items: [tree],
	            buttons: [
	               	{
	                	text: '확인',
	            		handler: function(){
	            			if(win) {
	            				Ext.getCmp('projectHistory-task').setValue('');
	            				HISTORY_PARAMS['projectHistory-task'] = '';
	            				var records = tree.getView().getChecked();
	            				getTreeValues(records, 'projectHistory-task');
	            				win.close();
	            			}
	            		}
	            	},{
	                	text: '취소',
	            		handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
	            }]
	        });
	        win.show();
	
} 	
function treatOrgCombo() {
        	 var historyOrgTreeStore = Ext.create('Xdview.store.CmmTreeStore', {
		        root: {
			        text: '조직구분',
			        id: '531',
			        expanded: true
			    }
		    });
		    var tree = Ext.create('Ext.tree.Panel', {
		        store: historyOrgTreeStore,
		        rootVisible: false,
		        useArrows: true,
		        frame: false,
		        border: false,
		        width: 400,
				height: 400,
		        scroll  : true
		    });
		   
		     var win = Ext.create('Ext.Window', {
	            title:'조직구분',
		        width: 400,
				height: 470,
	            modal : true,
	            resizable   : false,
	            closeAction: 'hide',
	            items: [tree],
	            buttons: [
	               	{
	                	text: '확인',
	            		handler: function(){
	            			if(win) {

	            				//나중에 완료할 것.
								//var	myJSON = getJson(tree.getRootNode());  
								//console.log(Ext.encode(myJSON.children));
	            				Ext.getCmp('projectHistory-org').setValue('');
								HISTORY_PARAMS['projectHistory-org'] = '';
	            				var records = tree.getView().getChecked();
	            				getTreeValues(records, 'projectHistory-org');
	            				win.close();
	            			}
	            		}
	            	},{
	                	text: '취소',
	            		handler: function(){
		            		if(win) {
		            			win.close();
		            		}
		            	}
	            }]
	        });
	        win.show();
	
} 	

	

function redrawHistoryTable() {
	
	var searchCarmodel = Ext.getCmp('projectHistory-SearchCarmodel').getValue();
	var searchProject = Ext.getCmp('projectHistory-project').getValue();
	var searchUserName = Ext.getCmp('projectHistory-userName').getValue();
	var searchProjectType = Ext.getCmp('projectHistory-projectType').getValue();
	var searchOem = Ext.getCmp('projectHistory-SearchOem').getValue();
	
	
	
	HISTORY_PARAMS['projectHistory-project'] = searchProject;
	HISTORY_PARAMS['projectHistory-userName'] = searchUserName;
	HISTORY_PARAMS['projectHistory-SearchCarmodel'] = searchCarmodel;
	HISTORY_PARAMS['projectHistory-projectType'] = searchProjectType;
	HISTORY_PARAMS['projectHistory-SearchOem'] = searchOem;
	
		gridHistoryTable1.setLoading(true);
		
		HISTORY_PARAMS['cubeCode'] = 'PJ_MEMBER';
		HISTORY_PARAMS['projectChartType'] = 'PJ_HISTORY_TABLE1';
	
		selectedUser = null;
		selectedResrarchYn = null;
		
		storeHistory1.removeAll(true);
		storeHistory1.getProxy().setExtraParam('cubeCode', HISTORY_PARAMS['cubeCode'] );
		storeHistory1.getProxy().setExtraParam('projectChartType', HISTORY_PARAMS['projectChartType'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-project', HISTORY_PARAMS['projectHistory-project'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-userName', HISTORY_PARAMS['projectHistory-userName'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-SearchCarmodel', HISTORY_PARAMS['projectHistory-SearchCarmodel'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-tech', HISTORY_PARAMS['projectHistory-tech'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-product', HISTORY_PARAMS['projectHistory-product'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-task', HISTORY_PARAMS['projectHistory-task'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-org', HISTORY_PARAMS['projectHistory-org'] );
		
		storeHistory1.getProxy().setExtraParam('projectHistory-projectType', HISTORY_PARAMS['projectHistory-projectType'] );
		storeHistory1.getProxy().setExtraParam('projectHistory-SearchOem', HISTORY_PARAMS['projectHistory-SearchOem'] );
		
		
		storeHistory1.load(function(records){
			console_logs('storeHistory1 records', records);
			gridHistoryTable1.setLoading(false);
		});
			
		/*
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:HISTORY_PARAMS,
				success : function(response, request) {
					
					
					storeHistory1.removeAll(true);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];
					
					if(records==null || records==undefined || records.length==0) {
						storeHistory1.add({
							user_id: '',
							user_name: '해당 사항 없음',
					        org: '',
					        position: '',
					        charge: ''
					    });
					} else {
						
						
						for(var i=0; i<records.length; i++) {
							
							var rec = records[i];
	
							//console_logs('rec', rec);
							
							
							var period = '';
							var min_ym  = rec['min_ym'];
							if(min_ym!=null && min_ym!='' && min_ym.length>5) {
								var y = min_ym.substring(0,4);
								var m = min_ym.substring(4,6);
								period = y + '년' + m + '월-';
							}
							
							var max_ym  = rec['max_ym'];
							if(max_ym!=null && max_ym!='' && max_ym.length>5) {
								var y = max_ym.substring(0,4);
								var m = max_ym.substring(4,6);
								period = period + y + '년' + m + '월';
							}
							
							//console_logs('period', period);
							try {
								storeHistory1.add({
									id: rec['id'],
									no: (i+1),
									user_id: rec['user_id'],
									user_name: rec['user_name'],
							        org: rec['org'],
							        position: rec['position'],
							        charge: rec['charge'],
							        gubun: rec['gubun'],
							        ability: rec['ability'],
							        idp: rec['idp'],
							        month: rec['month']/12,
							        hour: rec['hour'],
							        period : period,
							        research_yn : rec['research_yn']
							    });
							} catch(e) {}
						
						}//endof for
					
					}

					gridHistoryTable1.setLoading(false);
				},// endof success for ajax
				failure:function(result, request) {
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {
			            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
			            }
			        });
				}
			}); //
			
			*/

	//}
}

 gridHistoryTable1.getSelectionModel().on({
    selectionchange: function(sm, selections) {
    	
    	//console_logs(selections.length);
    	if (selections.length) {
    		//console_logs(selections[0]);
    		var o = selections[0];
    		
    		var user_id =  o.get('user_id');
    		var id = o.get('id');
    		var research_yn = o.get('research_yn');
    		
    		//console_logs('user_id', user_id);
    		//console_logs('id', id );
    		//console_logs('research_yn', research_yn );
    		
    		selectedUser = user_id;
    		selectedResrarchYn = research_yn;
    		
    		storeHistory2.removeAll(true);
    		storeHistory3.removeAll(true);
	    	if(user_id!=null && user_id.length>0) {
				redrawHistoryTable2(id, user_id);
				redrawHistoryTable3(id, user_id);    		
    		}

    	}
    	
    }

});


function redrawHistoryTable2(id) {
	
	
		gridHistoryTable2.setLoading(true);
		
		HISTORY_PARAMS['history-user_uid'] = id;
		HISTORY_PARAMS['projectChartType'] = 'PJ_HISTORY_TABLE2';
		HISTORY_PARAMS['cubeCode'] = 'PJ_MEMBER';
	
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:HISTORY_PARAMS,
				success : function(response, request) {
					
					
					//storeHistory2.removeAll(true);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];
					

					if(records==null || records==undefined || records.length==0) {
						storeHistory2.add({
							p1: '',
							p2: '해당 사항 없음',
					        p3: ''
					    });
					} else {
						
						
						for(var i=0; i<records.length; i++) {
							
							var rec = records[i];
	
							//console_logs('rec', rec);
							try {
								storeHistory2.add({
									p1: (rec['l1']=='NULL')?'-':rec['l1'],
									p2: (rec['l2']=='NULL')?'-':rec['l2'],
									p3: (rec['l3']=='NULL')?'-':rec['l3'],
							        v2 :   rec['min_ym'] + '-' + rec['max_ym']
							    });
							} catch(e) {}
						
						}//endof for
					}

					gridHistoryTable2.setLoading(false);
				},// endof success for ajax
				failure:function(result, request) {
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {
			            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
			            }
			        });
				}
			}); //

}

function redrawHistoryTable3(id) {
	

		gridHistoryTable3.setLoading(true);
		
		HISTORY_PARAMS['history-user_uid'] = id;
		HISTORY_PARAMS['projectChartType'] = 'PJ_HISTORY_TABLE3';
		HISTORY_PARAMS['cubeCode'] = 'PJ_MEMBER';
	
	 	Ext.Ajax.request({
				url: CONTEXT_PATH + '/xdview/chart.do?method=getChart',				
				params:HISTORY_PARAMS,
				success : function(response, request) {
					
					
					//storeHistory3.removeAll(true);
					var val = Ext.JSON.decode(response.responseText);
					var records = val['records'];

					if(records==null || records==undefined || records.length==0) {
						storeHistory3.add({
							t1: '',
							t2: '해당 사항 없음',
					        t3: ''
					    });
					} else {
						
						
						for(var i=0; i<records.length; i++) {
							
							var rec = records[i];
	
							//console_logs('rec', rec);
							try {
								storeHistory3.add({
									t1: (rec['l1']=='NULL')?'-':rec['l1'],
									t2: (rec['l2']=='NULL')?'-':rec['l2'],
									t3: (rec['l3']=='NULL')?'-':rec['l3'],
							        v3 :  rec['min_ym'] + '-' + rec['max_ym']
							    });
							} catch(e) {}
						
						}//endof for
					}
					

					gridHistoryTable3.setLoading(false);
				},// endof success for ajax
				failure:function(result, request) {
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {
			            	//$(window.document.location).attr("href", "/xdview/index.do?method=main");
			            }
			        });
				}
			}); //

} 
/**
 * @class FeedViewer.FeedDetail
 * @extends Ext.panel.Panel
 *
 * Shows the details of a particular feed
 * 
 * @constructor
 * Create a new Feed Detail
 * @param {Object} config The config object
 */
Ext.define('FeedViewer.ProjectHistory', {

    extend: 'Ext.panel.Panel',
    alias: 'widget.projectHistory',
	frame   : false,
    border: false,
	split: true,
//	style: {
//		borderColor: '#EAEAEA'
//	},
	bodyPadding: '1 0 0 0',
	createToolbar1: function(){
        var items = [],
            config = {};
        if (!this.inTab) {
        	
	   			items.push({
			       emptyText: '프로젝트 구분',
	               xtype:          'combo',
	               id: 'projectHistory-projectType',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:     '',
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'3095'}),
	               width: 120,
	               cls : 'newCSS',
	               listConfig:{
	               	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}
	                },
	 	            listeners: {
     	                    select: function (combo, record) {
      	                    	var systemCode = record.get('systemCode');
     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
     	                    	
     	                    	projectStore.load();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
        	   			
			items.push({
			       emptyText: '고객구분',
	               xtype:          'combo',
	               id: 'projectHistory-SearchOem',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          HISTORY_PARAMS['projectHistory-SearchOem'],
	               triggerAction:  'all',
	               store: historyCustomerStore,
	               width: 120,
	               cls : 'newCSS',
	               listConfig:{
	               	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
	 	            listeners: {
     	                    select: function (combo, record) {
      	                    	var systemCode = record.get('systemCode');
     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
     	                  
     	                    	//console_logs('systemCode', systemCode);
     	                    	historyCartypeStore.getProxy().setExtraParam('parentCode', systemCode);
     	                    	historyCartypeStore.load();
		                        
		                        Ext.getCmp('projectHistory-SearchCarmodel').setValue('');

		                        projectStore.load();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');

			
			items.push({
			       emptyText: '차종',
	               xtype:          'combo',
	               id: 'projectHistory-SearchCarmodel',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:     '',
	               triggerAction:  'all',
	               store: historyCartypeStore,
	               width: 120,
	               cls : 'newCSS',
	               listConfig:{
	               	getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}
	                },
	 	            listeners: {
     	                    select: function (combo, record) {
      	                    	var systemCode = record.get('systemCode');
     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
     	                    	
     	                    	projectStore.load();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
       
             items.push({
      		       xtype: 'combo',
      		       id: 'projectHistory-project',
      		       width: 227,
      		       minChars: 0, 
				   triggerAction: 'producttitle', 
				   typeAhead: true, 
				   mode:           'remote',
	               editable:       true,
	               allowBlank: true,
	               multiSelect: true, 
	               queryMode: 'remote',
	               displayField:   'codeName',
	               valueField:   'systemCode',
	               value:     '',
	               emptyText: '프로젝트 명으로 검색',
	               fieldStyle: 'background-color: #164989; background-image: none;',
	               store: projectStore,
	               cls : 'newCSS',
	               listConfig:{
	   		            loadingText: '검색중...',
			            emptyText: '일치하는 항목 없음.',
			            // Custom rendering template for each item
			            
	               		getInnerTpl: function(){
	                		return '<div data-qtip="{codeName}" style="text-overflow: ellipsis;">[{systemCode}] {codeName}</div>';
	                	}
	                },
	 	            listeners: {
//     	                    select: function (combo, record) {
//      	                    	var systemCode = record.get('systemCode');
//     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
//     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
      		      	  
	            }, '-');
             
//            items.push({
//		        text: 'X',
//		        tooltip: '프로젝트 입력 지우기'
//		    });
             
  			items.push({
      		          xtype: 'textfield',
      		          id: 'projectHistory-userName',
      		          width: 120,
      		          emptyText: '이름',
					  fieldStyle: {
						  'background-color'  : '#164989',
  						  'background-image' : 'none',
						   'fontFamily'   : '"현대하모니 L",Malgun Gothic'
					  },
      		          cls : 'newCSS'
  		        	  ,listeners : {
                            'render' : function(cmp) {
                                cmp.getEl().on('keypress', function(e) {
                                    if (e.getKey() == e.ENTER) {
                                        redrawHistoryTable();
                                    }
                                });
                            }
                        }
      		      	  
	            }, '-');
                         
           
//	        items.push('-');
//	        items.push('-');
	        items.push('-');
	        items.push('-');
                      

	        items.push({
	        	xtype: 'component',
	            //html: '<div class="inputBT"><button type="button"><span class="search">검색</span></button></div>'
	        	html:'<div class="searchcon"><span class="searchBT"><button type="button" onClick="redrawHistoryTable();"></button></span></div>'
	        });
	        items.push('->');
    	
	        items.push({
				xtype : 'checkbox',
				id : 'chkAutorefresh8',
				boxLabel : 'Auto Refresh',
				tip: '탭 변경 시 차트 다시그리기',
				checked: true,
				listeners: {
			            change: function(field, newValue, oldValue, eOpts){
			            	AUTO_REFRESH = newValue;
			            	refreshCheckBoxAll();
			            },
			            render: function(c) {
				            Ext.create('Ext.tip.ToolTip', {
				                target: c.getEl(),
				                html: c.tip
				            });
				        }
	               }
			}, '-');
	       
	        items.push({
	        	xtype: 'component',
	        	html: '<div class="searchcon" onClick="openNewWindow();"><span class="newwinBT"><button type="button"></button></span></div>'
	            //html: '<div class="inputBT"><button type="button"><span class="search" onClick="openNewWindow();">새창으로 보기</span></button></div>'
	        });
	        config.items = items;
        
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },

	createToolbar2: function(){
        var items = [],
            config = {};
        if (!this.inTab) {
          
//   			items.push({
//			       emptyText: '경력연수',
//	               xtype:          'combo',
//	               hidden: true,
//	               id: 'projectHistory-searchCareer',
//	               mode:           'local',
//	               editable:       false,
//	               allowBlank: false,
//	               queryMode: 'remote',
//	               displayField:   'codeName',
//	               value:     '',
//	               triggerAction:  'all',
//	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'3088'}),
//	               width: 120,
//	               cls : 'newCSS',
//	               listConfig:{
//	               	getInnerTpl: function(){
//	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
//	                	}
//	                },
//	 	            listeners: {
//     	                    select: function (combo, record) {
//      	                    	var systemCode = record.get('systemCode');
//     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
//     	                    },
//     	                    change: function(sender, newValue, oldValue, opts) {
//				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
//				            }
//     	               }
//	            }, '-');
   				items.push({
		      		          xtype: 'triggerfield',
		      		          id: 'projectHistory-org',
		      		          emptyText: '조직구분',
		      		          readOnly:true,
		      		          style: 'cursor:pointer',
		      		          width: 120,
		      		      	  listeners : {
		      		      		   render: function( component ) {
						                component.getEl().on('click', treatOrgCombo  );
						                component.getEl().on('keypress', treatOrgCombo  );
						           }
		      		      	  },
		      		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		                },/* new Ext.form.Hidden({ id: 'projectHistory-org-hidden'  }),*/ '-');
   				items.push({
		      		          xtype: 'triggerfield',
		      		          id: 'projectHistory-task',
		      		          emptyText: '태스크',
		      		          readOnly:true,
		      		          style: 'cursor:pointer',
		      		          width: 120,
		      		      	  listeners : {
		      		      		   render: function( component ) {
						                component.getEl().on('click', treatTaskCombo );
						                component.getEl().on('keypress', treatTaskCombo );
						           }
		      		      	  },
		      		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		                }, /*new Ext.form.Hidden({ id: 'projectHistory-task-hidden'  }),*/ '-');
   				items.push({
		      		          xtype: 'triggerfield',
		      		          id: 'projectHistory-tech',
		      		          emptyText: '기술',
		      		          readOnly:true,
		      		          style: 'cursor:pointer',
		      		          width: 120,
		      		      	  listeners : {
		      		      		   render: function( component ) {
						                component.getEl().on('click', treatTechCombo );
						                component.getEl().on('keypress', treatTechCombo );
						           }
		      		      	  },
		      		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		                }, /*new Ext.form.Hidden({ id: 'projectHistory-tech-hidden'  }),*/ '-');
   				items.push({
		      		          xtype: 'triggerfield',
		      		          id: 'projectHistory-product',
		      		          emptyText: '제품',
		      		          readOnly:true,
		      		          style: 'cursor:pointer',
		      		          width: 120,
		      		      	  listeners : {
		      		      		   render: function( component ) {
						                component.getEl().on('click', treatProductCombo );
						                component.getEl().on('keypress', treatProductCombo );
						           }
		      		      	  },
		      		          trigger1Cls: Ext.baseCSSPrefix + 'form-search-trigger'
		                }
//   				, /*new Ext.form.Hidden({ id: 'projectHistory-product-hidden'  }),*/ '-');
//   			    items.push({
//                xtype: 'combo',
//                hidden: true,
//                emptyText: '기술역량',
//                id: 'projectHistory-tech-potential',
//                width: 120,
//                cls : 'newCSS',
//                store: searchPowerStore,
//		        tpl: Ext.create('Ext.XTemplate',
//		            '<tpl for=".">',
//		                '<div class="x-boundlist-item" style="font-family: 현대하모니 L,Malgun Gothic">{name}</div>',
//		            '</tpl>'
//		        ),
//		        listeners: {
//		            change: function(sender, newValue, oldValue, opts) {
//		                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
//		                output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
//		            }
//		        }
//            }
   			    
   			    , '-');
   			          
   			           
   			items.push({
			       emptyText: '시작 월',
	               xtype:          'combo',
	               id: 'projectHistory-Month-start',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	               hidden: true,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          '',
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
	               width: 110,
	               cls : 'newCSS',
	               listConfig:{
	               getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
	 	            listeners: {
     	                    select: function (combo, record) {
     	                    	var systemCode = record.get('systemCode');
     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				                //output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }/*,{
		        	xtype:'label',
		        	html:'<font color="#AAAAAA;">-</font>',
		        }*/);
           
   			
   			items.push({
			       emptyText: '종료 월',
	               xtype:          'combo',
	               id: 'projectHistory-Month-end',
	               mode:           'local',
	               editable:       false,
	               allowBlank: false,
	                hidden: true,
	               queryMode: 'remote',
	               displayField:   'codeName',
	               value:          '',
	               triggerAction:  'all',
	               store: Ext.create('Xdview.store.CmmCodeStore', {parentCode:'592', hasNull:false}),
	               width: 110,
	               cls : 'newCSS',
	               listConfig:{
	               getInnerTpl: function(){
	                		return '<div data-qtip="{systemCode}">{codeName}</div>';
	                	}			                	
	                },
	 	            listeners: {
     	                    select: function (combo, record) {
     	                    	var systemCode = record.get('systemCode');
     	                    	HISTORY_PARAMS[this.id] = combo.getValue();
     	                    },
     	                    change: function(sender, newValue, oldValue, opts) {
				                this.inputEl.setStyle('font-family', "현대하모니 L,Malgun Gothic");
				                //output.setBodyStyle('font-family', "현대하모니 L,Malgun Gothic");
				            }
     	               }
	            }, '-');
   			
           items.push('->');
                         
//            items.push({
//	        	xtype: 'component',
//	            html: '<div class="searchcon"><button type="button" onClick="popIdpPage(\'I\');">IDP/프로젝트 이력</button</div>'
//	        }, '-');

//			 items.push({
//	        	xtype: 'component',
//	            html: '<div class="searchcon"><button type="button" onClick="popIdpPage(\'P\');">이력카드 출력</button></div>'
//	        });
	        config.items = items;
        
        }
        else {
            config.cls = 'x-docked-border-bottom';
        }
        config.cls = 'my-x-toolbar-default';
        return Ext.create('widget.toolbar', config);
    },
	layoutConfig: {columns: 1, rows:1},
			    defaults: {
			        collapsible: false,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
	bodyPadding: 10,
    initComponent: function(){
       // this.display = Ext.create('widget.feedpost', {});
        this.dockedItems = [this.createToolbar1(), this.createToolbar2()];
        
        
		var east =  Ext.create('Ext.panel.Panel', {
           layout:'border',
            region: 'east',
            width: "30%",
            //minHeight: 300,
            layoutConfig: {columns: 1, rows:2},
			    defaults: {
			        //collapsible: true,
			        split: true,
			        cmargins: '2 0 0 0',
			        margins: '0 0 0 0'
			    },
            items: [gridHistoryTable2, gridHistoryTable3]
        });
        
        
        
        Ext.apply(this, {
            layout: 'border',
            items: [gridHistoryTable1, east ]
        });
       // this.relayEvents(this.display, ['opentab']);
       // this.relayEvents(this.east, ['rowdblclick']);
        this.callParent(arguments);
    },

    /**
     * Loads a feed.
     * @param {String} url
     */
    loadFeed: function(url){
        //this.grid.loadFeed(url);
       // this.display.loadFeed(url);
    },

    
    
    /**
     * Fires when a grid row is selected
     * @private
     * @param {FeedViewer.FeedGrid} grid
     * @param {Ext.data.Model} rec
     */
    onSelect: function(grid, rec) {
    	//console_logs('onSelect', rec);
       // this.display.setActive(rec);
    },

    
    /**
     * Reacts to the open all being clicked
     * @private
     */
    onOpenAllClick: function(){
       // this.fireEvent('openall', this);
    },


});