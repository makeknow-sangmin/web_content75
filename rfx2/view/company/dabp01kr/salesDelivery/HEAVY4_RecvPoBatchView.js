//수주관리 메뉴
Ext.define('Rfx2.view.company.dabp01kr.salesDelivery.HEAVY4_RecvPoBatchView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'receved-mgmt-view',
    /*requires: [
		'Ext.grid.*',
		'Ext.data.*',
		'Ext.form.field.Number',
		'Ext.form.field.Date',
		'Ext.tip.QuickTipManager'
	     	],*/
    
  //File첨부 폼
   // attachform: null,
   // Heavy_attachform: null,
    vFILE_ITEM_CODE: null,
    
    inputBuyer : null,
    initComponent: function(){
    	
    	//order by 에서 자동 테이블명 붙이기 끄기. 
    	
    	this.orderbyAutoTable = false;
    	
    	this.setDefValue('regist_date', new Date());

    	//삭제할때 사용할 필드 이름.
    	this.setDeleteFieldName('unique_uid');
    	
    	var next7 = gUtil.getNextday(7);
    	this.setDefValue('delivery_plan', next7);
    	
    	this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
    	this.setDefComboValue('pj_type', 'valueField', 'P');
    	this.setDefComboValue('newmodcont', 'valueField', 'N');
    	this.setDefComboValue('unit_code', 'valueField', 'UNIT_PC');
    	this.setDefComboValue('selfdevelopment', 'valueField', 'N');//세트여부
    	this.setDefComboValue('previouscont', 'valueField', 'C');//목형유형
    	this.setDefComboValue('reserved_varcharc', 'valueField', 'EA');//목형유형
    	
    	//this.setDefValue('pj_code', 'test');
    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
			this.addSearchField ({
				type: 'dateRange',
				field_id: 'regist_date',
				text: gm.getMC('CMD_Order_Date', '등록일자'),
				sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
				edate: new Date()
			});

		
			this.addSearchField (
				{
					type: 'combo',
					field_id: 'status'
					,store: "RecevedStateStore"
					,displayField: 'codeName'
					,valueField: 'systemCode'
					,emptyText: '진행상태'
					,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
				});	
				
				this.addSearchField (
				{
					type: 'combo'
					,width:175
					,field_id: 'wa_code'
					,store: "BuyerStore"
					,displayField: 'wa_name'
					,valueField: 'wa_code'
					,emptyText: '고객사'
					,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
				});

		
	
			this.addSearchField('area_code');
			this.addSearchField('h_reserved44');	
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			//검색툴바 생성
			var searchToolbar =  this.createSearchToolbar();

			console_logs('searchToolbar', searchToolbar);
			
			
			//명령툴바 생성
	        var buttonToolbar = this.createCommandToolbar({
	        		REMOVE_BUTTONS : [
	        		        	        /*'REGIST',*/'COPY'
	        			]		
	        });

	    	 this.createStoreSimple({
	    		 modelClass:'Rfx.model.HEAVY4RecvPoViewModel',
	     	       pageSize: gMain.pageSize,/*pageSize*/
	     	      sorters: [{
	         		 property: 'rtg_poNo',
	                  direction: 'DESC'
	    	        }],
	    	        byReplacer: {
	    	        
	    		        },
	    	        deleteClass: ['assymap']
	            }, {
	        
	        	groupField: 'rtg_poNo'
	        	 }
	     	        );
	         //그리드 생성
	         var arr=[];
	         arr.push(buttonToolbar);
	         arr.push(searchToolbar);
	         
	         var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	 	        	groupHeaderTpl: '<div><b><font color=#003471>{name}</b></font> ::({rows.length} 개)</div>'
	 		}); 
	 		var option = {
	 				features: [groupingFeature]
	 		};
	 		
	 		 this.createGridCore(arr, option);
	 		 
	 		   this.createCrudTab();
	 		   
	 	       Ext.apply(this, {
	 	            layout: 'border',
	 	            items: [this.grid,  this.crudTab]
	 	        });
	 	       
		//Function Callback 정의
        //redirect
//    	this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
//    		if(selectOn==true) {
//    			this.propertyPane.setSource(source); // Now load data
//    			this.selectedUid = unique_id;
//    			gUtil.enable(this.removeAction);
//    			gUtil.enable(this.editAction);
//    			gUtil.enable(this.viewAction);
//    			gUtil.disable(this.registAction);
//    			
//    		} else {//not selected
//            	this.propertyPane.setSource(source);
//            	this.selectedUid = '-1';
//            	gUtil.disable(this.removeAction);
//            	gUtil.disable(this.editAction);
//            	gUtil.disable(this.viewAction);
//            	gUtil.enable(this.registAction);
//            	this.crudTab.collapse();
//    		}
//
//    		console_logs('this.crudMode', this.crudMode);
//    		this.setActiveCrudPanel(this.crudMode);
//    	};


        



       
              
        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            //console_logs('tabpanel newTab', newTab);
            //console_logs('tabpanel newTab newTab.title', newTab.title);

            switch(newTab.title) {
            case '구매요청':
                gMain.selPanel.refreshBladeInfoAll();
                break;
            case '공정선택':
            	gMain.selPanel.refreshProcess();
            	break;
            }
            
            
        };
        


        //this.createGrid(searchToolbar, buttonToolbar); 그룹핑 할 때, callback보다 앞에 있으면 실행 안된다.
        //createStore 할 때, 사용하는 함수

		//this.createGridCore(arr, option);
        
        
  
        
 
        
        //작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
			 text: '생산 요청',
			 tooltip: '생산 요청',
			 disabled: true,
			 
			 handler: function() {
				 var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
				 if (selections) {
				 
			    	Ext.MessageBox.show({
			            title:'확인',
			            msg: '생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
			            buttons: Ext.MessageBox.YESNO,
			            fn:  function(result) {
	            	        if(result=='yes') {
	            	        	gMain.selPanel.doRequest();
	            	        }
			            },
			            //animateTarget: 'mb4',
			            icon: Ext.MessageBox.QUESTION
			        });
				 } else {
					 Ext.MessageBox.alert('알림','선택한 자재가 없습니다.');
				 }
			    	
			    	
			 }
		});
        

 
           	buttonToolbar.insert(5, this.requestAction);
            buttonToolbar.insert(5, '-');
            
            //grid를 선택했을 때 Callback
            this.setGridOnCallback(function(selections) {
            	
            	console_logs('selections', selections);
                if (selections.length) {
                	
                	var rec = selections[0];
                	var status = rec.get('status');
                	
                	console_logs('selections.length', selections.length);
                	if(status=='BM'){
                		gUtil.enable(gMain.selPanel.removeAction);
                		gUtil.enable(gMain.selPanel.requestAction);
                	}else{
                		gUtil.disable(gMain.selPanel.removeAction);
                		gUtil.disable(gMain.selPanel.requestAction);
                	}
    				gUtil.enable(gMain.selPanel.editAction);    
    				
    				gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid'); 
    				gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code'); 
    				gMain.selPanel.vSELECTED_PJ_CODE = gUtil.stripHighlight(gMain.selPanel.vSELECTED_PJ_CODE); 
    				var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
    				gMain.selPanel.pj_code = gMain.selPanel.vSELECTED_PJ_CODE+"-" ;
                	if(rec!=null){
                		console_logs('pcsstd 불러오기',rec);
    	                var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
    	                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gMain.selPanel.vSELECTED_ASSYMAP_UID);//선택된 ASSYMAP_UID
    	                processGrid.getStore().load();
                	}
                } else {
    				gUtil.disable(gMain.selPanel.removeAction);
    				gUtil.disable(gMain.selPanel.editAction);   
    				gUtil.disable(gMain.selPanel.requestAction);
                }

            });
            
            gMain.addTabGridPanel('공정설계', 'SRO5_CHNS', {  
            	pageSize: 100,
				model: 'Rfx.model.PcsStd',
				dockedItems: [{
					 dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default4',
			            items:[
			                    
	      				     ]
				 }
		        
		        , {
		        	 dock: 'top',
			            xtype: 'toolbar',
			            cls: 'my-x-toolbar-default3',
			            items: [
			                
			                    ]
		        }
	        ],
			sorters: [{
	           property: 'serial_no',
	           direction: 'ASC'
	       }]
            }, function(selections) {
	            if (selections.length) {
	            	var rec = selections[0];
	            	//console_logs(rec);
	            	gMain.selPanel.selectPcsRecord = rec;
	            } else {
	            	
	            }
	        },
	        'producePlanGrid'//toolbar
		);
            this.callParent(arguments);
            //디폴트 로딩
            gMain.setCenterLoading(false);
            this.storeLoad = function() {
                this.store.load(function(records) {
                });
            };
            
            this.createCrudTab();

            Ext.apply(this, {
                layout: 'border',
                items: [this.grid,  this.crudTab]
            
            });


         
		this.preCreateCallback = function() {
			console_logs('this.crudMode;', this.crudMode);

			//공정복사
			if(this.crudMode == 'COPY') {
				Ext.Msg.alert('안내', '복사등록을 위한 공정복사를 진행합니다.',  function() {
					Ext.Ajax.request({
						url: CONTEXT_PATH + '/index/process.do?method=copyPcsStd',
						params:{
							fromUid: gMain.selPanel.vSELECTED_UNIQUE_ID ,
							toUid: vCUR_USER_UID*(-100)
						},
						
						success : function(result, request) { 
							gm.me().doCreateCore();
					          
							
						},//endofsuccess
						failure: extjsUtil.failureMessage
					});//endofajax
					return false;
				});
				
			} else {
				gm.me().doCreateCore();
				return true;
			}

		}
			        

        this.callParent(arguments);

      
            this.store.getProxy().setExtraParam('orderBy', "rtg_poNo");
        	this.store.getProxy().setExtraParam('status',  "BM");
        	
        gMain.setCenterLoading(false);
        
        this.storeLoad();
       
        
    },
   
    
    
    selectPcsRecord: null,
    items : [],
    pj_code: null,
//    assymap_uids : [],

    
    //구매/제작요청
    doRequest: function() {
    	
    	var assymap_uids = [];
    	var selections = this.grid.getSelectionModel().getSelection();
    	for(var i=0; i< selections.length; i++) {
    		var rec = selections[i];
    		var uid =  rec.get('unique_id');
    		assymap_uids.push(uid);
    	}
    	
	    Ext.Ajax.request({		
			url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
			params:{
				assymap_uids: assymap_uids,
				parent_code: this.link
			},
			
			success : function(result, request) { 
				gMain.selPanel.store.load();
				Ext.Msg.alert('안내', '요청하였습니다.', function() {});
				
			},//endofsuccess
			
			failure: extjsUtil.failureMessage
		});//endofajax	

    },


    

    

    
});
