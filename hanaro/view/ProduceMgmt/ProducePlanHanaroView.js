Ext.define('Hanaro.view.produceMgmt.ProducePlanHanaroView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'produceplan-view',
    selectedRecord: null,
    initComponent: function(){

       	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	this.setDefComboValue('def_rep_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
		
		this.addSearchField('item_name'); //품명
		this.addSearchField('specification'); //규격
			this.addSearchField('area_code');
			this.addSearchField('h_reserved44');	
			this.addSearchField('reserved1');
			this.addSearchField('pj_code');
			this.addSearchField('item_code'); //제작번호	
	
		
		// switch(vCompanyReserved4){
		// case "SWON01KR":
		// 	this.addSearchField('reserved1');
		// 	this.addSearchField('pj_code');
		// 	break;
		// case "PNLC01KR":
		// 	break;
		// case "DDNG01KR":
		// 	this.addSearchField('item_code');
		// 	this.addSearchField('pj_name');
		// 	this.addSearchField('area_code');
		// 	/*this.addSearchField('h_reserved44');	
		// 	this.addSearchField('reserved1');
		// 	this.addSearchField('pj_code');*/
		// 	break;
		// case "SHNH01KR":
		// 	this.addSearchField('pj_name');    // 프로젝트
		// 	this.addSearchField('area_code');  // 블럭
		// 	this.addSearchField('description');   //자재그룹(물성)
		// 	this.addSearchField('reserved1');	// 도장외부스펙1
		// 	this.addSearchField('moldel_name');	// 도장외부스펙2
		// 	this.addSearchField('h_reserved60');	// 시공 W/C
			
		// 	this.addSearchField('pj_code');
		// 	break;
		// case "DOOS01KR":
		// 	this.addSearchField('pj_name'); //프로젝트
		// 	this.addSearchField('class_code'); //소조번호
		// 	this.addSearchField('area_code'); //블록
		// 	break;
		// case "SKNH01KR":
		// 	this.addSearchField (
		// 	{
		// 		type: 'combo',
		// 		field_id: 'is_closed'
		// 		,store: "YesnoStore"
		// 		,displayField: 'codeName'
		// 		,valueField: 'systemCode'
		// 		,emptyText: '설계완료 여부'
		// 		,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
		// 	});

		// 	//gu.getCmp('is_closed_combo').setValue('Y');
			
		// 	this.addSearchField('pj_reserved_varchar3'); //호선
		
			
		// 	break;
		// default :
		// this.addSearchField('item_name'); //품명
		// this.addSearchField('specification'); //규격
		// 	this.addSearchField('area_code');
		// 	this.addSearchField('h_reserved44');	
		// 	this.addSearchField('reserved1');
		// 	this.addSearchField('pj_code');
		// 	this.addSearchField('item_code'); //제작번호

		// }
      
		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
        	if(index==1||index==3||index==4||index==5) {
            	buttonToolbar.items.remove(item);        		
        	}

        }); 
        
        //this.editAction.setText('BOM');

        this.restoreValveAction = Ext.create('Ext.Action', {
        	iconCls: 'af-reject',
			text: 'Valve반려',
			tooltip: 'Valve를 반려합니다',
			disabled: true,
			handler: function(widget, event) {
                Ext.MessageBox.show({
                    title:CMD_OK,
                    msg: 'Valve를 반려 하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn:  function(result) {
                        if(result=='yes') {
							gm.me().restoreValve();

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
			}
		});
        
      //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',
            tooltip:'PartList 출력',
            disabled: true,
            
            handler: function(widget, event) {
            	var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
            	var po_no = gm.me().vSELECTED_AC_UID;
            	//var rtg_type = gm.me().vSELECTED_RTG_TYPE;
                var is_rotate = 'N'; 
                var rec = gm.me().selectedRecord[0];
                var actuator = false;
                var parent = '';
                var parent_uid = null;

/*                gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id'); //cartmap의 child
            	gm.me().vSELECTED_PARENT = rec.get('parent'); //cartmap의 parent => assymap의 unique_id(대동일 경우)
            	gm.me().vSELECTED_AC_UID = rec.get('ac_uid'); 
            	gm.me().vSELECTED_TYPE = rec.get('reserved_varchar3');  // 제작/도장 구분
            	gm.me().vSELECTED_UNIQUE_UID = rec.get('unique_uid'); //선택된 CARTMAP_UID
            	gm.me().vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); //선택된 ASSYMAP_UID
            	
            	swtich(this.big_pcs_code) {
            		case'ACT-VV':
            			
            	}*/
                
                console_logs('gm.me().big_pcs_code', gm.me().big_pcs_code);
                console_logs('this.big_pcs_code', this.big_pcs_code);
                
                
                if(gm.me().big_pcs_code == 'ACT-VV') {
                	actuator = true;
                	parent = rec.get('parent');
                	parent_uid = rec.get('parent_uid');
                } else {
                	actuator = false;
                	parent = rec.get('child');
                	parent_uid = rec.get('assymap_uid');
                }

            	Ext.Ajax.request({
            		url: CONTEXT_PATH + '/pdf.do?method=printPl',
            		params:{
            			parent:parent,
            			parent_uid: parent_uid,
            			parent_act: rec.get('parent_act'),
            			po_no: rec.get('ac_uid'),
            			actuator: actuator,
            			rtgast_uid : rtgast_uid,
            			/*po_no : po_no,*/
            			pdfPrint : 'pdfPrint',
            			is_rotate : is_rotate
            		},
            		reader: {
            			pdfPath: 'pdfPath'
            		},
            		success : function(result, request) {
                	        var jsonData = Ext.JSON.decode(result.responseText);
                	        var pdfPath = jsonData.pdfPath;
                	        console_log(pdfPath);      	        
                	    	if(pdfPath.length > 0) {
                	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                	    		top.location.href=url;	
                	    	}
            		},
            		failure: extjsUtil.failureMessage
            	});
            	
            	
            }
        });
        
        this.addTabworkOrderGridPanel('하위자재', 'EPC5_SUB', {  
			pageSize: 100,
			//model: 'Rfx.model.HEAVY4WorkOrder',
			model: 'Rfx.store.BomListStore',
			forceFit: false,
			scroll: true,
	        collapsible: false,

//	        dockedItems: [
//		     
//		        {
//		            dock: 'top',
//		            xtype: 'toolbar',                                                                                                                                                                                                                                                                                                                                                    
//		            cls: 'my-x-toolbar-default3',
//		            items: [
//		                    //printpdf_min,
//		                    '-',
//		 	   		    	//addMinPo
//		                    ]
//			        }
//		        ],
				sorters: [{
//		           property: 'serial_no',
//		           direction: 'ASC'
		       }]
		}, 
		function(selections) {
            if (selections.length) {
            	var rec = selections[0];
            	console_logs('Lot 상세정보>>>>>>>>>>>>>', rec);
            	gm.me().selectPcsRecord = rec;
            	gm.me().selectSpecification = rec.get('specification');
            	gm.me().parent = rec.get('parent');
            	
            }
        },
        'bomListGrid'//toolbar
	);
        
        
        switch(vCompanyReserved4){
        case "DDNG01KR":
        	this.createStoreSimple({
        		modelClass: 'Rfx.model.HEAVY4ProducePlan',
    	        pageSize: 100,//gMain.pageSize,
    	        sorters: [{
    	        	property: 'wa_name, assymap.unique_id',
    	            direction: 'DESC'
    	        }]
    	        
    	    }, {
    	    	groupField: 'wa_name'
        });
        	break;

        default:
        	//모델 정의
            this.createStore('Rfx.model.HEAVY4ProducePlan', [{
                property: 'item_code',
                direction: 'DESC'
            }],
            	['100']/*pageSize*/
            ,{
            	creator: 'a.item_code',
            	unique_id: 'a.unique_id'
            }
        	//삭제테이블 지정 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
        	, ['cartmap']
            );
        	break;
        }
        
        
		for(var i=0; i< this.columns.length; i++) {
		        	
		        	var o = this.columns[i];
		        	//console_logs('this.columns' + i, o);
		        	
		        	var dataIndex = o['dataIndex'];
		        	
		        	switch(dataIndex) {
		        	case 'mass':
		        	case 'reserved_double1':
		        		o['summaryType'] = 'sum';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = Ext.util.Format.number(value, '0,00.000/i');
		                	
		                	value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
		                	return value;
		                };
		        		break;
		        	case 'reserved_double2':
		        	case 'reserved_double3':
		        	case 'quan':
		        	case 'bm_quan':
		        		o['summaryType'] = 'sum';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
		                	return value;
		                };
		        		break;
		        	case 'h_reserved9':
		        		o['summaryType'] = 'count';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:15pt; color:blue;">합계</font></div>'
		                	return value;
		                };
		        	case 'po_type':
		        		o['summaryType'] = 'count';
		        		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		                	value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'</font></div>'
		                	return value;
		                };

		        		default:
		        		/*o['summaryType'] = 'count';
		          		o['summaryRenderer'] = function(value, summaryData, dataIndex) {
		          			console_logs('value', value);
		          			console_logs('summaryData', summaryData);
		          			console_logs('dataIndex', dataIndex);
		                    return ((value === 0 || value > 1) ? '(' + value + ' 개)' : '(1 개)');
		                };*/
		        	}
		        	
		        }
   
        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
       
        //grid 생성.
        switch(vCompanyReserved4){
        case "DDNG01KR":
    		var option = {
				features: [{
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
		            hideGroupedHeader: true,
		        }]
			};
        	this.createGridCore(arr, option);
        	break;
        case "CHNG01KR":
    		var option = {
				features: [{
		            ftype: 'groupingsummary',
		            groupHeaderTpl: '<div><font color=#003471>{name}:: </font> ({rows.length} 공정)</div>',
		            hideGroupedHeader: true,
		        }]
			};
        	this.createGridCore(arr, option);
        	break;

        default:
        	 this.createGrid(arr, function(){});
        break;
        }
       
        
        //this.removeAction.setText('반려');
        //Action Button 이름 변경.
        //this.editAction.setText('계획수립');
       // 
        //this.setEditPanelTitle('계획수립');
        
       var viewName = this.link;
        
      //Lot 구성 Action 생성
        this.addLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '제작 Lot 구성',
			 tooltip: '제작 Lot 구성',
			 disabled: true,
			 handler: function() {
				gm.me().treatLotOp();
				// Ext.Ajax.request({
				// 	url: CONTEXT_PATH + '/index/process.do?method=bringlastlotname',
				// 	params:{
				// 			},
				// 	 success : function(response, request) {
				// 		var rec = Ext.JSON.decode(response.responseText);
						
				// 		gm.me().lotname = rec['datas'];
						
				// 		gm.me().treatLotOp();
				// 	},
				// 	failure: function(val, action){
				// 		  alert('ajax실패');
				// 	   }
				// });
				//  switch(vCompanyReserved4){
				 
				//  //대동은 로트번호를 자동으로 가져온다.
				//  case "DDNG01KR": 
				// 	 Ext.Ajax.request({
				// 		 url: CONTEXT_PATH + '/index/process.do?method=bringlastlotname',
				// 		 params:{
				// 		 		},
	         	// 		 success : function(response, request) {
	         	// 			var rec = Ext.JSON.decode(response.responseText);
	         				
	         	// 			gm.me().lotname = rec['datas'];
	         				
	         	// 			gm.me().treatLotOp();
	         	// 		},
	         	// 		failure: function(val, action){
	          	// 			 alert('ajax실패');
	            // 			}
				// 	 });
				//  break;
				//  default:
				// 	 gm.me().treatLotOp();
				// break;
				//  }
				 
			 }
		});
        
        //도장 Lot 구성 Action 생성
        this.addPaintLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '도장 Lot 구성',
			 tooltip: '작업 그룹 구성',
			 disabled: true,
			 handler: function() {
				 gm.me().mtr_type = 'PNT';
				 gm.me().treatLotOp();
				 }
		});
        
      //Lot 해체 Action 생성
        this.cancleLotAction = Ext.create('Ext.Action', {
			 iconCls: 'mfglabs-retweet_14_0_5395c4_none',
			 text: '소그룹 해체',
			 tooltip: '소그룹 해체',
			 disabled: true,
			 handler: function() {
				 
				 gm.me().cancleLotOp();
			 }
		});
		
		//buttonToolbar.insert(2, this.cancleLotAction);
		buttonToolbar.insert(2, this.printPDFAction);

       /* if(vCompanyReserved4 =='DDNG01KR'){
        	buttonToolbar.insert(2, this.cancleLotAction);
        }*/
        buttonToolbar.insert(2, this.addLotAction);
        //var processes = null;
        // switch(vCompanyReserved4) {
        // case 'DDNG01KR':
        // 	break;
        // 	default:
		//         if(gUtil.checkUsePcstpl()==true) {
		//         	var processes = gUtil.mesTplProcessBig;
		
		//         	 buttonToolbar.insert(6, '->'); 
		        	 
		//         	 for(var i=0; i<processes.length; i++) {
		//              	var o = processes[i];
		//              	var big_pcs_code = o['code'];
		//              	var title = '[' + o['code'] + ']' + o['name'];
	    //             	if(vCompanyReserved4=='SKNH01KR') {
	    //             		title = o['code'];
	    //             		if(big_pcs_code=='ACT') {//Actuator는 밸브기준
	    //             			big_pcs_code = big_pcs_code + '-VV';
	    //             		}
	    //             	}
	                	
		//              	console_logs('title', title);
		             	
		//                  var action = Ext.create('Ext.Action', {
		//                 	 xtype : 'button',
		//           			 text: title,
		//           			 tooltip: o['name'] + ' 공정',
		//           			 big_pcs_code: big_pcs_code,
		//           			 toggleGroup: this.link + 'bigPcsType',
		//           			 handler: function() {
        //                          gm.me().getStore().getProxy().setExtraParam('start', 0);
        //                          gm.me().getStore().getProxy().setExtraParam('page', 1);
		//           				gm.me().setBigPcsCode(this.big_pcs_code);
		//           			 }
		//           		});
		               
		//                  buttonToolbar.insert(6, action);
		             	
		//              }
		        	 
		//         	 var action = null;
		        	 
		//              action = Ext.create('Ext.Action', {
		//               	 xtype : 'button',
		//         			 text: 'PRD',
		//         			 tooltip: '제품' + '공정',
		//         			 big_pcs_code: 'PRD',
		//         			 pressed: false,
		//         			 toggleGroup: this.link + 'bigPcsType',
		//         			 handler: function() {
        //                          gm.me().getStore().getProxy().setExtraParam('start', 0);
        //                          gm.me().getStore().getProxy().setExtraParam('page', 1);
		//         				 gm.me().setBigPcsCode(this.big_pcs_code);
		//         			 }
		//         		});
		             
		//                buttonToolbar.insert(6, action);
		        	 
		//              action = Ext.create('Ext.Action', {
		//               	 xtype : 'button',
		//         			 text: '전체 공정',
		//         			 tooltip: '전체 공정' + '공정',
		//         			 big_pcs_code: null,
		//         			 pressed: true,
		//         			 toggleGroup: this.link + 'bigPcsType',
		//         			 handler: function() {
        //                          gm.me().getStore().getProxy().setExtraParam('start', 0);
        //                          gm.me().getStore().getProxy().setExtraParam('page', 1);
		//         				 gm.me().setBigPcsCode(this.big_pcs_code);
		//         			 }
		//         		});
		             
		//                buttonToolbar.insert(6, action);
		//         }
        //     	console_logs('buttonToolbar', buttonToolbar);
        // }
        

       
        
        
        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            var is_valve = true;

            if(selections.length == 0) {
                is_valve = false;
            }

            if (selections.length) {
            	//button enable/disable
            	this.refreshButtons(true);
            	
            	this.cartmap_uids = [];

            	for(var i=0; i<selections.length; i++){
            		var rec1 = selections[i];
            		var uids = rec1.get('unique_uid');
            		var class_code = rec1.get('class_code');

            		if(class_code != 'ACT-VV') {
            			is_valve = false;
					}

            		this.cartmap_uids.push(uids);
            		console_logs('rec1', rec1);
            	}
            	console_logs('그리드온 uid', this.cartmap_uids);
            	
            	console_logs('selections', selections[0]);
            	var rec = selections[0];
            	this.selectedRecord = selections;
            	
            	gm.me().vSELECTED_UNIQUE_ID = rec.get('unique_id'); //cartmap의 child
            	gm.me().vSELECTED_PARENT = rec.get('parent'); //cartmap의 parent => assymap의 unique_id(대동일 경우)
            	gm.me().vSELECTED_AC_UID = rec.get('ac_uid'); 
            	gm.me().vSELECTED_TYPE = rec.get('reserved_varchar3');  // 제작/도장 구분
            	gm.me().vSELECTED_UNIQUE_UID = rec.get('unique_uid'); //선택된 CARTMAP_UID
            	gm.me().vSELECTED_ASSYMAP_UID = rec.get('assymap_uid'); //선택된 ASSYMAP_UID
            	
            	console_logs('setGridOnCallback', gm.me().vSELECTED_UNIQUE_UID);

            	switch(this.big_pcs_code){
            	case 'ACT-VV':
            		this.bomListGrid.getStore().getProxy().setExtraParam('parent_uid', rec.get('parent_uid'));
                	this.bomListGrid.getStore().getProxy().setExtraParam('ac_uid', gm.me().vSELECTED_AC_UID);
                	this.bomListGrid.getStore().getProxy().setExtraParam('actuator', true);
                	this.bomListGrid.getStore().getProxy().setExtraParam('limit', 1000);
                	break;
                default:
                	this.bomListGrid.getStore().getProxy().setExtraParam('parent_uid', gm.me().vSELECTED_ASSYMAP_UID);
            		this.bomListGrid.getStore().getProxy().setExtraParam('ac_uid', gm.me().vSELECTED_AC_UID);
            		this.bomListGrid.getStore().getProxy().setExtraParam('actuator', false);
            		this.bomListGrid.getStore().getProxy().setExtraParam('limit', 1000);
            		break;
            	}
            	
            	//this.bomListGrid.getStore().getProxy().setExtraParam('parent_uid', rec.get('parent_uid'));
            	this.bomListGrid.getStore().load();
            	
            	if(rec!=null){
            		console_logs('pcsstd 불러오기',rec);
            		try {
    	                var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
    	                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gm.me().vSELECTED_ASSYMAP_UID);//선택된 ASSYMAP_UID
    	                processGrid.getStore().load();            			
            		} catch(e) {console_logs('error', e)}
            	}
            	
            	//Valve No Listing
            	var class_code = rec.get('class_code');
            	var assy_is_closed = rec.get('assy_is_closed');
            	if(class_code=='ACT' && assy_is_closed=='Y' ) {
            		gm.me().refreshValve(gm.me().vSELECTED_AC_UID);
            	} else {
            		gm.me().refreshValve(-1);
            	}
          	
            } else {
            	//button enable/disable
            	this.refreshButtons(false);
            	gm.me().refreshValve(-1);
            }


            if(is_valve) {
                this.restoreValveAction.enable();
            } else {
                this.restoreValveAction.disable();
            }
        	
        });

        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
	
		var savePcsStep = Ext.create('Ext.Action', {
			 iconCls: 'fa-save_14_0_5395c4_none',
			 text: '공정저장',
			 tooltip: '공정설계 내용 저장',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.savePcsstdHandler
			});
		
		var resetPcsStep = Ext.create('Ext.Action', {
			 iconCls: 'af-rotate-left',
			 text: '공정초기화',
			 tooltip: '공정설계 내용 초기화',
			 //toggleGroup: 'toolbarcmd',
			 handler: this.resetPcsstdHandler
			});
		

        this.callParent(arguments);
       
        //EditPane size 늘림.
		//this.crudEditSize = 700;
		
        //디폴트 로딩
        gMain.setCenterLoading(false);
        this.storeLoad = function() {
            this.store.load(function(records) {
            });
        };
        
        if(gUtil.checkUsePcstpl()==false) {//pcstpl 사용하지 않으면
	        this.mtr_type = 'PRD';
		    if (viewName == "EPC5_T") {
		    	this.mtr_type = 'TPRD';
		    } 
        }
        if(this.mtr_type!=null) {
        	this.grid.getStore().getProxy().setExtraParam('mtr_type', this.mtr_type);
        }

        switch(vCompanyReserved4) {
        case 'DDNG01KR':
        	this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000300');
        	break;
        case 'SKNH01KR':
        	this.grid.getStore().getProxy().setExtraParam('is_closed', 'Y');
        	break;
    	default:
    		break;
        }
		
        this.storeLoad();
    },

    selectPcsRecord: null,
    items : [],
    cartmap_uids : [],
    setCheckname: function(b) {
    	this.checkname=b;
    	
    	var btn = gu.getCmp('prwinopen-OK-button');
    	if(b==true) {
    		btn.enable();
    	} else {
    		btn.disable();
    	}
    	
    },
    checkname : false,
    
    treatLotOp: function(){
    	var form = null;
		//var checkname = false;
		 form = Ext.create('Ext.form.Panel', {
	    		id: gu.id('formPanel'),
	    		xtype: 'form',
	    		frame: false ,
	    		border: false,
	    		bodyPadding: '3 3 0',
	    		region: 'center',
	            fieldDefaults: {
	                labelAlign: 'right',
	                msgTarget: 'side'
	            },
	            defaults: {
	                anchor: '100%',
	                //labelWidth: 60,
	                //margins: 10,
	            },
	            items   : [
	            {
	                xtype: 'fieldset',
	                title: '입력',
	                collapsible: true,
	                defaults: {
	                    labelWidth: 40,
	                    anchor: '100%',
	                    layout: {
	                        type: 'hbox',
	                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
	                    }
	                },
	            items   : [
	                       {
	                           xtype: 'fieldcontainer',
	                           fieldLabel: 'Lot 명',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true,
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id: gu.id('po_no'),
	                                   name      : 'po_no',
	                                   fieldLabel: 'LOT 명',
	                                   margin: '0 5 0 0',
	                                   width: 300,
	                                   allowBlank: true,
	                                   value : gm.me().lotname,
	                                   fieldStyle: 'text-transform:uppercase',
	                                   emptyText: '영문 대문자 및 숫자',
	                                   validator: function(v) {
	                                	   gm.me().setCheckname(false);
	                                       if (/[^a-zA-Z0-9_-]/g.test(v)) {
	                                    	   v = v.replace(/[^a-zA-Z0-9_-]/g,'');
	                                       }
	                                       this.setValue(v.toUpperCase());
	                                       return true;
	                                   }
	                               },
	                               {
	                                   xtype:'button',
	                                   style: 'margin-left: 3px;',
	                                   width : 50,
	                                   text: '중복'+CMD_CONFIRM,
	                                   //style : "width : 50px;",
	                                   handler : function(){
	                                	   
	                                	   var po_no = gu.getCmp('po_no').getValue();
	                                	   console_logs('po_no', po_no);
	                                	   if(po_no==null || po_no.length==0) {
	                                		   gm.me().setCheckname(false);
	                                	   } else {
		                                       //중복 코드 체크
		                                       	Ext.Ajax.request({
		                                			url: CONTEXT_PATH + '/index/process.do?method=checkName',				
		                                			params:{
		                                				po_no : po_no
		                                			},
		                                			
		                                			success : function(result, request) {
		                                				var resultText = result.responseText;
		                                				
		                                				if(resultText=='0') {
		                                					gm.me().setCheckname(true);
		                                					Ext.MessageBox.alert('정상', '사용가능합니다.');
		                                					
		                                				}else {
		                                					gm.me().setCheckname(false);
		                                					Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
		                                				}
		                                				
		                        
		                                			},//Ajax success
		                                			failure: extjsUtil.failureMessage
		                                		}); 
		                                	   	                                		   
	                                	   }
	                   						
	                                   }//endofhandler
	                                }
	                           ]
	                       },
	            
	                               
	                           ]
	            }
	                   ]
			
	                    });//Panel end...
			myHeight = 120;
			myWidth = 390;
			
			
				prwin = gm.me().prwinopen(form);
		
    },
    prwinopen: function(form) {
    	prWin =	Ext.create('Ext.Window', {
			modal : true,
        title: 'LOT 명',
        width: myWidth,
        
        //height: myHeight,	
        plain:true,
        items: form,
        buttons: [{
            text: CMD_OK,
            id: gu.id('prwinopen-OK-button'),
            disabled: true,
        	handler: function(){
        		//console_logs('중복 확인>>>>>>',gm.me().checkname);
        		if(gm.me().checkname == false){
    				Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
    			}else{
                    	var form = gu.getCmp('formPanel').getForm();
                    	var cartmaparr =[];
                    	var po_quan = 0;
                    	var reserved_double4 = 0;
                    	var selections = gm.me().grid.getSelectionModel().getSelection();
                    	for(var i=0; i< selections.length; i++) {
                    		var rec = selections[i];
                    		var uid =  rec.get('unique_uid');  //CARTMAP unique_id
                    		cartmaparr.push(uid);
                    		var po_quan_unit = rec.get('quan');  // 소그룹 po 수량
                    		
                    		console_logs('unit 수량', po_quan_unit);
                    		po_quan = po_quan + po_quan_unit;
                    		console_logs('po_quan 수량', po_quan);
                    		var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                    		reserved_double4 = reserved_double4 + tmp_weight;
                    		console_logs('중량', reserved_double4);
                    	}
                    	console_logs('cartmaparr', cartmaparr);
                    	//var cartmaparr = gm.me().cartmap_uids;
                    		var ac_uid = gm.me().vSELECTED_AC_UID;
                    		var pcs_code = gm.me().getProcessType();
                    		if(pcs_code == 'ACT-VV') {
                    			pcs_code = 'ACT';
                    		}
                    	
                    		prWin.setLoading(true); //<-------
        					form.submit({
                             url : CONTEXT_PATH + '/index/process.do?method=addCombineLotHeavy',
                             params:{
                                				cartmap_uids: cartmaparr,
                                				ac_uid: ac_uid,
                                				reserved_varchar3 : pcs_code,
                                				po_quan: po_quan,
                                				reserved_double4 : reserved_double4
                               				},
                                			success: function(val, action){
                                				//prWin.close();
                                				//gm.me().storeLoad();
                                				
                                				var myWin = prWin; //<-------
                                				gm.me().store.load(function(records) {
                                	            	console_logs('gm.me().store.load records', records);
                                	            	myWin.close(); //<-------
                                	            });
                                				
                                			},
                                			failure: function(val, action){
                                				 prWin.close();
                                			}
                    		}); 
    			}// checkname of end
        	
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
    },
    resetPcsstdHandler : function(){
    	
	    Ext.Ajax.request({
			url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdReset',
			params:{
				from_uid: 100,
				to_uid:gm.me().vSELECTED_ASSYMAP_UID
			},
			success : function(result, request) {   
//				gridPcsStd.store.load(function() {
//					//alert('come');
//       				//var idxGrid = storePcsStd.getTotalCount() -1;
//       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
//					
//				});
				try {
					var processGrid = Ext.getCmp('producePlanGrid'/*gMain.getGridId()*/);
	                processGrid.getStore().getProxy().setExtraParam('assymap_uid',  gm.me().vSELECTED_ASSYMAP_UID);//선택된 CARTMAP_UID
	                processGrid.getStore().load();	
				} catch(e) {console_logs('error', e)}
			}
	    });
  
},
    savePcsstdHandler : function() {
		 var gridPcsStd = Ext.getCmp('producePlanGrid');
		 //console_logs('gridPcsStd', gridPcsStd);
		 
	    	var modifiend =[];
	    	
	    	var target_bm_quan = gm.me().getInputTarget('reserved_double2');
	    	
	    	  var prevQty = Number(target_bm_quan.getValue());
	    	  //var tomCheck = false;
	    	  for (var i = 0; i <gridPcsStd.store.data.items.length; i++)
	    	  {
	    	        var record = gridPcsStd.store.data.items [i];
	           		var pcs_no =  record.get('pcs_no');
	           		var pcs_code = record.get('pcs_code');
	           		var serial_no = Number(pcs_no) / 10;
	           		var plan_qty = record.get('plan_qty');
	    	        if (record.dirty) {
	    	         	gridPcsStd.store.getProxy().setExtraParam('unique_id', gm.me().vSELECTED_UNIQUE_ID);
	    	           	console_logs(record);
	    	           	var pcs_code = record.get('pcs_code').toUpperCase();
	    	           	var pcs_name = record.get('pcs_name');
	    	           	if(gMain.checkPcsName(pcs_code) && pcs_name!='<공정없음>') {
	    	           		
	    	           		var plan_date = record.get('plan_date');
	    	           		var yyyymmdd ='';
	    	           		if(plan_date!=null) {
	    	           			yyyymmdd =gUtil.yyyymmdd(plan_date, '-');
	    	           		}

	    	           		if(plan_qty==0) {
	    	           			plan_qty = prevQty;
	    	           		}
	    	           		
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	obj['pcs_code'] = record.get('pcs_code');
	    		           	obj['pcs_name'] = record.get('pcs_name');

	    		           	obj['description'] = record.get('description');
	    		           	obj['comment'] = record.get('comment');
	    		           	obj['machine_uid'] = record.get('machine_uid');
	    		           	obj['seller_uid'] = record.get('seller_uid');

	    		           	obj['std_mh'] = record.get('std_mh');
	    		           	obj['plan_date'] = yyyymmdd;
	    		           	obj['plan_qty'] = plan_qty;
	    		           	
	    		           	modifiend.push(obj);
	    	           	} else {
	    		           	var obj = {};
	    		           	obj['unique_id'] = record.get('unique_id');// //pcs_code, pcs_name...
	    		           	obj['serial_no'] = serial_no;
	    		           	
	    		           	obj['pcs_code'] = '';
	    		           	obj['pcs_name'] = '';

	    		           	obj['description'] = '';
	    		           	obj['comment'] = '';
	    		           	obj['machine_uid'] = '-1';
	    		           	obj['seller_uid'] = '-1';

	    		           	obj['std_mh'] = '0';
	    		           	obj['plan_date'] = '';
	    		           	obj['plan_qty'] = '0';
	    		           	modifiend.push(obj);
	    	           	}

	    	        }
	    	        prevQty = plan_qty;
	    	  }
	    	  
	    	  if(modifiend.length>0) {
	    		  console_log(modifiend);
	    		  var str =  Ext.encode(modifiend);
	    		  console_log(str);
	    		  console_log('modify>>>>>>>>');
	    		    Ext.Ajax.request({
	    				url: CONTEXT_PATH + '/production/pcsstd.do?method=modifyStdList',
	    				params:{
	    					modifyIno: str,
	    					assymap_uid:gm.me().vSELECTED_UNIQUE_ID
	    				},
	    				success : function(result, request) {   
	    					gridPcsStd.store.load(function() {
	    						//alert('come');
	    	       				//var idxGrid = storePcsStd.getTotalCount() -1;
	    	       				//cellEditing.startEditByPosition({row: idxGrid, column: 2});	    
	    						
	    					});
	    				}
	    		    });
	    	  }
	 },
	 
	 // Lot 햬체 
	 cancleLotOp: function(){
			
		console_logs('assyuid', gm.me().vSELECTED_ASSYMAP_UID );
		console_logs('srcuid', gm.me().vSELECTED_UNIQUE_ID );
		console_logs('cartuid', gm.me().vSELECTED_UNIQUE_UID);
		 Ext.Ajax.request({
			 url: CONTEXT_PATH + '/index/process.do?method=cancleLot',
			 params:{
					assymapuid:gm.me().vSELECTED_ASSYMAP_UID,
					srcahduid : gm.me().vSELECTED_UNIQUE_ID,
					cartmapuid : gm.me().vSELECTED_UNIQUE_UID
				},
			 success : function(result, request) {
				 gm.me().store.load(function(){});
 			},
 			failure: function(val, action){
 				 alert('Lot 해체 실패');
 			}
		
		 });
	 },
	 bSelected: false,
	 refreshButtons: function(bSelected) {
		 
		console_logs('this.big_pcs_code', this.big_pcs_code);
		 
		if(bSelected!=undefined && bSelected!=null) {
			this.bSelected = bSelected;
		}
		
		if( this.bSelected) {
		     	this.addLotAction.enable();
		     	this.addPaintLotAction.enable();	
		     	this.printPDFAction.enable();
		}  else {
			this.addLotAction.disable();
			this.addPaintLotAction.disable();	
			this.printPDFAction.disable();
		}
		
		
        // switch(vCompanyReserved4) {
	    //     case 'DDNG01KR':
	    //     	if( this.bSelected == true ) {
	    //     		this.cancleLotAction.enable();
	    //     	} else {
	    //     		this.cancleLotAction.disable();
	    //     	}
	    //     	break;
	    //     	default:
        // }
		
		
		
		
		
	 },
	 setBigPcsCode: function(big_pcs_code) {
		 console_logs('big_pcs_code', big_pcs_code);
		 this.big_pcs_code = big_pcs_code;
		 this.refreshButtons();
		 switch(vCompanyReserved4){
		 case 'SKNH01KR':
			 this.store.getProxy().setExtraParam('assy_pcs_code', this.big_pcs_code);
			 break;
		 default:
			this.store.getProxy().setExtraParam('big_pcs_code', this.big_pcs_code);
		 }
		 this.storeLoad();
	 },
	 getProcessType : function() {
		 return this.big_pcs_code==null ? this.mtr_type : this.big_pcs_code;
	 },
	 addTabworkOrderGridPanel: function(title, menuCode, arg, fc, id) {

			gMain.extFieldColumnStore.load({
			    params: { 	menuCode: menuCode  },
			    callback: function(records, operation, success) {
			    	console_logs('records>>>>>>>>>>', records);
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
			
			// 대동에서 아래 부분에서 에러남
			/*var model = Ext.create(modelClass, {
	        	fields: fields
	        });*/
			
			/*var bomListStore = new Ext.data.Store({  
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
			//console_logs('cellEditing>>>>>>>>>>', cellEditing); 
			gm.me().bomListStore = Ext.create('Rfx.store.BomListStore');
			gm.me().bomListStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_RTGAST_UID);
			gm.me().bomListStore.getProxy().setExtraParam('sortCond', "p.unique_id, a.pl_no");

			
			try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
			this.bomListGrid = Ext.create('Ext.grid.Panel', {
	        	//id: gridId,
	            store: this.bomListStore,
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
	        	    	 
	        	    	 //gm.me().downListRecord(record);
	        	     }, //endof itemdblclick
	        	     cellkeydown:function (bomListGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
	        	    	 console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

	 	                if (e.getKey() == Ext.EventObject.ENTER) { 
	 	                
	 	                }


	 	            }
	        	},//endof listeners
	            columns: columns
	        });
			this.bomListGrid.getSelectionModel().on({
	        	selectionchange: function(sm, selections) {
	        		fc(selections);
	        	}
	        });
	        var view = this.bomListGrid.getView();
	        
	        // var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
	        //     down: function(e) {
	        //         var selectionModel = this.bomListGrid.getSelectionModel();
	        //         var select = 0; // select first if no record is selected
	        //         if ( selectionModel.hasSelection() ) {
	        //             select = this.bomListGrid.getSelectionModel().getSelection()[0].index + 1;
	        //         }
	        //         view.select(select);
	               
	        //     },
	        //     up: function(e) {
	        //         var selectionModel = this.bomListGrid.getSelectionModel();
	        //         var select = this.bomListGrid.store.totalCount - 1; // select last element if no record is selected
	        //         if ( selectionModel.hasSelection() ) {
	        //             select = this.bomListGrid.getSelectionModel().getSelection()[0].index - 1;
	        //         }
	        //         view.select(select);
	             
	        //     }
	        // });
	        
	        var tabPanel = Ext.getCmp(gMain.geTabPanelId());
	        
	        tabPanel.add(this.bomListGrid);
	        
	        
	        this.receiveAction = Ext.create('Ext.Action', {
	            iconCls: 'af-remove',
	            text: '접수',
	            tooltip: 'Valve 접수하기',
	            disabled: true,
	            handler: function(widget, event) {
	                Ext.MessageBox.show({
	                    title: '삭제하기',
	                    msg: '선택한 항목을 접수하시겠습니까?',
	                    buttons: Ext.MessageBox.YESNO,
	                    fn: gm.me().receiveValveConfirm,
	                    icon: Ext.MessageBox.QUESTION
	                });
	            }
	        });

	        var selValveNo =   Ext.create("Ext.selection.CheckboxModel", {} );

	        this.refreshAction = Ext.create('Ext.Action', {
	            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
	            text: '리프레쉬',
	            tooltip: '리로드',
	            disabled: false,
	            handler: function() {
	                gm.me().refreshValve(gm.me().vSELECTED_AC_UID);
	            }

	        });
	        
	        this.gridValve = Ext.create('Ext.grid.Panel', {
	            title: 'Valve NO.',
	            store: this.valveNoStore,
	            // /COOKIE//stateful: true,
	            collapsible: true,
	            multiSelect: true,
	            selModel: selValveNo,
	            stateId: 'gridValve' + /* (G) */ vCUR_MENU_CODE,
	            //disabled: true,
	            dockedItems: [{
	                dock: 'top',
	                xtype: 'toolbar',
	                cls: 'my-x-toolbar-default2',
	                items: [
	                    this.refreshAction,
	                    this.receiveAction, '->',
	                    {
	                        xtype: 'component',
	                        id: gu.id('valve_quan'),
	                        style: 'margin-right:5px;width:100px;text-align:right',
	                        html: '총수량 : 0'
	                    }
	                ]
	            }

	            ],
	            columns: [
	                {
	                    text     : '코드',
	                    width     : 100,
	                    sortable : true,
	                    dataIndex: 'parent_item_code'
	                },
	                {
	                    text     : '품명',
	                    flex     : 1,
	                    sortable : true,
	                    dataIndex: 'item_name'
	                },
	                {
	                    text     : 'Valve No.',
	                    width     : 80,
	                    sortable : true,
	                    dataIndex: 'specification'
	                },
	                {
	                    text     : '상태',
	                    width     : 80,
	                    sortable : true,
	                    dataIndex: 'status',
	                    renderer : function(value, metaData, record, row, col, store, gridView){
	                        if ( value == 'null' || value == null ) {
	                            return '???';
	                        } else {
	                            for(var i=0; gm.me().stateCodeStore.getCount();i++) {
	                                var rec = gm.me().stateCodeStore.getAt(i);
	                                //console_logs('---------------> rec', rec);
	                                if(rec==null) {
	                                    return value;
	                                }else {
	                                    var systemCode = rec.get('systemCode');
	                                    if(systemCode==value) {
	                                        return rec.get('codeName');
	                                    }
	                                }
	                            }
	                            return value;
	                        }
	                    }
	                },
	            ],
	            viewConfig: {
	                stripeRows: true,
	                markDirty:false,
	                enableTextSelection: true,
	                getRowClass: function(record, index) {

	                    // console_logs('record', record);
	                    var c = record.get('status');
	                    console_logs('status', c);

	                    switch(c) {
	                        case 'BM':
	                            return 'white-row';
	                        case 'CR':
	                            return 'yellow-row';
	                        case 'I':
	                            return 'magenta-row';
	                        case 'N':
	                            return 'cyan-row';
	                        case 'P':
	                            return 'orange-row';
	                        case 'R':
	                            return 'grey-row';
	                        case 'S':
	                        case 'DE':
	                            return 'red-row';
	                        case 'W':
	                            return 'blue-row';
	                        case 'Y':
	                            return 'green-row';
	                        default:
	                            return 'black-row';
	                    }

	                }
	            }
	        });
	        this.gridValve.getSelectionModel().on({
	            selectionchange: function(sm, selections) {
	                gm.me().ongridValveSelection(selections);
	            }
	        });
	        
	        tabPanel.add(this.gridValve);
	        
	        
	        
		},
	    ongridValveSelection: function(selections) {
	        console_logs('--> ongridValveSelection selections', selections);

	        if (selections.length>0) {
	            console_logs('enable', selections.length);
	            gm.me().receiveAction.enable();
	        } else {
	            gm.me().receiveAction.disable();
	        }

	    },
	    valveNoStore : Ext.create('Mplm.store.PartLineGeneralStore', {
	        hasNull: false
	    }),
	    stateCodeStore : Ext.create('Rfx.store.GeneralCodeStore', {hasNull:false, parentCode: 'SRO1_CLD_STATE'} ),

	    refreshValve : function(ac_uid) {
	        //gm.me().valveNoStore.getProxy().setExtraParam('parent_uid', -1);
	        gm.me().valveNoStore.getProxy().setExtraParam('orderBy', "specification");
	        gm.me().valveNoStore.getProxy().setExtraParam('ascDesc', "ASC");
	        gm.me().valveNoStore.getProxy().setExtraParam('ac_uid', ac_uid);
	        gm.me().valveNoStore.getProxy().setExtraParam('cart_status', "BM");
	        gm.me().valveNoStore.getProxy().setExtraParam('valve_no', true);
            gm.me().valveNoStore.getProxy().setExtraParam('limit', 1000);
	        gm.me().valveNoStore.load(function(records){
	            if(records!=null) {
	                var o = gu.getCmp('valve_quan');
	                if (o != null) {

	                    o.update( '총수량: ' + records.length);
	                }
	            }
	        });

	    },
	    
	    receiveValveConfirm: function(result) {
	        if (result == 'yes') {
	            var selections = gm.me().gridValve.getSelectionModel().getSelection();
	            if (selections == null || selections.length == 0) {
	                Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
	            } else {
	                var exist = [];
	                var targetUid = [];
	                for(var i=0; i< selections.length; i++) {
	                    var status = selections[i].get('status');
	                    var unique_uid = selections[i].get('unique_uid');
	                    if(status =='CR' || status =='BM') {
	                        targetUid.push(unique_uid);
	                    } else {
	                        exist.push(unique_uid);
	                    }

	                }
	                console_logs('targetUid', targetUid);
	                if(targetUid.length>0) {
	                    gm.me().gridValve.setLoading(true);
	                    Ext.Ajax.request({
	                        url: CONTEXT_PATH + '/index/process.do?method=addRequestValveSkanaSelection',
	                        params:{
	                            assymap_uids : targetUid
	                        },
	                        success : function(result, request) {
	                            gm.me().valveNoStore.load(function() {
	                                gm.me().gridValve.setLoading(false);
	                            });
                                gm.me().refreshValve(gm.me().vSELECTED_AC_UID);
	                        }
	                    });

	                }

	                if(exist.length>0) {
	                    Ext.Msg.alert('안내', exist.length + '건은 [진행중]이어서 접수할 수 없습니다.', function() {});
	                }
	            }

	        }
	    },

		restoreValve: function() {
    		var rec = this.selectedRecord;

    		var assymap_uids = [];

    		for(var i = 0; i < rec.length; i++) {
				assymap_uids.push(rec[i].data.assymap_uid);
			}

			if(rec.length > 0) {

                gMain.setCenterLoading(true);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=restoreValve',
                    params:{
                        assymap_uids : assymap_uids
                    },
                    success : function(result, request) {
                        gMain.setCenterLoading(false);
                        gm.me().storeLoad();
                    },
					failure : function() {
                        gMain.setCenterLoading(false);
                    	gm.me().storeLoad();
					}
                });
			}
		},

	    //소그룹 리스트 보기
		downListRecord: function(record) {
		    	
		    	this.selectedReckRecord = record;
		    	console_logs('record', record);
		    	
		    	var parent = record.get("parent");
		    	
				gMain.extFieldColumnStore.load({
				    //params: { 	menuCode: 'SRO5_DDG'  },
					params: { 	menuCode: 'EPC5'  },
				    callback: function(records, operation, success) {
				    	if(success ==true) {
				    		
				    		console_logs('SRO5_DDG records', records);
				    		
				    		var myRecords = [];
				    		for(var i=0;i<records.length; i++) {
				    			var o1 = records[i];
				    			switch(o1.get('dataIndex')) {
				    			case 'stock_pos':
				    			case 'alter_reason':
				    				break;
				    				default:
				    					myRecords.push(o1);
				    			}

				    		}
				    		
				    		var o = gMain.parseGridRecord(myRecords, 'stockRackEdit');		
				    		console_logs('ooooo', o);
				    		var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
				    		
				        	//var unassignedPalletStore = Ext.create('Rfx.store.UnassignedPalletStore', {});
				    		
				            var assyListModel = Ext.create('Rfx.model.assyListStock', {
				            	fields: fields
				            });
				            
				        	 this.downListStore = new Ext.data.Store({  
				    			pageSize: 100,
				    			model: assyListModel,
				    		    sortOnLoad: true,
				    		    remoteSort: true,
				    			listeners: {
				    				
				    				beforeload: function(store, operation, eOpts){

				    				},
				    				//Store의 Load 이벤트 콜백
				    				load: function(store, records, successful,operation, options) {
				    					
				    					

				    				}
				    			}
				    		});
				        	 console_logs('downListStore 후', this.downListStore);
				        	
				        	
//				            this.unassignedPalletStore.load(function(records){
//				          	   console_logs('unassignedPalletStore', records);
//				          	   
//				             });
				        	 
				        	 this.downListStore.proxy.setExtraParam('parent', gMain.selPanel.parent);
				        	this.downListStore.load(function(records, operation, success) {
				        		
				        	//	console_logs('unassignedPalletStore.load records', records);
				    	        var downListGrid = Ext.create('Ext.grid.Panel', {
				    	            layout: 'fit',
				    	            forceFit: true,
				    		        store: gMain.selPanel.downListStore,
				    		        height: '200', 
				    		        border: true,
				    		        autoScroll : true,
				    			    autoHeight: true,
				    		        columns: columns,
				    		        collapsible: false,
				    		        viewConfig: {
				    		            stripeRows: true,
				    		            enableTextSelection: false
				    		        }
				    		    });
				    	    	
				    	    	
				    	    	var win = Ext.create('ModalWindow', {
				    	            title: '자재리스트',
				    	            layout: 'fit',
				    	            forceFit: true,
				    	            width: 1200,
				    	            height: 400,
				    	            layout: 'absolute',
				    	            autoScroll : true,
				    	            plain:true,
				    	            tbar: [
		                          
				                    ],
				    	            items: [downListGrid],
				    	            buttons: [{
				    	                text: CMD_OK,
				    	                handler: function(){
				    	            		if(win) {
				    	            			win.close();
				    	            		}
				    	            		win = null;
				    	                  }
				    	            }]
				    	        });
				    	    	win.show();	 
				        	
				        	});
				        	
				        	
				    		
				    		
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
		 
		    }
 
});