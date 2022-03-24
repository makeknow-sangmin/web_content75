//설비현황
Ext.define('Rfx.view.equipState.HEAVY5_MachineDoosView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'machine-doos-view',
    initComponent: function(){
    	
        var location;

    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
		/*this.addSearchField (
				{
					field_id: 'pcs_code'
					,store: 'ProcessNameStore'
					,displayField: 'system_code'
					,valueField: 'system_code'
					//,width: 120
					,innerTpl	: '<div data-qtip="{system_code}">[{system_code}] {codeName}</div>'
				});	*/
/*		this.addSearchField (
				{
					field_id: 'owner_name'
					,store: 'UserStore'
					,displayField: 'user_name'
					,valueField: 'user_name'
					//,width: 120
					,innerTpl	: '<div data-qtip="{user_id}">[{dept_name}] {user_name}</div>'
				});	*/
//		this.setDefComboValue('owner_name', 'valueField', '[영업팀] test01');
		this.addSearchField('mchn_code');
		this.addSearchField('reserved_varchar1');

//		this.addSearchField('pcs_code');
		this.addSearchField('name_ko');
		
		
		
	     //주문작성 Action 생성
	       this.repairAction = Ext.create('Ext.Action', {
				 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
				 text: '장애 등록',
				 tooltip: '장애 등록 진행',
				 disabled: true,
				 handler: function() {
					 gm.me().treatRepair();
				 }
			});


		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        buttonToolbar.insert(6, this.repairAction);
        buttonToolbar.insert(6, '-');


        if(vCompanyReserved4 == 'KYNL01KR') {
            this.createStore('Rfx.model.HEAVY5_Machine_KYNL', [{
                    property: 'mchn_code',
                    direction: 'ASC'
                }],
                gMain.pageSize/*pageSize*/,{}
                ,['pcsmchn']
            );
		} else {
            this.createStore('Rfx.model.HEAVY5_Machine', [{
                    property: 'mchn_code',
                    direction: 'ASC'
                }],
                gMain.pageSize/*pageSize*/,{}
                ,['pcsmchn']
            );
		}


        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        var current_win;

        var option = {
        		listeners : {
        			itemdblclick: function(dataview, record, item, index, e) {
        				if(current_win != undefined) {
        					current_win.hide();
        				}
        	        	var rec = record;
        	        	gMain.selPanel.vSELECTED_RECORD = rec;
        	        	if(rec!=undefined && rec!=null) {
        	        		gMain.returnPath(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach',
        	        		function(r) {
        	        			location = r;
        	        			var port_no = 0;
        	        			switch(window.location.hostname) {
        	        			case '192.168.0.201':
        	        			case 'localhost':
        	        				port_no = 9080;
        	        				break;
        	        			case '203.228.89.105':
        	        				port_no = 19080;
        	        				break;
        	        			default:
        	        				port_no = 9080;
        	        			}
        	        			
        	        			var img_width = 0;
        	        			var img_height = 0;
        	        			var max_width = 0;
        	        			var max_height = 0;
        	        			Ext.onReady(function() {
        	        			    Ext.create('Ext.Img', {
        	        			        src: 'http://' + window.location.hostname + ':' + port_no + '/'+ location,
        	        			        listeners: {
        	        			            render: function() {
        	        			                this.mon(this.getEl(), 'load', function(e) {
        	        			                    img_width = this.getWidth();
        	        			                    img_height = this.getHeight();
        	        			                    if(img_width > 1000) {
        	        			                    	max_width = 1000;
        	        			                    } else {
        	        			                    	max_width = img_width;
        	        			                    }
        	        			                    if(img_height > 800) {
        	        			                    	max_height = 800;
        	        			                    } else {
        	        			                    	max_height = img_height;
        	        			                    }
        	        			                    
        	        			                    var win = Ext.create('Ext.window.Window',{
        	                        			        width : max_width,
        	                        			        height : max_height,
        	                        			        title : '장비 이미지 보기',
        	                        			        html : ['<p style="text-align: center">',
        	                        			        	'<img src="http://' + window.location.hostname + ':' + port_no + '/'+ 
        	                        			        	location +'" style="max-width: ' + max_width + 'px; max-height: '+ max_height +'px;"/>',
        	                        			        	'</p>']
        	                        			    });
        	                        				current_win = win;
        	                        				current_win.show();
        	        			                });
        	        			            }
        	        			        },
        	        			        renderTo: Ext.getBody()
        	        			    });
        	        			});
        	        		});
        	        	}
        	    	}
        		}
        };
        
        //grid 생성.
        this.createGridCore(arr, option);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        if(this.link == 'EMC1_DS') {
        	switch(vCompanyReserved4){
        	case 'DOOS01KR':
                this.store.getProxy().setExtraParam('mchn_type', 'EQ');
                break;
			case 'KYNL01KR':
				this.store.getProxy().setExtraParam('mchn_type', 'EQ');
                this.store.getProxy().setExtraParam('orderBy', 'mchn_code');
				break;
        	default:
				this.store.getProxy().setExtraParam('mchn_type', null);
				break;
        	}
        } else {
        	if(vCompanyReserved4 == 'KYNL01KR') {
               this.store.getProxy().setExtraParam('orderBy', 'mchn_code');
			}
        	this.store.getProxy().setExtraParam('mchn_type', 'MI');
        }
        
        
        //디폴트 로드
        gMain.setCenterLoading(false);

      //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {
        	
        	if (selections.length) {
        		gm.me().repairAction.enable();
        	} else {
        		gm.me().repairAction.disable();
        	}
        	
        	this.fileNolink = 'false';
        	console_logs('setGridOnCallback selections', selections);
        	var rec = selections[0];
        	gMain.selPanel.vSELECTED_RECORD = rec;
        	if(rec!=undefined && rec!=null) {
        		gMain.loadFileAttach(rec.get('unique_id'), gMain.selectedMenuId + 'designFileAttach');
        	}
        });
        
      //파일첨부 그리드탭 추가
		gMain.addTabFileAttachGridPanel('이미지 및 문서첨부', 'FILE_ATTACH', {NO_INPUT: null}, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            } else {
	            	
	            }
	        },
	        gMain.selectedMenuId + 'designFileAttach',
	        {
	        	selectionchange: function(sm, selections) {  
	        		var fileRecord = (selections!=null && selections.length>0) ? selections[0] : null;
	        		console_logs(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		
	        		var delButton = Ext.getCmp(gMain.selectedMenuId + 'designFileAttach' + 'delButton');
	        		if(fileRecord==null) {
	        			gUtil.disable(delButton);
	        		} else {
	        			gUtil.enable(delButton);
	        		}
	        		
	        	}
	        }
		);

		this.store.load();
        
    },
    items : [],
    
    treatRepair: function() {
    	console_logs('gm.me().vSELECTED_RECORD', gm.me().vSELECTED_RECORD );
    	var rec = gm.me().vSELECTED_RECORD;
      	var form = Ext.create('Ext.form.Panel', {
			 id: gu.id('formPanel'),
			 xtype: 'form',
			 frame: true ,
	    		border: false,
	    		bodyPadding: 10,
	    		region: 'center',
	    		layout: 'column',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                layout: 'form',
	                xtype: 'container',
	                defaultType: 'textfield',
	                style: 'width: 100%'
	            },
	            items:[{
	            	xtype: 'fieldset',
	                width : 400,
	                height : 400,
	                 margins: '0 20 0 0',
	                 collapsible: false,
	                 anchor: '100%',
	                 defaults: {
                     labelWidth: 89,
                     anchor: '100%',
                     layout: {
                         type: 'hbox',
                         defaultMargins: {top: 0, right: 100, bottom: 0, left: 10}
                     }
                 },
                items: [
    					{ fieldLabel: '설비UID',
    					    xtype : 'textfield',
    					    name : 'mchn_uid',
    					    value : rec.get('unique_id'),
    					    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
    					    readOnly: true
    					  },
					{ fieldLabel: '설비코드',
					    xtype : 'textfield',
					    name : 'mchn_code',
					    value : rec.get('mchn_code'),
					    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
					    readOnly: true
					  },
					  { fieldLabel: '설비명',
					    xtype : 'textfield',
					    value : rec.get('name_ko'),
					    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
					    readOnly: true
					    
					  },
                    { fieldLabel: '설비상태',
	            		xtype: 'combo',    
	            		anchor: '100%',
	            		name: 'mcstate',
	            		store: Ext.create('Mplm.store.MachineStateStore'),
	            		displayField:   'code_name_kr',
	            		valueField: 'system_code',
	            		emptyText: '선택',
	            		allowBlank: false,
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    typeAhead: false,
	            	    //hideLabel: true,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
	            	      	}
	            		},
	            		listeners: {
	            	           select: function (combo, record) {
	            	           }
	            	      }	
                    },
                    
                    { fieldLabel: '고장구분',
	            		xtype: 'combo',    
	            		anchor: '100%',
	            		name: 'cause_type',
	            		store: Ext.create('Mplm.store.McFixCauseTypeStore'),
	            		displayField:   'code_name_kr',
	            		valueField: 'system_code',
	            		emptyText: '선택',
	            		allowBlank: false,
	            		sortInfo: { field: 'create_date', direction: 'DESC' },
	            	    typeAhead: false,
	            	    //hideLabel: true,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{system_code}">{code_name_kr}</div>';
	            	      	}
	            		},
	            		listeners: {
	            	           select: function (combo, record) {
	            	           }
	            	      }	
                    },
                    
                    
                    
                    
                    
                    { fieldLabel: '발생일',
                    	id: 'occ_date',
					    name: 'occ_date',
					    xtype: 'datefield',
					    format: 'Y-m-d',
	    		    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
	    		    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'	
	    		    	value : new Date()
                    },
                    { fieldLabel: '발생내역',
            	      xtype: 'textarea',
            	      height: 80,
            	      rows: 8,
            	      anchor: '100%',
            	      name: 'occ_desc',
            	      allowBlank: false
            	      
                    },
                    { fieldLabel: '발생원인',
              	      xtype: 'textarea',
              	      height: 50,
              	      anchor: '100%',
              	      name: 'occ_reason'
                     },
                     { fieldLabel: '등록자',
             	      xtype: 'textfield',
             	      anchor: '100%',
             	      name: 'finder_id',
             	      value: vCUR_USER_ID,
				    fieldStyle : 'background-color: #E7EEF6; background-image: none;',
				    readOnly: true
                    }
                   
                ]
	            }]
		 })
		 var myHeight = 500;
		 var 	myWidth = 420;

		var prWin =	Ext.create('Ext.Window', {
				modal : true,
	        title: '장애 등록',
	        width: myWidth,
	        height: myHeight,	
	        plain:true,
	        items: form,
	        buttons: [{
	            text: CMD_OK,
	        	handler: function(btn){
	        		var msg = '장애 등록 하시겠습니까?'
	        		var myTitle = '장애등록 확인';
	        		Ext.MessageBox.show({
	                    title: myTitle,
	                    msg: msg,
	                    
	                    buttons: Ext.MessageBox.YESNO,
	                    icon: Ext.MessageBox.QUESTION,
	                    fn: function(btn) {
	                    	
	                    	if(btn == "no"){
	                    		prWin.close();
	                    	}else{
	                    	var form = gu.getCmp('formPanel').getForm();

	                    	if(form.isValid()){	
	                    	var val = form.getValues(false);
	                    	
	                    	console_logs('val', val);
	                    	                    	
	                    	form.submit({
	                			url : CONTEXT_PATH + '/production/mcfix.do?method=create',
	                			params:val,
	                			success: function(val, action){
	                				prWin.close();
	                				gMain.selPanel.store.load(function(){});
	                				//this.store.load();
	                				//gMain.selPanel.store.load();
	                			},
	                			failure: function(val, action){
	                				
	                				 prWin.close();
	                				 
	                			}
	                		});
	                    	}  // end of formvalid 
	                    	} // btnIf of end
	                   }//fn function(btn)
	                    
	                });//show
	        	}//btn handler
			},{
	            text: CMD_CANCEL,
	        	handler: function(){
	        		if(prWin) {
	        			
	        			prWin.close();
	        			
	        		}
	        	}
			}]
	    });
		  prWin.show();
    	
    	
    }
});
