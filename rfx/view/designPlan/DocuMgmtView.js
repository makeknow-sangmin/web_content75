//Ext.require([
//    'Ext.data.*',
//    'Ext.grid.*',
//    'Ext.tree.*',
//    'Ext.tip.*',
//    'Ext.ux.CheckColumn'
//]);

//디자인 파일
Ext.define('Rfx.view.designPlan.DocuMgmtView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'docu-mgmt-view',
    

    initComponent: function(){

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	
		this.usePagingToolbar=false;

		//검색툴바 생성
		var docuToolbar =  Ext.create('widget.toolbar', {
	    		cls: 'my-x-toolbar-default2',
	    		items: [{
	    				id: 'target-routeTitlename-DDW8',
		    			xtype:'component',
		    			html: '프로젝트 및 Assembly를 선택하세요.',
		    			width: 400
		    		}, '->'
	    		]
	    	});

//        this.createStore('Rfx.model.DocuMgmt', [{
//	            property: 'unique_id',
//	            direction: 'DESC'
//	        }],
//	        gMain.pageSize/*pageSize*/
//	        //order by 조건절의 필드면과 j2_code 시스템코드가 다른 경우 추가합니다.
//        	//Orderby list key change
//        	// ordery create_date -> p.create로 변경.
//	        ,{
//	        	creator: 'creator',
//	        	unique_id: 'unique_id'
//	        }
////        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
////        	, ['assymap']
//	        );
        	
        this.store = Ext.create('Rfx.store.FtpFileStore');
        //그리드 생성
        this.createGrid([docuToolbar], {width: '70%'});
        
        this.setGridOnCallback(function(selections) {
        	
        	this.copyCallback();
        	
//        	var processGrid = Ext.getCmp('recvPoPcsGrid');
//        	var mainmenu = Ext.getCmp( 'recvPoview' + '-mainmenu' );

            if (selections.length) {
            	var rec = selections[0];
//                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('srcahd_uid'); //assymap의 child
//                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');

    			var status = rec.get('status');
    			
    			gUtil.enable(gMain.selPanel.attachform);
                
            } else {
            	gUtil.disable(gMain.selPanel.removeAction);
            	//mainmenu.enable();
            }
//        	processGrid.getStore().getProxy().setExtraParam('srcahd_uid', gMain.selPanel.vSELECTED_UNIQUE_ID);
//        	processGrid.getStore().load();
        });
        
        this.attachform = Ext.create('Ext.form.Panel',{
			region: 'north',
			bodyStyle: 'background: #F5F5F5;',
			//cls: 'background-FFFFFF',
		       items : [
		        		{
		                    xtype: 'container',
		                    layout:'hbox',
		                    pack: 'start',
		                    align: 'stretch',
		                    items:[     
		                
									{
										xtype : 'filefield',
										width:  60,
										reference: 'basicFile',
										name : 'uploadFile',
										fieldLabel : '파일첨부',
										labelAlign : 'right',
										labelWidth: 60,
										buttonOnly: true,
										buttonConfig: {
					    	                iconCls: 'af-upload'
					    	            },
										buttonText : '찾아보기',
										baseCls: 'textColorWhite',
										listeners : {
						                    'change': function(){
						                    	console_logs('vSELECTED_RECORD attachform:', gMain.selPanel.vSELECTED_RECORD);
						                    	 if(gMain.selPanel.attachform!=null) {
						        					 var form = gMain.selPanel.attachform.getForm();
						        		             	console_logs('attachform form info################', form);
//						        	                 if(form.isValid())
//						        	                 {
//						        	                	 
//						        		                var val = form.getValues(false);
//						        		                val["file_itemcode"] = gMain.selPanel.vFILE_ITEM_CODE;
//						        		                console_logs('attachform form.val info################', val);
//						        		                var pj_code = 'PHANTOM';
//						        		                var pj_uid = 0;
//						        		                
//						        		                if(gMain.selPanel.vSELECTED_RECORD!=null) {
//							        		                console_logs('gMain.selPanel.vSELECTED_RECORD', gMain.selPanel.vSELECTED_RECORD);
//							        		                pj_code = gMain.selPanel.vSELECTED_RECORD.get('pj_code');
//							        		                pj_uid = gMain.selPanel.vSELECTED_RECORD.get('ac_uid');			
//						        		                }
						        		                
//						        	                   	form.submit({
//						        	                        url: CONTEXT_PATH + '/uploader.do?method=uploadprpject&pj_code=' + pj_code + '&pj_uid=' + pj_uid,
//						        	                        waitMsg: '파일 업로드 중입니다.',
//						        	                        success: function(fp, o) {
//						        	                        	console_logs('submit fp', fp);
//						        	                        	console_logs('submit o', o);
//						        	                        	gMain.loadFileAttach(pj_uid, gMain.selectedMenuId + 'designFileAttach');
//						        	                        },
//						        	                    	failure : function(){
//						        	                    		console_log('failure');
//						        	                    		Ext.MessageBox.alert('파일업로드','Failed');
//						        	                    	}
//						        	                	});
						        		                form.submit({
						        		                	
						    		                        url: CONTEXT_PATH + '/supercom.do?method=ftpUpload&remotepath=' + gPath,
						    		                        waitMsg: 'Uploading Files...',
						    		                        success: function(fp, o) {
						    		                        	//win.close();
						    	                           		this.store.load(function() { });
						    		                        }
						        		                });
//						        	                 }					 
						        				 }
						                    	//gUtil.enable(fileRegistAction);
						                    }
				 	   		        	},
					                    render : function(c) {
					                        Ext.create('Ext.tip.ToolTip', {
					                            target: c.getEl(),
					                            html: c.name
					                        });
					                    }
									},
									{
							            xtype : 'button',
							            style: 'margin-left:100px;',
										iconCls: 'af-remove',
										text: '파일삭제',
										tooltip: '삭제할 파일을 선택하세요.',
										disabled: true,
										handler: function(widget, event) {
										    	Ext.MessageBox.show({
										            title: '삭제하기',
										            msg: '선택한 항목을 삭제하시겠습니까?',
										            buttons: Ext.MessageBox.YESNO,
										            fn: gMain.deleteConfirm,
										            icon: Ext.MessageBox.QUESTION
										        });
										}
							        }
									
							]
					
		        		}
					
				]
		});
        docuToolbar.insert(this.attachform);
        
        
        Ext.apply(this, {
            layout: 'border',
            items: [this.createWest(), this.createCenter()]
        });
    	
    	this.callParent(arguments);

    },
    setRelationship: function (relationship) {},
    
    createCenter: function() {
			return this.grid;
    },
    
    //----------------------- END OF CENTER --------------------
    
    createWest: function() {
 
    					var lineGap = 30;
    					var bHeight = 300;

    	// Context Popup Menu
    	this.contextMenu = Ext.create('Ext.menu.Menu', {
    	    items: [ this.editAssyAction, this.removeAssyAction ]
    	});
    	
    	
	    Ext.define('SrcAhd', {
		   	 extend: 'Ext.data.Model',
		   	 fields: [     
		       		 { name: 'unique_id', type: "string" }
		     		,{ name: 'item_code', type: "string"  }
		     		,{ name: 'item_name', type: "string"  }
		     		,{ name: 'specification', type: "string"  }
		     		,{ name: 'maker_name', type: "string"  }
		     		,{ name: 'description', type: "string"  }
		     		,{ name: 'specification_query', type: "string"  }
		     	  	  ],
		   	    proxy: {
		   			type: 'ajax',
		   	        api: {
		   	            read: CONTEXT_PATH + '/purchase/material.do?method=searchPart'
		   	        },
		   			reader: {
		   				type: 'json',
		   				root: 'datas',
		   				totalProperty: 'count',
		   				successProperty: 'success'
		   			}
		   		}
		   });    	
    	this.searchStore = new Ext.data.Store({  
    		pageSize: 16,
    		model: 'SrcAhd',
    		// remoteSort: true,
    		sorters: [{
                property: 'specification',
                direction: 'ASC'
            },
            {
                property: 'item_name',
                direction: 'ASC'
            }]

    	});
    	
		
		this.pjTreeGrid =
	    	Ext.create('Ext.tree.Panel', {
	    	 title: '프로젝트',
			 listeners: {
	             activate: function(tab){
	                 setTimeout(function() {
	                 	// Ext.getCmp('main-panel-center').setActiveTab(0);
	                     // alert(tab.title + ' was activated.');
	                 }, 1);
	             }
	         },

	         viewConfig: {
			    	listeners: {
						 itemcontextmenu: function(view, rec, node, index, e) {
							 console_logs('itemcontextmenu rec', rec);
							 selectedNodeId = rec.getId();
							 gMain.selPanel.treeSelectHandler(rec);
							
							 e.stopEvent();
							 gMain.selPanel.contextMenu.showAt(e.getXY());							 
							 
							 return false;
						 },
					    itemclick: function(view, record, item, index, e, eOpts) {                      
					    	gMain.selPanel.treeSelectHandler(record);
					    }// end itemclick
			    	}// end listeners
				},
		        // border: 0, 
	            dockedItems: [     
	            {
	                dock: 'top',
	                xtype: 'toolbar',
	                cls: 'my-x-toolbar-default6',
	                items: [
								{
								    	xtype: 'combo',
								    	fieldStyle: 'background-color: #FBF8E6; background-image: none;',
								           mode: 'local',
								           editable:false,
								           // allowBlank: false,
								           width: '100%',
								           queryMode: 'remote',
								           emptyText:'프로젝트를 선택하세요.',
								           displayField:   'folder_name',
								           valueField:     'unique_id',
								           store: this.cloudprojectStore,
								           listConfig:{
								            	getInnerTpl: function(){
								            		return '<div data-qtip="{pj_name}">{pj_code} <small><font color=blue>{pj_name}</font></small></div>';
								            	}			                	
								           },
								           triggerAction: 'all',
								           listeners: {
								           select: function (combo, record) {
							                 	console_log('Selected Value : ' + combo.getValue());
							                 	console_logs('record : ', record);
							                 	var pjuid = record.get('unique_id');
							                 	//pjuid = pjuid;
							                 	var pj_name  = record.get('pj_name');
							                 	var pj_code  = record.get('pj_code');

							                 	gMain.selPanel.assy_pj_code ='';
							                 	gMain.selPanel.selectedAssyCode = '';
							                 	gMain.selPanel.selectedPjCode = pj_code;
							                 	gMain.selPanel.selectedPjName = pj_name;
							                 	gMain.selPanel.selectedPjUid = pjuid;
							                 	
							                 	gMain.selPanel.loadTreeAll(pjuid);
							            	 

							                 }
							            }
						    }
	                ]
	            }]
			 ,
			 
			 rootVisible: false,
			// cls: 'examples-list',
			 lines: true,
			 useArrows: true,
			 // margins: '0 0 0 5',
			 store: this.mesProjectTreeStore
			} );    	
    	
		 this.west =  Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
			    layout:'border',
			    border: true,
			    region: 'west',
	            width: '30%',
			    layoutConfig: {columns: 2, rows:1},

			    items: [this.pjTreeGrid]
			});
    	return this.west;
    },

	setChildQuan : function (n) {
		var o = Ext.getCmp('childCount');
		if(o!=null) {
			o.update(''+ n);	
		}
	},
	
	setAssyQuan : function(n) {
		var o = Ext.getCmp('assy_quan');
		if(o!=null) {
			o.update(''+ n);
		}
	},
	setProjectQuan : function(n) {
		var o = Ext.getCmp('pj_quan');
		if(o!=null) {
			o.update(''+ n);	
		}
	},

	setMaking_quan : function(n) {
		var o = Ext.getCmp('making_quan');
		if(o!=null) {
			o.update(''+ n);	
		}
		
	},

	cloudprojectStore : Ext.create('Mplm.store.cloudProjectStore', {} ),
    mesProjectTreeStore : Ext.create('Mplm.store.MesProjectTreeStore', {}),

	selectAssy: function(routeTitlename, depth) {
		Ext.getCmp('target-routeTitlename-DDW8').update('<b>'+routeTitlename+'</b>'); 
	},

	loadTreeAllDef: function(){
		this.loadTreeAll(this.selectedPjUid);
	},
	loadTreeAll: function(pjuid) {
		//this.pjTreeGrid.setLoading(true);
		
		this.mesProjectTreeStore.removeAll(true);
		this.mesProjectTreeStore.getProxy().setExtraParam('pjuid', pjuid);
		this.mesProjectTreeStore.load( {		
			callback: function(records, operation, success) {

			}
		});
	},

	treeSelectHandler: function(record) {
		console_logs('treeSelectHandler record', record);
		this.selectedAssyRecord = record;
		

		this.selectedparent = record.data.id;

		this.selectedFolderName = record.data.text;
		this.routeTitlename = record.data.folder;
		this.selectedAssyDepth = record.data.depth;
		this.selectedAssyCode = record.data.assy_code;
		this.selectedPjQuan= record.raw.pj_quan;
		this.selectedAssyQuan= record.raw.bm_quan;
		this.selectedMakingQuan = this.selectedPjQuan*this.selectedAssyQuan;
		this.selectedFname = record.data.fname;
		this.selectedFolder = record.data.folder;
		this.selectedPjUid = record.raw.ac_uid;
		this.setProjectQuan(this.selectedPjQuan);
		this.setAssyQuan(this.selectedAssyQuan);
		this.setMaking_quan(this.selectedMakingQuan);

		this.assy_pj_code = this.selectedPjCode;
		this.selectedAssyCode = this.selectedPjCode + '-' + this.selectedAssyCode;	
		this.store.getProxy().setExtraParam('parent', this.selectedparent);
		this.store.getProxy().setExtraParam('pjuid', this.selectedPjUid);
		
		this.store.getProxy().setExtraParam('newFolder', this.selectedFolder);
		
    	this.store.load(function(records){

    		gMain.selPanel.selectAssy(gMain.selPanel.routeTitlename, gMain.selPanel.selectedAssyDepth);
//    		gMain.selPanel.setChildQuan(records.length);
    		
    	});

	}, deleteFolderConfirm: function(btn){

	    var selections = grid.getSelectionModel().getSelection();
	    if (selections) {
	        var result = MessageBox.msg('{0}', btn);
	        var count = 0;
	        if(result=='yes') {
	        	var fileNames = [];
	        	
	        	for(var i=0; i< selections.length; i++) {
	        		var rec = selections[i];
	        		var name = Ext.JSON.encode(rec.get('name') );
	        		fileNames.push(name);
	        		count++;
	        	}
	        	Ext.Ajax.request({
	    			url: CONTEXT_PATH +  '/supercom.do?method=deleteFolder',
	    			params:{
	    				path : Ext.JSON.encode(gMain.selPanel.gPath),
	    				fileNames : fileNames
	    			},
	    			success : function(result, request) {
	    	        	store.load(function() {});
	    			},
	    			failure: extjsUtil.failureMessage
	    		});

	        }
	    }
	}, deleteConfirm: function(btn){

	    var selections = grid.getSelectionModel().getSelection();
	    if (selections) {
	        var result = MessageBox.msg('{0}', btn);
	        var count = 0;
	        if(result=='yes') {
	        	var fileNames = [];
	        	
	        	for(var i=0; i< selections.length; i++) {
	        		var rec = selections[i];
	        		var name = Ext.JSON.encode(rec.get('name') );
	        		fileNames.push(name);
	        		count++;
	        	}
	        	Ext.Ajax.request({
	    			url: CONTEXT_PATH +  '/supercom.do?method=delete',
	    			params:{
	    				path : Ext.JSON.encode(gMain.selPanel.gPath),
	    				fileNames : fileNames
	    			},
	    			success : function(result, request) {
	    	        	store.load(function() {});
	    			},
	    			failure: extjsUtil.failureMessage
	    		});

	        }
	    }
	},
	expandAllTree: function() {
		if(this.pjTreeGrid!=null) {
			this.pjTreeGrid.expandAll();
		}
	},
	
	gPath: null,
	pjTreeGrid: null,
	
    selectedPjUid : '',
    selectedAssyUid : '',
    selectionLength : 0,
    selectedAssyCode:'',
    selectedPjCode:'',
    selectedPjName:'',
    selectedAssyDepth:0,
    selectedAssyName:'',
    selectedparent:'',
	selectedFolderName : '-',
	
    assy_pj_code:'',
    ac_uid:'',
    routeTitlename : ''
});
