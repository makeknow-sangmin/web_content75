var group_code = null;

var dept_name_combo = null;
var user_name_combo = null;
var membertype_combo = null;

//수주관리 메뉴
Ext.define('Rfx.view.designPlan.ProjectPlmMemberView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'project-plm-member-view',
    inputBuyer : null,
    initComponent: function(){
    	
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.addSearchField('pj_name');
		

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.ProjectMold', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
        	//Orderby list key change
        	// ordery create_date -> p.create로 변경.
	        ,{
	        	creator: 'project.creator',
	        	unique_id: 'project.unique_id'
	        }
//        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['pjmember']
	        );
        
        
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        this.createGrid(arr);
        
        //grid 생성.
        // this.createGrid(searchToolbar, dateToolbar,buttonToolbar);

 //remove the items, 신규등록과 삭제 버튼 활성화
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==2||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });
        
        buttonToolbar.insert(7, '-');
        buttonToolbar.insert(7, this.setMisMatView);
        buttonToolbar.insert(7, this.setSubMatView);
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	/*this.copyCallback();*/
        	
        	var processGrid = Ext.getCmp('projectMemberGrid');
        	var mainmenu = Ext.getCmp( 'projectMemberview' + '-mainmenu' );
        	console_logs('setGridCallback selections',selections);

        	
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('projectMemberGrid');
            	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //project의 unique_id
            	group_code=rec.get('id');
   			//mainmenu.disable();
            	//processGrid.getStore().getProxy().setExtraParam('pj_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
            	//processGrid.getStore().load();
            	this.projectMemberGrid.getStore().getProxy().setExtraParam('pj_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
            	this.projectMemberGrid.getStore().load();
    			//gMain.selPanel.myCall();
            } else {
            }
        });
        
        this.propDisplayProp = false;
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        var pjStore = Ext.create('Mplm.store.PjStore', {hasNull: false} );
//        var pjMemberTypeStore = Ext.create('Mplm.store.PjMemberTypeStore', {hasNull: false} );
//	    var deptStore = Ext.create('Mplm.store.DeptStore', {hasNull: false} );
//	    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
	      
	    var pcsMemberdelete = Ext.create('Ext.Action', {
			 iconCls: 'af-remove',
			 text: gm.getMC('CMD_DELETE', '삭제'),
			 tooltip: '멤버 삭제 하기',
			 disabled: false,
			 handler: function() {
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '해당 프로젝트멤버를 삭제하시겠습니까?',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.pcsMemberdeleteConfirm(result);
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
			 }
		});



        //참여자 gridPjMember Tab 추가.
	    //gMain.addTabGridPanel('참여자', 'AUS4_HUMAN', {  
	    	this.addTabPjmemGridPanel('입력항목', 'AUS4_CLD', { 
				pageSize: 100,
				model: 'Rfx.model.PjMember',
				dockedItems: [{
								
									dock: 'top',
								  	xtype: 'toolbar',
								  	items   : [{
									    xtype: 'container',
									    title: '입력',
									    
								  	
								  	items : [{
								  		xtype: 'container',
								        
								        layout: 'hbox',
								        columns: 2,
								        items:[{
								        	xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								            	
								            	id :'pj_code',
						    			        xtype: 'combo',
						    			        emptyText: '프로젝트명',
						    			        store: pjStore,
						    			        displayField:   'pj_name',
						    			        valueField:   'pj_name',
						    			        disabled: false,
//						    			        queryMode: 'local',
						    			        triggerAction: 'all',
//						    			        mode: 'local',
						    			        editable:false,	
//						    			        minChars: 2,
						    			        width: 80,
								                name: 'h_reserved105'
								                
								            }]
								        }]
								  	},
								  	{
								  		xtype: 'container',
								        
								        layout: 'hbox',
								        columns: 2,
								        items:[{
								        	xtype: 'fieldcontainer',
								            layout: 'hbox',
								            items: [{
								            	
								                xtype: 'textfield',
								                width: 250,
								                name: 'aaa',
								                fieldLabel: '구분자 순번'
								            }]
								        }]
								  	}
								  	
								  	]
								  	}]
								  	
								  	
								  	
								  	
								  	
								  	/*items: [{
				    					id :'pj_code',
				    			        xtype: 'combo',
				    			        emptyText: '프로젝트명',
				    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				    			        store: pjStore,
				    			        displayField:   'pj_name',
				    			        valueField:   'pj_name',
				    			        disabled: false,
//				    			        queryMode: 'local',
				    			        triggerAction: 'all',
//				    			        mode: 'local',
				    			        editable:false,	
//				    			        minChars: 2,
				    			        width: 80,
				    			        listConfig:{
				    			            loadingText: 'Searching...',
				    			            emptyText: 'No matching posts found.',
				    			            getInnerTpl: function() {
				    			                return '<div data-qtip="{pj_name}">{pj_name}</div>';
				    			            }			                	
				    			        },
				    			        listeners: {
				    			        	'afterRender': function () {
				    			        		pj_code_combo=this;
							                },
				    			        	select: function (combo, record) {
				    			        		console_log('Selected Value : ' + combo.getValue());
				    	                    	var pj_code = record.get('pj_code');
				    	                    	
				    	                    	
//				    	                    	Ext.getCmp('gate_name').setValue(codeName); 
				    	                    	console_log('pj_code : ' + pj_code);
				    	                    	add_pj_code = pj_code;
				    	                    	
				    			        	}
				    			        }
				    				},{
										  id :'dept_combo',
								          name:           'dept_combo',
								          emptyText: '부서명',
								          width:130,
										  xtype:          'combo',
								          mode:           'local',
								          triggerAction:  'all',
								          editable:       false,
								          disabled: false,
								          allowBlank: false,
								          value: vCUR_DEPT_UID,
								          store: deptStore,
								          displayField:   'dept_name',
								          valueField:     'unique_id',
								          value: vCUR_DEPT_NAME,
								          fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								          queryMode: 'remote',
								          listConfig:{
								          	getInnerTpl: function(){
								          		return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
								          	}			                	
								          },
								          	listeners: {
												'afterrender' : function(grid) {
													dept_name_combo=this;
													var elments = Ext.select(".x-column-header",true);//.x-grid3-hd
													elments.each(function(el) {
																}, this);
														
													}
								            		,
								          		select: function (combo, record) {
								          			//console_logs('record',record);
								          			var name_combo = Ext.getCmp('user_name');
								          			selectedDeptUid = record.get('unique_id');
								          			//console_logs('selectedDeptUid',selectedDeptUid);
								          			name_combo.store.getProxy().setExtraParam('comdst_uid', selectedDeptUid);
								          			name_combo.setValue('');
								          			add_user_unique_id = '';
								          			name_combo.store.load(function(records) {
								          				console_log(records);
								          			});
								          		}//endofselect
								          	}
								  	},
								  	 {
				    					id :'user_name',
				    			        xtype: 'textfield',
				    			        emptyText: '이 름',
				    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				    			        store: userStore,
				    			        displayField:   'user_name',
				    			        valueField:   'unique_id',
				    			        disabled: false,
				    			        queryMode: 'local',
				    			        triggerAction: 'all',
				    			        mode: 'local',
				    			        editable:false,	
				    			        minChars: 2,
				    			        width: 80,
				    			        listConfig:{
				    			            loadingText: 'Searching...',
				    			            emptyText: 'No matching posts found.',
				    			            getInnerTpl: function() {
				    			                return '<div data-qtip="{unique_id}">{user_name}</div>';
				    			            }			                	
				    			        },
				    			        
				    			        listeners: {
				    			        	'afterRender': function () {
				    			        		user_name_combo=this;
							                },
				    			        	select: function (combo, record) {
				    			        		console_logs('user_name record',record);
				    			        		var user_unique_id = record.get('unique_id');
				    			        		var dept_code = record.get('dept_code');
				    			        		var dept_name = record.get('dept_name');
				    			        		var user_name = record.get('user_name');
				    			        		
				    			        		add_user_unique_id = user_unique_id;
				    			        	}
							                ,
				    			        	afterrender: function (cb) {
				    			        		Ext.Ajax.request({
				    			        			url: CONTEXT_PATH + '/userMgmt/user.do?method=query',
				    			        			params:{
				    			        				comdst_uid : vCUR_DEPT_UID
				    			        			},
				    			        			success : function(result, request) {
				    			        				var obj =Ext.decode(result.responseText);
				    			        				var name_combo = Ext.getCmp('user_name');
				    			        				name_combo.clearValue();
				    			        				name_combo.store.removeAll();
				    			        				var user_query_name = obj.datas[2].user_name;
				    			        				console_log(user_query_name);
				    			        				
				    			        				for(var i=0; i<obj.count; i++){
				    			        					var user_name = obj.datas[i].user_name;
				    			        					var unique_id = obj.datas[i].unique_id;
				    			        					name_combo.store.add({
				    			        						user_name: user_name,
				    			        						unique_id: unique_id
														 });
				    			        				}
				    			        			},
				    			        			failure: extjsUtil.failureMessage
				    			        		});	
				    			             }
				    			        }
				    				},{
				    					id :'membertype',
				    			        xtype: 'combo',
				    			        emptyText: 'TYPE',
				    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				    			        store: pjMemberTypeStore,
				    			        displayField:   'codeName',
				    			        valueField:   'systemCode',
				    			        disabled: false,
//				    			        queryMode: 'local',
				    			        triggerAction: 'all',
//				    			        mode: 'local',
				    			        editable:false,	
//				    			        minChars: 2,
				    			        width: 80,
				    			        listConfig:{
				    			            loadingText: 'Searching...',
				    			            emptyText: 'No matching posts found.',
				    			            getInnerTpl: function() {
				    			                return '<div data-qtip="{systemCode}">{codeName}</div>';
				    			            }			                	
				    			        },
				    			        listeners: {
				    			        	'afterRender': function () {
				    			        		membertype_combo=this;
							                },
				    			        	select: function (combo, record) {
				    			        		console_log('Selected Value : ' + combo.getValue());
				    	                    	var systemCode = record.get('systemCode');
				    	                    	var codeNameEn  = record.get('codeNameEn');
				    	                    	var codeName  = record.get('codeName');
				    	                    	
//				    	                    	Ext.getCmp('gate_name').setValue(codeName); 
				    	                    	console_log('systemCode : ' + systemCode 
				    	                    			+ ', codeNameEn=' + codeNameEn
				    	                    			+ ', codeName=' + codeName	);
				    	                    	add_member_type = systemCode;
				    	                    	
				    			        	}
				    			        }
				    				},
				    			     {
				    					id :'test_man',
				    			        xtype: 'combo',
				    			        emptyText: '검사반장',
				    			        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				    			        store: pjMemberTypeStore,
				    			        displayField:   'test_man',
				    			        valueField:   'test_man',
				    			        disabled: false,
//				    			        queryMode: 'local',
				    			        triggerAction: 'all',
//				    			        mode: 'local',
				    			        editable:false,	
//				    			        minChars: 2,
				    			        width: 80,
				    			        listConfig:{
				    			            loadingText: 'Searching...',
				    			            emptyText: 'No matching posts found.',
				    			            getInnerTpl: function() {
				    			                return '<div data-qtip="{pj_code}">{test_man}</div>';
				    			            }			                	
				    			        },
				    			        listeners: {
				    			        	'afterRender': function () {
				    			        		test_man_combo=this;
							                },
				    			        	select: function (combo, record) {
				    			        		console_log('Selected Value : ' + combo.getValue());
				    	                    	var test_man = record.get('test_man');
				    	                    	
				    	                    	
//				    	                    	Ext.getCmp('gate_name').setValue(codeName); 
				    	                    	console_log('test_man : ' + test_man);
				    	                    	add_test_man = test_man;
				    	                    	
				    			        	}
				    			        }
				    				},
				    					  	        
				    				'-',{
				                        xtype:'button',
				                        text: CMD_ADD,
				                        iconCls:'af-plus-circle',

				                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',
				                        width:   60,
				                        handler : function(){

				                        	if(group_code==null || group_code==''){
				                        		Ext.MessageBox.alert('Error','프로젝트를 선택하여주십시오', callBack);  
				                        		function callBack(id){  
				                        			return
				                        		} 
				                        		return;
				                        	}
				                        	if(add_user_unique_id==null || add_user_unique_id==''){
				                        		Ext.MessageBox.alert('Error','사용자를 선택하여주십시오', callBack);  
				                        		function callBack(id){  
				                        			return
				                        		} 
				                        		return;
				                        	}
				                        	if(add_member_type==null || add_member_type==''){
				                        		Ext.MessageBox.alert('Error','업무타입을 선택하여주십시오', callBack);  
				                        		function callBack(id){  
				                        			return
				                        		} 
				                        		return;
				                        	}
				                     	    
				                     	   Ext.Ajax.request({
			    			        			url: CONTEXT_PATH + '/production/schdule.do?method=createPJMemeberCLD',
			    			        			params:{
			    			        				group_code : group_code,
			    			        				user_unique_id : add_user_unique_id,
			    			        				role_type : add_member_type
			    			        			},
			    			        			success : function(result, request) {
			    			        				var result = result.responseText;
			                						console_logs('result:', result);
			                						if(result == 'false'){
			                							Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
			                						}else{
			                							gMain.selPanel.projectMemberGrid.getStore().getProxy().setExtraParam('pj_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
			                							gMain.selPanel.projectMemberGrid.getStore().load();
			                						}
			    			        			},
			    			        			failure: extjsUtil.failureMessage
			    			        		});//end of Ajax
				                        }//end of handler
				    				
				                     },//end of xtype:button
								
				    				
				    				,pcsMemberdelete
				    				]*/
				
				
									}],
					sorters: [{
			           property: 'dept_name',
			           direction: 'ASC'
			       }]
			}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	console_logs(rec);
	            	gMain.selPanel.selectPjMemberRecord = rec;
	            	gMain.selPanel.vSELECTED_PJ_UID = rec.get('id'); 
	            	console_logs('선택프로젝트멤버 unique_id',gMain.selPanel.vSELECTED_PJ_UID);
	            } else {
	            	
	            }
	        },
	        'projectMemberGrid'//toolbar
		);

		
        this.callParent(arguments);
        
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.store.load(function() {

        });


    },//////////////////////////////
    
    addTabPjmemGridPanel: function(title, menuCode, arg, fc, id) {

		gMain.extFieldColumnStore.load({
		    params: { 	menuCode: menuCode  },
		    callback: function(records, operation, success) {
		    	//console_logs('records>>>>>>>>>>', records);
		    	if(success ==true) {
		    		this.callBackWorkList(title, records, arg, fc, id);
		    	} else {//endof if(success..
					Ext.MessageBox.show({
			            title: '연결 종료',
			            msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
			            buttons: Ext.MessageBox.OK,
			            //animateTarget: btn,
			            scope: this,
			            icon: Ext.MessageBox['ERROR'],
			            fn: function() {

			            }
			        });
		    	}
		    },
		    scope: this
		});	
        	
	},
	
	callBackWorkList: function(title, records, arg, fc, id) {
		var gridId = id== null? this.getGridId() : id;
		
		var o = gMain.parseGridRecord(records, gridId);		
		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
		
		var modelClass = arg['model'];
		var pageSize = arg['pageSize'];
		var sorters = arg['sorters'];
		var dockedItems = arg['dockedItems'];
		var model = Ext.create(modelClass, {
        	fields: fields
        });
		/*var workListStore = new Ext.data.Store({  
			pageSize: pageSize,
			model: model,
			sorters: sorters
		});*/
		
		/*var mySorters = [{
	           property: 'p.serial_no',
	           direction: 'ASC'
	       }];*/
		
		//store.getProxy().setExtraParam('sort', JSON.stringify(mySorters));
		
		
		var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
		
		 this.workListStore = Ext.create('Rfx.store.HeavyPjMemListStore');
		
		this.workListStore.getProxy().setExtraParam('pj_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
		console_logs('rtgastuid >>>>>>>>>>>>>>>', gMain.selPanel.vSELECTED_RTGAST_UID);
		/*workListStore.load( function(records) {
			console_log('작업리스트>>>>>>>>>>', records); 
			if(records != undefined ) {

                 for (var i=0; i<records.length; i++){ 
	                	var obj = records[i];

	                	var system_code = obj.get('systemCode');
	                	
                   }
			 }
	    });*/
		
		//var projectMemberGrid =null;
		
		
		try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
		this.projectMemberGrid = Ext.create('Ext.grid.Panel', {
        	//id: gridId,
            store: this.workListStore,
            //store: store,
            title: title,
        	cls : 'rfx-panel',
        	border: true,
        	resizable: true,
        	scroll: true,
        	multiSelect: true,
            collapsible: false,
            layout          :'fit',
            forceFit: true,
            dockedItems: dockedItems,
            plugins: [cellEditing],
        	listeners: {
        		 itemcontextmenu: function(view, rec, node, index, e) {
	                    e.stopEvent();
	                    contextMenu.showAt(e.getXY());
	                    return false;
	                },
	                select: function(selModel, record, index, options){
	                    
	                },
        	     itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {
        	
        	     }, //endof itemdblclick
        	     cellkeydown:function (projectMemberGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

 	                if (e.getKey() == Ext.EventObject.ENTER) { 
 	                
 	                }


 	            }
        	},//endof listeners
            columns: columns
        });
		this.projectMemberGrid.getSelectionModel().on({
        	selectionchange: function(sm, selections) {
        		fc(selections);
        	}
        });
        var view = this.projectMemberGrid.getView();
        
        var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
            down: function(e) {
                var selectionModel = this.projectMemberGrid.getSelectionModel();
                var select = 0; // select first if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.projectMemberGrid.getSelectionModel().getSelection()[0].index + 1;
                }
                view.select(select);
               
            },
            up: function(e) {
                var selectionModel = this.projectMemberGrid.getSelectionModel();
                var select = this.projectMemberGrid.store.totalCount - 1; // select last element if no record is selected
                if ( selectionModel.hasSelection() ) {
                    select = this.projectMemberGrid.getSelectionModel().getSelection()[0].index - 1;
                }
                view.select(select);
             
            }
        });
        
        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
        
        tabPanel.add(this.projectMemberGrid);
	},	
	
	pcsMemberdeleteConfirm : function (btn){
	    var selections = this.projectMemberGrid.getSelectionModel().getSelection();
	    console_logs('btn',btn);
	    console_logs('selections',selections);
	    if (selections) {
	        //var result = MessageBox.msg('{0}', btn);
	        //if(result=='yes') {
	    	if(btn=='yes') {
	        	for(var i=0; i< selections.length; i++) {
	        		var rec = this.projectMemberGrid.getSelectionModel().getSelection()[i];
	        		console_log(rec);
	        		unique_id=rec.get('id');
		           			Ext.Ajax.request({
	            				url: CONTEXT_PATH + '/production/schdule.do?method=deletePjMember',
	            				params:{
	            					unique_id : unique_id,
	            				},
	            				success : function(result, request) {
	            					//store.load({});
	            					gMain.selPanel.projectMemberGrid.getStore().getProxy().setExtraParam('pj_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
        							gMain.selPanel.projectMemberGrid.getStore().load();
	            				},
	            				failure: extjsUtil.failureMessage
	            			});	
		           		 }
	           	
	        	}
	        }

	},
    
    myCall : function() {
    	this.worker_store();
    }
});
