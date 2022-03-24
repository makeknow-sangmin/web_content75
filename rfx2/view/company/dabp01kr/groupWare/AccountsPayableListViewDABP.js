//주문작성

Ext.define('Rfx2.view.company.dabp01kr.groupWare.AccountsPayableListViewDABP', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'account-list-view-dabp',
    initComponent: function(){

    	
    	//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가
    	
//    	this.addSearchField ({
//            type: 'dateRange',
//            field_id: 'gr_date',
//            text: "요청기간" ,
//            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//            edate: new Date()
//    	});    

//		this.addSearchField('maker_name');
//		this.addSearchField('pj_code');
//		this.addSearchField('pj_name');
//		this.addSearchField('creator');
//		this.addSearchField('item_name_dabp');
		
//		//Readonly Field 정의
//		this.initReadonlyField();
//		this.addReadonlyField('unique_id');
//		this.addReadonlyField('create_date');
//		this.addReadonlyField('creator');
//		this.addReadonlyField('creator_uid');
//		this.addReadonlyField('user_id');
//		this.addReadonlyField('board_count');

		this.addSearchField({
			field_id: 'comcst_code'
			,store: 'ComCstStore'
			,displayField:   'division_name'
			,valueField:   'wa_code'
			,innerTpl	: '<div data-qtip="{wa_code}">{division_name}</div>'
		});


		this.addSearchField ('supplier_name');

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();

		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', this.fields);

        this.createStore('Rfx.model.RtgAstAc', [{
	            property: 'unique_id',
	            direction: 'DESC'
	        }],
	        gMain.pageSize/*pageSize*/
			);
				
		this.store.getProxy().setExtraParam('state', 'A');
      
        
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        switch(vCompanyReserved4) {
            case 'KWLM01KR':
                Ext.each(this.columns, function(columnObj, index) {
                    var dataIndex = columnObj["dataIndex"];
                    console_logs('>>dataIndex', columnObj);
                    switch(dataIndex) {
                        case 'reserved_varchar5':
                        columnObj['renderer'] = function(value) {
                            switch(value) {
                                case 'CASH':
                                return '현금결제';
                                case 'CARD':
                                return '카드결제';
                                default:
                                return value;
                            }
                        }
                        break;
                    }
                });
            break;
            default:
            break;
        }

        //grid 생성.
        this.createGrid(arr);
		this.createCrudTab();
		
		this.execApAction = Ext.create('Ext.Action', {
			itemId:'execApActionAll',
    		iconCls:'af-plus-circle',
    		disabled: true,
			text: '결재 요청',
    	    handler: function(widget, event) {

				//결재사용인 경우 결재 경로 store 생성
				if(gm.me().useRouting==true) {
					gm.me().rtgapp_store = Ext.create('Mplm.store.RtgappStore', {});
				}
		
				var pr_uid = gm.me().SELECTED_UID;
				var selectUids = [];
				var selections = gm.me().grid.getSelectionModel().getSelection();

				if (selections) {
				   for(var i=0; i< selections.length; i++) {
						var rec = selections[i];
                        console_logs('rec', rec);
                        if(i > 0) {
                            var pre_wa_code = selections[i-1].get('wa_code');
                            var wa_code = rec.get('wa_code');
                            if(pre_wa_code != wa_code) {
                                Ext.Msg.alert("알림", "사업부가 다른 정산 내용이 있습니다.");
                                return;
                            }
                        }
						selectUids.push(rec.get('unique_id_long'));
					}
				}
				var count = selections.length - 1;
				console_logs('===>selections', typeof(selections.length-1));
				var supplier_code = selections[0]['data']['supplier_code'];
				var supplier_name = selections[0]['data']['supplier_name'];
                var txt_name = (new Date()).getFullYear() +'년 ' +((new Date()).getMonth() + 1) + '월';
                var txt_content = supplier_name + ' 外 ' + count + ' 건';
				var myHeight = (gm.me().useRouting==true) ? 500 : 200;
				var myWidth = 600;

				var formItems = [
						{
                        fieldLabel: '결재 구분',
                        xtype: 'textarea',
                        rows: 4,
                        anchor: '100%',
                        labelWidth: 70,
                        //id: 'text_content',
						name: 'txt_name',
						style: 'width: 100%',
						value: txt_name
                    }, new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: selectUids
                        })
                    ];

				var form = Ext.create('Ext.form.Panel', {
                    id: gu.id('formPanel'),
                    xtype: 'form',
                    frame: false,
                    border: false,
                    width: '100%',
                    bodyPadding: 10,
                    region: 'center',
                    layout: 'column',
                    fieldDefaults: {
                        labelAlign: 'right',
                        msgTarget: 'side'
                    },
                    // defaults: {
                    //     layout: 'form',
                    //     xtype: 'container',
                    //     defaultType: 'textfield',
                    //     style: 'width: 100%'
                    // },
                    items: formItems
                })
				   
				var items = [form];
				
                if(gm.me().useRouting==true) {
                    
                    gm.me().rtgapp_store.load();
                    var userStore = Ext.create('Mplm.store.UserStore', {hasNull: false} );
                    var removeRtgapp = Ext.create('Ext.Action', {
                        itemId: 'removeRtgapp',
                        glyph: 'xf00d@FontAwesome',
                        text: CMD_DELETE,
                        disabled: true,
                        handler: function(widget, event) {
                            Ext.MessageBox.show({
                                title:delete_msg_title,
                                msg: delete_msg_content,
                                buttons: Ext.MessageBox.YESNO,
                                fn: gm.me().deleteRtgappConfirm,
                                // animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }
                    });

                    var updown =
                    {
                        text: '이동',
                        menuDisabled: true,
                        sortable: false,
                        xtype: 'actioncolumn',
                        width: 70,
                        align: 'center',
                        items: [{
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/up.png',
                            tooltip: 'Up',
                            handler: function(agridV, rowIndex, colIndex) {
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = -15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {   
                                        gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                                    
                                }
                
                
                        },'-',
                        {
                            icon   : 'http://hosu.io/web_content75' +  '/resources/follower/demo/resources/images/down.png',
                            tooltip: 'Down',
                            handler: function(agridV, rowIndex, colIndex) {
                
                                var record = gm.me().agrid.getStore().getAt(rowIndex);
                                console_log(record);
                                var unique_id = record.get('unique_id');
                                console_log(unique_id);
                                var direcition = 15;
                                Ext.Ajax.request({
                                     url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=moveRtgappDyna',
                                     params:{
                                         direcition:direcition,
                                         unique_id:unique_id
                                     },
                                     success : function(result, request) {   
                                         gm.me().rtgapp_store.load(function() {});
                                     }
                                   });
                            }
                
                        }]
                    };

                    var selModel = Ext.create("Mplm.util.SelModelCheckbox", {onlyCheckOwner: false} );

                    gm.me().agrid = Ext.create('Ext.grid.Panel', {
                        //title: '결재경로',
                        store: gm.me().rtgapp_store,
                        border: true,
                        frame: true,
                        style: 'padding-left:10px;padding-right:10px;',
                        width: '100%',
                        //layout: 'fit',
                        scroll: true,                        
                        selModel: selModel,
                        columns : [
                            { dataIndex : 'seq_no', text : '순서', width:70,  sortable : false	}
                            ,{ dataIndex : 'user_id', text : '아이디',  sortable : false	}
                            ,{ dataIndex : 'user_name', text : '이름', flex : 1,  sortable : false	}
                            //,{ dataIndex : 'emp_no', text : '사번',  sortable : false	}
                            //,{ dataIndex : 'company_code', text : '회사 코드',  sortable : false	}
                            ,{ dataIndex : 'dept_name', text : '부서 명', width:90	,  sortable : false}
                           // ,{ dataIndex : 'dept_code', text : '부서 코드',  sortable : false	}
                            //,{ dataIndex : 'app_type', text : 'app_type',  sortable : false	}
                            ,{ dataIndex : 'gubun', text : '구분', width:50	,  sortable : false}
                            // ,{ dataIndex : 'unique_id', text : 'unique_id',  sortable : false	}
                            //,{ dataIndex : 'create_date', text : '생성일자',  sortable : false	}
                            ,updown
                        ],
                        border: false,
                        multiSelect: true,
                        frame: false ,
                        dockedItems: [{
                            xtype: 'toolbar',
                            cls: 'my-x-toolbar-default2',
                            items: [
                               {
                                    xtype:'label',
                                    labelWidth: 20,
                                    text: '결재 권한자 추가'//,
                                    //style: 'color:white;'
                    
                            },{
                                id :'user_name',
                                name : 'user_name',
                                xtype: 'combo',
                                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                store: userStore,
                                labelSeparator: ':',
                                emptyText:   dbm1_name_input,
                                displayField:   'user_name',
                                valueField:   'unique_id',
                                sortInfo: { field: 'user_name', direction: 'ASC' },
                                typeAhead: false,
                                hideLabel: true,
                                minChars: 2,
                                width: 200,
                                listConfig:{
                                    loadingText: 'Searching...',
                                    emptyText: 'No matching posts found.',
                                    getInnerTpl: function() {
                                        return '<div data-qtip="{unique_id}">{user_name} {position} ({dept_name})</div>';
                                    }			                	
                                },
                                listeners: {
                                    select: function (combo, record) {
                                        console_logs('Selected combo : ', combo);
                                        console_logs('Selected record : ', record);
                                        console_logs('Selected Value : ', record.get('unique_id'));
                                        
                                        var unique_id = record.get('unique_id');
                                        var user_id = record.get('user_id');
                                        Ext.Ajax.request({
                                             url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=createRtgappDyna',
                                             params:{
                                                 useruid : unique_id,
                                                 userid : user_id
                                                 ,gubun    : 'D'
                                             },
                                             success : function(result, request) {   
                                                 var result = result.responseText;
                                                console_log('result:' + result);
                                                if(result == 'false'){
                                                    Ext.MessageBox.alert(error_msg_prompt, 'Dupliced User');
                                                }else{
                                                    gm.me().rtgapp_store.load(function() {});
                                                }
                                             },
                                             failure: extjsUtil.failureMessage
                                         });
                                    }// endofselect
                                }
                            },
                            '->',removeRtgapp
                            
                            ]// endofitems
                        }] // endofdockeditems 
                        
					}); // endof Ext.create('Ext.grid.Panel',

                    gm.me().agrid.getSelectionModel().on({
                        selectionchange: function(sm, selections) {
                            if (selections.length) {
                                removeRtgapp.enable();
                            } else {
                                removeRtgapp.disable();
                            }
                        }
                    });

                    items.push(gm.me().agrid);
				}

				var prWin = Ext.create('Ext.Window', {
					modal: true,
                    title: '정산실행',
                    width: myWidth,
                    height: myHeight,
                    plain: true,
					items: items,
					buttons: [{
						text: CMD_OK,
						handler: function(btn) {
							 if (btn == "no") {
                                prWin.close();
                            } else {
								if (form.isValid()) {
									var val = form.getValues(false);
								//결재사용인 경우 결재 경로 확인
                                    if(gm.me().useRouting==true) {

                                        var items = gm.me().rtgapp_store.data.items;
                                        console_logs('items.length', items.length);
                                        if(items.length < 2) {
                                            Ext.Msg.alert("알림", "결재자가 본인이외에 1인 이상 지정되야 합니다.");
                                            return;
                                        }
                                        
                                        var ahid_userlist = new Array();
                                        var ahid_userlist_role = new Array();

                                        for(var i=0; i<items.length; i++) {
                                            var rec = items[i];
                                            console_logs('items rec', rec);
                                            ahid_userlist.push(rec.get('usrast_unique_id'));
                                            ahid_userlist_role.push(rec.get('gubun'));
                                        }
                                        val['hid_userlist'] =  ahid_userlist;
                                        val['hid_userlist_role'] =  ahid_userlist_role;
									}
									
                                var selection = gm.me().grid.getSelectionModel().getSelection()[0];
                                var wa_code = selection.get('wa_code');

								Ext.Ajax.request({
                                    url: CONTEXT_PATH + '/account/arap.do?method=addPaymentCompleteFinal',
                                    params:{
                                        rtgastAC_uids: selectUids,
                                        txt_name: txt_name,
                                        txt_content: txt_content,
                                        reserved_varchar1: (new Date()).getFullYear(),
                                        reserved_varchar2 : ((new Date()).getMonth() + 1),
                                        hid_userlist : ahid_userlist,
                                        hid_userlist_role : ahid_userlist_role,
                                        wa_code:wa_code
                                    },
									success : function(result, request) { 
                                        gm.me().store.load();
                                        gm.me().approvalStore.load();
										Ext.Msg.alert('안내', '정산을 요청하였습니다.', function() {});
										
										prWin.close();
									},// endofsuccess
									failure: extjsUtil.failureMessage
								});// endofajax
								}	
							}
						}
					}, {
						text: CMD_CANCEL,
                        handler: function(btn) {
                            prWin.close();
                        }
					}]
				});
				prWin.show();
			}
		})

        this.printPDFAction = Ext.create('Ext.Action',{
        	iconCls: 'af-pdf',
            text: 'PDF',
            disabled: true,
            handler: function(widget, event) {
//              var rec = this.grid.getSelectionModel().getSelection()[0];
               var rtgast_uid = gMain.selPanel.vSELECTED_RTGAST_UID ;//rtgast_uid
               var po_no = gMain.selPanel.vSELECTED_PO_NO ;//po_no
              Ext.Ajax.request({
                url: CONTEXT_PATH + '/pdf.do?method=printAC',
                params:{
                  rtgast_uid : rtgast_uid,
                  po_no : po_no,
                  pdfPrint : 'pdfPrint'
                },
                reader: {
                  pdfPath: 'pdfPath'
                },
                success : function(result, request) {
        	        var jsonData = Ext.JSON.decode(result.responseText);
        	        var pdfPath = jsonData.pdfPath;
        	        console_logs(pdfPath);      	        
        	    	if(pdfPath.length > 0) {
        	    		var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
        	    		top.location.href=url;	
        	    	}
    		},
    		failure: extjsUtil.failureMessage
    	});
              
              
            }
        });
        
        Ext.apply(this, {
            layout: 'border',
			items: [
				{
					title: '결재목록',
					collapsible: false,
					frame: true,
					region: 'west',
					layout: {
						type: 'hbox',
						pack: 'start',
						align: 'stretch'
					},
					width: '40%',
					items: [this.createCenter()]
				}, 
				{
                    title: '미결재목록',
                    id:'notApList',
					collapsible: false,
					frame: true,
					region: 'center',
					layout: 'border',
					width: '60%',
					items: [this.grid]  
				}
			]
        });

        
        //this.editAction.setText('주문작성');
//        this.removeAction.setText('반려');
        
        
        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
      	  if(index==1||index==2||index==3) {
            	buttonToolbar.items.remove(item);
      	  }
        });
		buttonToolbar.insert(3, this.printPDFAction);
		buttonToolbar.insert(4, this.execApAction)
       this.callParent(arguments);
       
     //grid를 선택했을 때 Callback
       this.setGridOnCallback(function(selections) {
           if (selections.length) {
           	
        	   var rec = selections[0];
        	   gMain.selPanel.rec = rec;
        	   console_logs('rec 데이터', rec);
           	var standard_flag = rec.get('standard_flag');
           	standard_flag = gUtil.stripHighlight(standard_flag);  //하이라이트 삭제 
           	gMain.selPanel.vSELECTED_RTGAST_UID = rec.get('unique_id');//rtgast_uid
           	gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no');//po_no
            
           	console_logs('그리드온 데이터', rec);
           	gMain.selPanel.request_date = rec.get('req_date'); // 납기일
           	gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //cartmap_uid
           	gMain.selPanel.vSELECTED_PJ_UID = rec.get('ac_uid'); //프로젝트아이디
           	gMain.selPanel.vSELECTED_SP_CODE = rec.get('sp_code');
           	gMain.selPanel.vSELECTED_STANDARD = rec.get('standard_flag');
           	gMain.selPanel.vSELECTED_coord_key3 = rec.get('coord_key3');   // pj_uid
           	gMain.selPanel.vSELECTED_coord_key2 = rec.get('coord_key2');
           	gMain.selPanel.vSELECTED_coord_key1 = rec.get('coord_key1');   // 공급사
           	gMain.selPanel.vSELECTED_po_user_uid = rec.get('po_user_uid');
           	gMain.selPanel.vSELECTED_item_name = rec.get('item_name');    // 원지: 지종,  원단 : 지종배합, 부자재 : 품명
           	gMain.selPanel.vSELECTED_description = rec.get('description');   // 평량
           	gMain.selPanel.vSELECTED_remark = rec.get('remark');    // 장
           	gMain.selPanel.vSELECTED_req_date = rec.get('delivery_plan');
           	gMain.selPanel.vSELECTED_quan = rec.get('pr_quan');
           	gMain.selPanel.vSELECTED_comment = rec.get('comment');   // 폭
           	gMain.selPanel.vSELECTED_req_info = rec.get('req_info');  //비고
           	gMain.selPanel.vSELECTED_request_comment = rec.get('request_comment');  //전달 특기사항
           	gMain.selPanel.vSELECTED_reserved_varcharb = rec.get('reserved_varcharb'); //칼날 사이즈
           	gMain.selPanel.vSELECTED_project_double3 = rec.get('project_double3'); //판걸이 수량
           	gMain.selPanel.vSELECTED_specification = rec.get('specification');  //부자재 규격
           	gMain.selPanel.vSELECTED_pj_description = rec.get('pj_description');
           	gMain.selPanel.vSELECTED_srcahduid = rec.get('unique_id');  //srcahd uid
           	gMain.selPanel.vSELECTED_lot_name = rec.get('pj_name');
			//    gm.me().printPDFAction.enable();
			   gm.me().execApAction.enable();
           	//gMain.selPanel.itemabst();
        	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
        	this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
        	//this.cartmap_uids.push(gMain.selPanel.vSELECTED_UNIQUE_ID);
            /*for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        		console_logs('rec1', rec1);
               }*/
               
            var final_rec = this.finalGrid.getSelectionModel().getSelection();
                if(final_rec != null && final_rec.length > 0) {
                    gm.me().printPDFAction.enable();
                } else {
                    gm.me().printPDFAction.disable();
                }
            } else {
           	gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
           	gMain.selPanel.vSELECTED_PJ_UID = -1;
			   gm.me().printPDFAction.disable();  
			   gm.me().execApAction.disable();
           	
           	//this.store.removeAll();
           	this.cartmap_uids = [];
           	for(var i=0; i<selections.length; i++){
        		   var rec1 = selections[i];
        		 var uids = rec1.get('id');
        		this.cartmap_uids.push(uids);
        	   }
           	
           	console_logs('유니크아이디', gMain.selPanel.vSELECTED_UNIQUE_ID );
           	console_logs('언체크', this.cartmap_uids);
           }
       	
       })
       

        //디폴트 로드
       gMain.setCenterLoading(false);
       this.store.load(function(records){
    	   console_logs('디폴트 데이터', records);
    	   
       });
    },
    items : [],
    poviewType: 'ALL',
    cartmap_uids : [],
    deleteClass: ['cartmap'],
    jsonType : '',
	
	
	createCenter: function() {

        
        this.approvalStore.load();

		this.finalGrid = Ext.create('Ext.grid.Panel', {
			collapsible: false,
            cls : 'rfx-panel',
            width: '100%',
            autoScroll : true,
            autoHeight: true,
            border: true,
            layout          :'fit',
            forceFit: true,
            // margin: -5,
            // plugins: 'gridexporter',
            store: this.approvalStore,
            bbar: getPageToolbar(this.approvalStore),
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            multiSelect: true,
            viewConfig: {
                getRowClass : function(record, index) {
                    var state = record.get('state');
                    if(state == 'I') {
                        return 'green-row';
                    } else {
                        return 'red-row';
                    }
                }
            },
            dockedItems: [{
                
                    dock : 'top',
                    xtype: 'toolbar',
                    items: [
                        this.finalSearchAction,
                        // this.printFinalPDFAction
                    ],
                
            }],
            columns: [
            {   
                text: '정산연도',
                dataIndex: 'reserved_varchar1',
                width: 80,
                sortable: true,
            },{   
                text: '정산월',
                dataIndex: 'reserved_varchar2',
                width: 80,
                sortable: true,
            },{   
                text: '결재번호',
                dataIndex: 'po_no',
                width: 100,
                sortable: true,
            },{   
                text: '총매입금액',
                dataIndex: 'total_price',
                // flex: 1,
                sortable: true,
                renderer: function(value) {
                    if(value != null && value > 0) {
                        return gUtil.renderNumber(value);
                    } else {
                        return 0;
                    }
                }
            },{   
                text: '상태',
                dataIndex: 'state',
                // flex: 1,
                sortable: true,
                renderer: function(value) {
                    switch(value) {
                        case 'I':
                        return '결재중';
                        case 'A':
                        return '정산완료';
                        default:
                        return value;
                    }
                }
            }   
        ]     
		});
		
		this.finalGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length) {
                    console_logs('>>>>>>qqq', selections[0]);
                    var rec = selections[0];
                    var year = rec.get('reserved_varchar1');
                    var month = rec.get('reserved_varchar2');
                    var ap_uid = rec.get('unique_id_long');
                    var state = rec.get('state');
                    switch(state) {
                        case 'I':
                        gm.me().store.getProxy().setExtraParam('state', 'R');
                        break;
                        case 'A':
                        gm.me().store.getProxy().setExtraParam('state', 'T');
                        break;
                        case 'D':
                        gm.me().store.getProxy().setExtraParam('state', 'D');
                        break;
                        default:
                        break;
                    }
                    gm.me().store.getProxy().setExtraParam('ap_uid', ap_uid);
                    gm.me().store.load();
                    Ext.getCmp('notApList').setTitle(year + '/' + month);
                    gm.me().printFinalPDFAction.enable();
                } else {
                    gm.me().store.getProxy().setExtraParam('state', 'A');
                    gm.me().store.getProxy().setExtraParam('ap_uid', null);
                    gm.me().store.load();
                    Ext.getCmp('notApList').setTitle('미결재목록');
                    gm.me().printFinalPDFAction.disable();
                }
			}
		});

		this.center = Ext.widget('tabpanel', { // Ext.create('Ext.panel.Panel',
            // {
            layout: 'border',
            border: true,
            region: 'center',
            width: '100%',
            // collapsible: true,
            layoutConfig: {
                columns: 2,
                rows: 1,
            },

            items: [this.finalGrid]
        });

        return this.finalGrid;
    },
    
    deleteRtgappConfirm: function (result){
        console_logs('result', result)
        var selections = gm.me().agrid.getSelectionModel().getSelection();
        if (selections) {
            //var result = MessageBox.msg('{0}', btn);
            if(result=='yes') {

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var user_id = rec.get('user_id');

                    if(user_id==vCUR_USER_ID) {
                        Ext.Msg.alert('안내', '본인은 결재경로에서 삭제할 수 없습니다.', function() {});
                        return;
                    }
                }

                for(var i=0; i< selections.length; i++) {
                    var rec = selections[i];
                    var unique_id = rec.get('unique_id');

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/rtgMgmt/routing.do?method=destroyRtgapp',
                            params: {
                                unique_id: unique_id
                            },
                            success: function(result, request) {
                                gm.me().agrid.store.load();
                            }, // endofsuccess
                            failure: extjsUtil.failureMessage
                        }); // endofajax
                }
                gm.me().agrid.store.remove(selections);
            }
        }
    },

    finalSearchAction: Ext.create('Ext.Action', {
        iconCls: 'af-search',
        text: CMD_SEARCH/*'검색'*/,
        tooltip: CMD_SEARCH/*'검색'*/,
        toggleGroup: 'toolbarcmd',
        disabled: false,
        handler: function() {
            gm.me().approvalStore.load();
        }
    }),

    // 월별 정산서
    printFinalPDFAction: Ext.create('Ext.Action',{
                iconCls: 'af-pdf',
                text: '월별정산서',
                disabled: true,
                handler: function(widget, event) {
                var rec = gm.me().finalGrid.getSelectionModel().getSelection()[0];
                var rtgast_uid = rec.get('unique_id_long');
                var po_no = rec.get('po_no');
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printAP',
                    params:{
                        rtgast_uid : rtgast_uid,
                        po_no : po_no,
                        pdfPrint : 'pdfPrint'
                    },
                    reader: {
                    pdfPath: 'pdfPath'
                    },
                    success : function(result, request) {
                        var jsonData = Ext.JSON.decode(result.responseText);
                        var pdfPath = jsonData.pdfPath;
                        console_logs(pdfPath);      	        
                        if(pdfPath.length > 0) {
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ pdfPath;
                            top.location.href=url;	
                        }
                },
                failure: extjsUtil.failureMessage
            });  
        }
    }),

    useRouting : true,
    
    approvalStore : Ext.create('Mplm.store.RtgAstApStore', {}), // 외상매입출력 store
});
