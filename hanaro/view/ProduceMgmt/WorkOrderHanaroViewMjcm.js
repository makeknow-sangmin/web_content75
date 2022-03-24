Ext.define('Hanaro.view.produceMgmt.WorkOrderHanaroViewMjcm', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'workorder-view',
    selectedRecord: null,
    initComponent: function(){
        this.orderbyAutoTable = true;

        this.setDefComboValue('pm_uid', 'valueField', vCUR_USER_UID); //Hidden Value임.
        //검색툴바 필드 초기화
        this.initSearchField();
        this.addSearchField (
            {
                field_id: 'state'
                ,store: "DDWorkStateStore"
                ,displayField: 'codeName'
                ,valueField: 'systemCode'
                ,innerTpl	: '<div data-qtip="{codeNameEn}">[{systemCode}]{codeName}</div>'
            });
        this.addSearchField('parent_item_code');
        this.addSearchField('item_code');
        this.addSearchField('lot_no');
        this.addSearchField('unique_id');
        //그리드 생성

        // 바코드 출력 버튼
        this.barcodePrintAction = Ext.create('Ext.Action', {
            iconCls: 'barcode',
            text: '생산바코드',
            tooltip: '제품의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcode();
            }
        });



        this.barcodePrintActionCap = Ext.create('Ext.Action', {
            //store:gm.me().combstBranchStore,
            iconCls: 'barcode',
            text: '청동캡바코드',
            tooltip: '청동캡의 바코드를 출력합니다.',
            disabled: true,
            handler: function () {
                gm.me().printBarcodeCap();
            }
        });



        // 제품번호 변경
        this.changeProdAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '재품번호 변경',
            tooltip: '제품번호를 변경합니다.',
            disabled: true,
            handler: function () {
                gm.me().changeProd();
            }
        });

        this.createStore('Rfx.model.HanaroWorkOrder', [{
                property: 'parent_item_code',
                direction: 'DESC'
            }],
            gMain.pageSize
            ,{
                creator: 'rtgast.creator',
                unique_id: 'rtgast.unique_id'
            }, {
                //groupField : 'parent_item_code'
            }
        );



                //미주화학은 주석처리,
        //  this.store.getProxy().setExtraParam('parent_item_code_isnotnull', 'T');
        //  this.store.getProxy().setExtraParam('parent_item_code_isnotnull', 'T');


        // this.createStore('Mplm.store.MaterialSearchStore', [{
        // }]
        //     );




            switch(vCompanyReserved4)  {
                case "MJCM01KR":
                    this.store.getProxy().setExtraParam('parent_product', true);
                    this.store.getProxy().setExtraParam('parent_uid', -1);

                    // this.store.load(function(records){
                    //     var parentuid = record.get('parent_uid');
                    //    console_logs('parent_uid 출력 >>>>', parentuid);
                        

                    // });

                    

                    break;
                   
                    default:
                        this.store.getProxy().setExtraParam('parent_product', false);

                        this.store.getProxy().setExtraParam('parent_item_code_isnotnull', 'T');
                      this.store.getProxy().setExtraParam('parent_item_code_isnotnull', 'T');


                        break;
            }

            
        

        this.store.getProxy().setExtraParam('orderBy', 'a.lot_no desc');
        
        this.setRowClass(function(record, index) {

            // console_logs('record', record);
            var c = record.get('state');
             //console_logs('c 출력 >>>>', c);

            switch(c) {
                case 'N':
                case 'P':
                    break;
                case 'N':
                    return 'light-yellow-row';
                    break;
                case 'Y':
                    return 'light-green-row';
                    break;
                default:
                    return 'light-red-row';
            }

        });
        for(var i=0; i< this.columns.length; i++) {

            var o = this.columns[i];
            console_logs('this.columns' + i, o);

            var dataIndex = o['dataIndex'];
            

            switch(dataIndex) {
                case 'mass':
                case 'reserved_double4':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                        value = Ext.util.Format.number(value, '0,00.000/i');

                        value = '<div  style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;">'+value +'(KG)</font></div>'
                        return value;
                    };
                    break;
                case 'reserved_double2':
                case 'reserved_double3':
                case 'item_quan':
                case 'bm_quan':
                    o['summaryType'] = 'sum';
                    o['summaryRenderer'] = function(value, summaryData, dataIndex) {
                        value = '<div align="center" style="font: bold 2.0em/1.0em 굴림체;"><font style="font-size:10pt; color:#FF0040;"> 합계: '+value +'</font></div>'
                        return value;
                    };
                    break;
                default:
            }

        }
        // for(var i=0; i< this.columns.length; i++) {
        //     var o = this.columns[i];
        //     console_logs('this.columns' + i, o);
        // }

        var arr=[];
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();
        var searchToolbar =  this.createSearchToolbar();


        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }

        });
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        // var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
	    //     /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
	    //     	groupHeaderTpl: '<div><font color=#003471>{name} :: </font> 구매 ({rows.length})</div>'
		// }); 
		// var option = {
        //     features: [groupingFeature]
        // };

        buttonToolbar.insert(2, this.changeProdAction);
        buttonToolbar.insert(2, this.barcodePrintAction);
        buttonToolbar.insert(4, this.barcodePrintActionCap);

        arr.push(buttonToolbar);

        //검색툴바 생성
        arr.push(searchToolbar);

        this.createGridCore(arr/*, option*/);

        this.editAction.setText(CMD_VIEW_DTL);

        //PDF 파일 출력기능
        this.printPDFAction3 = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'P/L',
            tooltip:'PartList 출력',
            disabled: true,

            handler: function(widget, event) {
                //var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;

                var rtgast_uid = gm.me().vSELECTED_UNIQUE_ID;
                var po_no = gm.me().vSELECTED_AC_UID;
                //var rtg_type = gm.me().vSELECTED_RTG_TYPE;
                var is_rotate = 'N';
                var rec = selectedRecord;
                var actuator = false;
                var parent = '';
                var rtgast_uid = '';


                if(selectedRecord.get('po_type') == 'ACT' || selectedRecord.get('po_type') == 'UKN') {
                    po_type = selectedRecord.get('po_type');
                    parent_uid = rec.get('parent_uid');
                    rtgast_uid = rec.get('unique_id');
                    actuator = true;
                } else {
                    po_type = selectedRecord.get('po_type');
                    parent_uid = rec.get('unique_uid');
                    rtgast_uid = rec.get('unique_id');
                    actuator = false;
                }

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPl',
                    params:{
                        parent_uid: parent_uid,
                        //parent_act: rec.get('parent_act'),
                        po_no: rec.get('coord_key3'),
                        po_type: po_type,
                        actuator: actuator,
                        rtgast_uid : rtgast_uid,
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


        //작업반려 Action 생성
        this.denyWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '작업취소',
            tooltip: 'LOT 해체',
            disabled: true,
            handler: function() {
                Ext.MessageBox.show({
                    title:CMD_OK,
                    msg: 'LOT를 재구성하시겠습니까?<br>이 작업은 취소할 수 없습니다.',
                    buttons: Ext.MessageBox.YESNO,
                    fn:  function(result) {
                        if(result=='yes') {
                            gm.me().denyWorkOrderFc();
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        //작업지시 Action 생성
        this.addWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Job_Confirm', '작업지시'),
            tooltip: '작업지시 확정',
            disabled: true,
            handler: function() {
                gm.me().treatWorkStart();
            }
        });

        //작업완료 Action 생성
        this.finishWorkOrder = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '작업완료',
            tooltip: '작업완료 확정',
            disabled: true,
            handler: function() {
                gm.me().treatWorkFinish();

            }
        });

        var textname = "";
        switch(vCompanyReserved4){
            case 'DDNG01KR' :
                textname = '제작';
                is_rotate = 'N';
                break;
            case 'SWON01KR' :
                textname = 'PDF';
                is_rotate = 'Y';
                break;
            case "SKNH01KR" :
                textname = '제작지시서';
                is_rotate = 'N';
                break;
            default :
                textname = 'PDF';
                is_rotate = 'N';
        }

        //불출요청
        this.requestGoodsout = Ext.create('Ext.Action',{
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '불출요청',
            tooltip:'자재 불출요청',
            disabled: true,

            handler: function(widget, event) {

                var rtgastUid = gm.me().vSELECTED_RTGAST_UID;
                var reserved_varchar1 = gm.me().reserved_varchar1;

                console_logs('rtgast_uid>>>>>>>>>>>>>>>>>>>', rtgastUid);
                console_logs('reserved_varchar1>>>>>>>>>>>>>>>>>>>', reserved_varchar1);

                switch(reserved_varchar1) {
                    case 'Y':
                    case 'C':
                    case 'P':
                        Ext.Msg.alert('안내', '이미 요청하였습니다.', function() {});
                        break;
                    default:
                        var form = Ext.create('Ext.form.Panel', {
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
                                labelWidth: 60,
                                margins: 10,
                            },
                            items: [
                                {
                                    fieldLabel: '요청일자',
                                    xtype:'datefield',
                                    name:'req_date',
                                    format: 'Y-m-d',
                                    value: new Date()
                                }
                            ]//item end..

                        });//Panel end...
                        prwin = gMain.selPanel.prwinopen2(form);

                }
            }
        });

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
			/*text: '제작',*/
            text: textname,
            tooltip:'제작지시서 출력',
            disabled: true,

            handler: function(widget, event) {
                var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var pcs_code = gm.me().vSELECTED_PCS_CODE;
                var ac_uid = gm.me().vSELECTED_AC_UID;

                console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
                console_logs('pdf gm.me().big_pcs_code>>>>>>>>>>>>>>>>>>>', pcs_code);
                console_logs('pdf ac_uid>>>>>>>>>>>>>>>>>>>', ac_uid);

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printWo',
                    params:{
                        rtgast_uid : rtgast_uid,
                        po_no : po_no,
                        pcs_code : pcs_code,
                        ac_uid : ac_uid,
                        is_heavy : 'Y',	 //중공업:Y  기타:N
                        is_rotate : is_rotate, //가로양식:Y 세로양식:N
                        wo_type : 'P',
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

        //PDF 파일 출력기능
        this.printPDFAction2 = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '조립',

            tooltip:'조립지시서 출력',
            disabled: true,

            handler: function(widget, event) {
                var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
                var po_no = gm.me().vSELECTED_PO_NO;
                var pcs_code = gm.me().vSELECTED_PCS_CODE;
                var ac_uid = gm.me().vSELECTED_AC_UID;
                console_logs('pdf po_no>>>>>>>>>>>>>>>>>>>', po_no);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printWo',
                    params:{
                        rtgast_uid : rtgast_uid,
                        po_no : po_no,
                        pcs_code : pcs_code,
                        ac_uid : ac_uid,
                        is_heavy : 'Y',	 //중공업:Y  기타:N
                        is_rotate : 'N', //가로양식:Y 세로양식:N
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

//         switch(vCompanyReserved4) {
//             case "HAEW01KR" :
//             case "DAEH01KR" :
//             case "SKNH01KR" :
//                 var processes = null;
//                 if(gUtil.mesTplProcessBig!=null && gUtil.mesTplProcessBig.length>0) {
//                     processes = gUtil.mesTplProcessBig;
//                 } else {
//                 }

//                 if(processes!=null) {
//                     for(var i=0; i<processes.length; i++) {
//                         var o = processes[i];
//                         var big_pcs_code = o['code'];
//                         var title = '[' + o['code'] + ']' + o['name'];

//                         if(vCompanyReserved4=='SKNH01KR') {
//                             title = o['code'];
//                         }
//                         console_logs('title', title);

//                         var action = Ext.create('Ext.Action', {
//                             xtype : 'button',
//                             text: title,
//                             tooltip: o['name'] + ' 공정',
//                             big_pcs_code: big_pcs_code,
//                             toggleGroup: this.link + 'bigPcsType',
//                             handler: function() {
//                                 gm.me().setBigPcsCode(this.big_pcs_code);
//                                 console_logs('=========big_pcs_code', gm.me().big_pcs_code);
// //             				 gm.me().store.getProxy().setExtraParam('big_pcs_code', gm.me().big_pcs_code);
// //             				 gm.me().storeLoad();
//                             }
//                         });

//                         buttonToolbar.insert(2, action);

//                     }
//                     var action = Ext.create('Ext.Action', {
//                         xtype : 'button',
//                         text: '전체 공정',
//                         tooltip: '전체 공정',
//                         big_pcs_code: '',
//                         pressed: true,
//                         toggleGroup: this.link + 'bigPcsType',
//                         handler: function() {
//                             console_logs('big_pcs_code', this.big_pcs_code);
//                             if(vCompanyReserved4 == 'SKNH01KR') {
//                                 gm.me().store.getProxy().setExtraParam('po_type', '');
//                                 gm.me().storeLoad();
//                             }

// //           				 gm.me().store.getProxy().setExtraParam('big_pcs_code', '');
// //           				 gm.me().storeLoad();
//                         }
//                     });

//                     buttonToolbar.insert(2, action);
//                 }
//                 break;
//         }



        //버튼 추가.
		/*buttonToolbar.insert(4, this.addWorkOrder);
		 buttonToolbar.insert(4, '-');*/
//        if(vCompanyReserved4 == 'SHNH01KR'){
//        	buttonToolbar.insert(2, this.finishWorkOrder);
//        }

       // buttonToolbar.insert(2, this.addWorkOrder);
        buttonToolbar.insert(2, this.denyWorkOrder);
        buttonToolbar.insert(2, '-');

        // buttonToolbar.insert(4, this.printPDFAction);
        // if(vCompanyReserved4 == 'DDNG01KR'){
        //     buttonToolbar.insert(5, this.printPDFAction2);
        // } else if(vCompanyReserved4 == 'SKNH01KR') {
        //     buttonToolbar.insert(5, this.printPDFAction3);

        //     buttonToolbar.insert(5, this.requestGoodsout);
        // }

        buttonToolbar.insert(5, '-');

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if (selections==null || selections.length ==0) {
                gm.me().vSELECTED_UNIQUE_ID = -1;
                //gm.me().addWorkOrder.disable();
                gm.me().finishWorkOrder.disable();
                gm.me().printPDFAction.disable();
                gm.me().printPDFAction2.disable();
                gm.me().printPDFAction3.disable();
                gm.me().denyWorkOrder.disable();
                gm.me().barcodePrintAction.disable();
                gm.me().barcodePrintActionCap.disable();
                gm.me().changeProdAction.disable();
                

            } else {

                var rec = selections[0];
                console_logs('rec',rec);

                selectedRecord = rec;

                gm.me().vSELECTED_RTGAST_UID = rec.get('unique_id');
                gm.me().vSELECTED_AC_UID = rec.get('coord_key3');
                gm.me().reserved_varchar1 = rec.get('reserved_varchar1');
                gm.me().vSELECTED_PO_NO = rec.get('pj_code');
                gm.me().vSELECTED_LOT_NO= rec.get('lot_no');
                // 170707
                gm.me().vSELECTED_PO_TYPE=rec.get('po_type');
                gm.me().addWorkOrder.enable();
                gm.me().printPDFAction.enable();
                gm.me().printPDFAction2.enable();
                gm.me().printPDFAction3.enable();

                gm.me().requestGoodsout.enable();

                gm.me().barcodePrintAction.enable();
                gm.me().barcodePrintActionCap.enable();
                
                gm.me().changeProdAction.enable();

                gm.me().vSELECTED_PCS_CODE = rec.get('pcs_code');
                gm.me().vSELECTED_STATE = rec.get('state'); //product의 item_code
                if(gm.me().vSELECTED_STATE != 'Y'){
                    //gm.me().addWorkOrder.enable();
                    gm.me().denyWorkOrder.enable();

                }

            }

        });


        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        //작업 그룹 목록 그리드탭

        // 소그룹 PDF 출력은 대동에서만 사용
        var printpdf_min = null;
        if(vCompanyReserved4 == 'DDNG01KR'){
            console_logs('min-pdf');
            printpdf_min = Ext.create('Ext.Action', {
                iconCls: 'af-pdf',
                text: '소그룹PDF',
                tooltip: 'purchase order requestion',
                //toggleGroup: 'toolbarcmd',
                handler: this.pdfprintHandler
            });
        }else{
            //console_logs('min-pdf=null');
            printpdf_min = null;
        }
        var excelPrint = Ext.create('Ext.Action',{
            iconCls: 'af-excel',
            text: 'Excel',
            tooltip: '다운로드',
            handler: this.printExcelHandler

        });
        // 소그룹 추가 버튼
        var addMinPo = null;
        if(vCompanyReserved4 == 'DDNG01KR'){
            console_logs('min-pdf');
            addMinPo = Ext.create('Ext.Action', {
                iconCls: 'af-plus-circle',
                text: '소그룹추가',
                tooltip: '소그룹 추가 하기',
                //toggleGroup: 'toolbarcmd',
                handler: this.addMinPoHandler
            });
        }else{
            //console_logs('min-pdf=null');
            addMinPo = null;
        }

        this.callParent(arguments);

        //EditPane size 늘림.
        //this.crudEditSize = 700;

        //디폴트 로딩
        gMain.setCenterLoading(false);

        switch(vCompanyReserved4){

            case 'DDNG01KR':
                this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000300');
                break;
            default:
                if(gUtil.checkUsePcstpl()==false) {
                    this.grid.getStore().getProxy().setExtraParam('po_type', 'PRD');
                }
                break;
        }
        this.store.load();


//        if(vCompanyReserved4=='DDNG01KR'){
//			this.grid.getStore().getProxy().setExtraParam('order_com_unique', '79070000300');
//		} else if (vCompanyReserved4 ='DOOS01KR'){
//			this.grid.getStore().getProxy().setExtraParam('po_type', 'TPL_ASSY');
//		} else {
//			this.grid.getStore().getProxy().setExtraParam('po_type', 'PRD');
//		}
//        this.store.load();
    },





    selectPcsRecord: null,






    items : [],

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
        //console_logs('cellEditing>>>>>>>>>>', cellEditing);
        gm.me().workListStore = Ext.create('Rfx.store.HeavyWorkListStore');
        //console_logs('workListStore>>>>>>>>>>');
        gm.me().workListStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_RTGAST_UID);


        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
       
    },

    addTabCartLineGridPanel: function(title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('records>>>>>>>>>>', records);
//		    	 setEditPanelTitle();
                if(success ==true) {
                    try { this.callBackWorkListCHNG(title, records, arg, fc, id); } catch(e) { console_logs('callBackWorkListCHNG error', e);}
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
    addWorkOrderFc: function() {


//    	var target_reserved_double3 = this.getInputTarget('unique_id');
//    	var assymapUid = target_reserved_double3.getValue()
//
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process-hanaro.do?method=addWorkOrderHanaro',
            params:{
                rtgastUid: rtgastUid
            },

            success : function(result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function() {});

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax

    },

    denyWorkOrderFc: function() {
        console_logs('this.vSELECTED_RECORD', this.vSELECTED_RECORD);

        var rtgastUid = this.vSELECTED_RECORD.get('unique_id');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=denyWorkOrderHanaro',
            params:{
                rtgastUid: rtgastUid
            },

            success : function(result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function() {});

            },//endofsuccess
            failure: extjsUtil.failureMessage
        });//endofajax
    },

    treatWorkStart: function(){

        //다수협력사지정
        var itemsPartner = [];

        for(var i=0; i<gUtil.mesStdProcess.length; i++) {
            var o = gUtil.mesStdProcess[i];
            var pcs_code = o['code'];
            var pcs_name = o['name'];
            console_logs('itemspartner',o);
            var aStore = Ext.create('Mplm.store.DeptStore', {dept_group: pcs_code});

            switch(vCompanyReserved4){
                case 'CHNG01KR':
                    itemsPartner.push({
                        fieldLabel:  ' 협력사',//ppo1_request,
                        xtype: 'combo',
                        anchor: '100%',
                        name:   'one_maker',
                        id: 'one_maker',
                        mode: 'local',
                        displayField:   'dept_name',
                        store: Ext.create('Mplm.store.DeptStoreCHNG'),
                        sortInfo: { field: 'create_date', direction: 'DESC' },
                        valueField : 'unique_id',
                        typeAhead: false,
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function(){
                                return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                            }
                        }
                    });
                    itemsPartner.push({
                        fieldLabel:  ' 대공정',//ppo1_request,
                        xtype: 'combo',
                        anchor: '100%',
                        name:   'auto_big_pcs_code',
                        id: 'auto_big_pcs_code',
                        mode: 'local',
                        displayField:   'pcs_name',
                        store: Ext.create('Mplm.store.BigPcsCodeStore'),
                        sortInfo: { field: 'create_date', direction: 'DESC' },
                        valueField : 'pcs_code',
                        typeAhead: false,
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function(){
                                return '<div data-qtip="{unique_id}">[{pcs_code}] {pcs_name}</div>';
                            }
                        }
                    });
                    itemsPartner.push({
                        fieldLabel: '메 모',
                        xtype: 'textarea',
                        anchor: '100%',
                        id:'reserved_varchar1',
                        name: 'reserved_varchar1'

                    });

                    break;
                case 'SHNH01KR':
                    //if(vCompanyReserved4 == 'SHNH01KR'){
                    if(pcs_code == 'PNT'|| pcs_code == 'IPP'){

                    }else{
                        var myId = this.link + pcs_code+  'h_outmaker';
                        this.madeComboIds.push(myId);
                        itemsPartner.push({
                            fieldLabel: pcs_name + ' 협력사',//ppo1_request,
                            xtype: 'combo',
                            anchor: '100%',
                            name: pcs_code+  'h_outmaker',
                            id: myId,
                            mode: 'local',
                            displayField:   'dept_name',
                            store: aStore,
                            sortInfo: { field: 'create_date', direction: 'DESC' },
                            valueField : 'dept_code',
                            typeAhead: false,
                            minChars: 1,
                            listConfig:{
                                loadingText: '검색중...',
                                emptyText: '일치하는 항목 없음.',
                                getInnerTpl: function(){
                                    return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                                }
                            }
                        });
                    }
                    break;
                case 'DAEH01KR':
                    var myId = this.link + pcs_code+  'h_outmaker';
                    this.madeComboIds.push(myId);
                    itemsPartner.push({
                        fieldLabel: pcs_name,//ppo1_request,
                        xtype: 'combo',
                        anchor: '100%',
                        name: pcs_code+  'h_outmaker',
                        id: myId,
                        mode: 'local',
                        displayField:   'dept_name',
                        store: aStore,
                        sortInfo: { field: 'create_date', direction: 'DESC' },
                        valueField : 'dept_code',
                        typeAhead: false,
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function(){
                                return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                            }
                        }
                    });
                    break;
                case 'HAEW01KR':
                    var myId = this.link + pcs_code+  'h_outmaker';
                    this.madeComboIds.push(myId);
                    itemsPartner.push({
                        fieldLabel: pcs_name,//ppo1_request,
                        xtype: 'combo',
                        anchor: '100%',
                        name: pcs_code+  'h_outmaker',
                        id: myId,
                        mode: 'local',
                        displayField:   'dept_name',
                        store: aStore,
                        sortInfo: { field: 'create_date', direction: 'DESC' },
                        valueField : 'dept_code',
                        typeAhead: false,
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function(){
                                return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                            }
                        }
                    });
                    break;
                case 'SWON01KR':
                    break;
                case 'SKNH01KR':
                    break;
                case 'KWLM01KR':
                    break;
                default :
                    var myId = this.link + pcs_code+  'h_outmaker';
                    this.madeComboIds.push(myId);
                    itemsPartner.push({
                        fieldLabel: pcs_name + ' 협력사',//ppo1_request,
                        xtype: 'combo',
                        anchor: '100%',
                        name: pcs_code+  'h_outmaker',
                        id: myId,
                        mode: 'local',
                        displayField:   'dept_name',
                        store: aStore,
                        sortInfo: { field: 'create_date', direction: 'DESC' },
                        valueField : 'dept_code',
                        typeAhead: false,
                        minChars: 1,
                        listConfig:{
                            loadingText: '검색중...',
                            emptyText: '일치하는 항목 없음.',
                            getInnerTpl: function(){
                                return '<div data-qtip="{unique_id}">[{dept_code}] {dept_name}</div>';
                            }
                        }
                    });
                    break;
            }


        }//endoffor


        switch(vCompanyReserved4){

            case "DDNG01KR" :
                itemsPartner.push({
                        fieldLabel: '제작검사예정일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestampa',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    },
                    {
                        fieldLabel: '제작완료일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp1',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    },{
                        fieldLabel: '조립완료요청일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp3',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    },{
                        fieldLabel: '조립완료일',
                        xtype: 'datefield',
                        anchor: '100%',
                        id: 'reserved_timestamp4',
                        name: 'reserved_timestamp4',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    });
                break;
            case "HAEW01KR" :
                itemsPartner.push({
                        fieldLabel: '제작완료일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestampa',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    },
                    {
                        fieldLabel: '용접완료일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp1',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    });
                break;
            case 'SHNH01KR' :

                itemsPartner.push({
                        fieldLabel: '제작착수일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp2',//h_reserved70 종전 name
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    },
                    {
                        fieldLabel: '제작완료요청일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp1',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    },
                    {
                        fieldLabel: '제작검사예정일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestampa',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    });
                break;
            default:


                itemsPartner.push(
//    				{
//    			fieldLabel: '제작검사예정일',
//    			xtype: 'datefield',
//    			anchor: '100%',
//    			name: 'reserved_timestampa',
//    			format: 'Y-m-d',
//    	    	submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
//    	    	dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
//    		},
                    {
                        fieldLabel: '완료요청일',
                        xtype: 'datefield',
                        anchor: '100%',
                        name: 'reserved_timestamp1',
                        format: 'Y-m-d',
                        submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                        dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                    });

                break;
        }


        itemsPartner.push({

            fieldLabel: '긴급여부',//ppo1_request,
            xtype: 'combo',
            anchor: '100%',
            name: 'recv_flagname',
            mode: 'local',
            value: '일반',
            store: Ext.create('Mplm.store.HeavyEmergency'),
            sortInfo: { field: 'create_date', direction: 'DESC' },
            //valueField : 'system_code',
            displayField : 'code_name_kr',
            typeAhead: false,
            minChars: 1,
            listConfig:{
                loadingText: '검색중...',
                emptyText: '일치하는 항목 없음.',
                getInnerTpl: function(){
                    return '<div data-qtip="{unique_id}">[{system_code}] {code_name_kr}</div>';
                }
            },
            listeners: {
                select: function (combo, record) {
                    var reccode = record.get('system_code');
                    Ext.getCmp('recv_flag').setValue(reccode);
                }
            }


        },{
            xtype: 'hiddenfield',
            id :'recv_flag',
            name : 'recv_flag',
            value : 'GE'


        });


        var form = Ext.create('Ext.form.Panel', {
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
                labelWidth: 60,
                margins: 10,
            },
            items: [/*{
			 xtype: 'fieldLabel',
			 value : ''
			 },*/
                {
                    xtype: 'fieldset',
                    title: '작업지시내용',
                    defaultType: 'textfield',
					/*boder : true,
					 defaults: {
					 width: 280
					 },*/
                    items: itemsPartner
                },

            ]//item end..

        });//Panel end...
        myHeight = 400;
        myWidth = 320;

        if(vCompanyReserved4=='PNLC01KR') {
            myHeight = 300;
        } else if (vCompanyReserved4=='DOOS01KR') {
            myHeight = 650;
        }

        prwin = gm.me().prwinopen(form);
    },

    pdfprintHandler : function(){

        var rtgast_uid = gm.me().vSELECTED_RTGAST_UID;
        var po_no = gm.me().vSELECTED_PO_NO;
        var pcs_code = gm.me().big_pcs_code;
        var ac_uid = gm.me().vSELECTED_AC_UID;
        console_logs('gm.me().big_pcs_code    >>>>>>>>>>>>>>>>>>>', gm.me().big_pcs_code);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/pdf.do?method=printWo',
            params:{
                rtgast_uid : rtgast_uid,
                po_no : po_no,
                pcs_code : gm.me().getPcsCode(gm.me().big_pcs_code),
                ac_uid : ac_uid,
                is_heavy : 'Y',	 //중공업:Y  기타:N
                is_rotate : 'Y', //가로양식:Y 세로양식:N
                specification : gm.me().selectSpecification,
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

    },
    callBackWorkListCHNG: function(title, records, arg, fc, id) {
        var gridId = id== null? this.getGridId() : id;

        var o = gMain.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];

        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        this.cartLineStore = Ext.create('Rfx.store.CartLineStore');
        this.cartLineStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_RTGAST_UID);

        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
        this.cartLineGrid = Ext.create('Ext.grid.Panel', {
            //id: gridId,
            store: this.cartLineStore,
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
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: 'multi'}),
            plugins: [cellEditing],
            listeners: {
                itemcontextmenu: function(view, rec, node, index, e) {
                    e.stopEvent();
                    try {
                        contextMenu.showAt(e.getXY());
                    } catch (e) {}

                    return false;
                },
                select: function(selModel, record, index, options){

                },
                itemdblclick: function (view, record, htmlItem, index, eventObject, opts) {

                    gm.me().downListRecord(record);
                }, //endof itemdblclick
                cellkeydown:function (cartLineGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {

                    }
                }
            },//endof listeners
            columns: columns
        });
        this.cartLineGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                fc(selections);
            }
        });
        var view = this.cartLineGrid.getView();

        // var nav = Ext.create('Ext.util.KeyNav', Ext.getDoc(), {
        //     down: function(e) {
        //         var selectionModel = this.cartLineGrid.getSelectionModel();
        //         var select = 0; // select first if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.cartLineGrid.getSelectionModel().getSelection()[0].index + 1;
        //         }
        //         view.select(select);

        //     },
        //     up: function(e) {
        //         var selectionModel = this.cartLineGrid.getSelectionModel();
        //         var select = this.cartLineGrid.store.totalCount - 1; // select last element if no record is selected
        //         if ( selectionModel.hasSelection() ) {
        //             select = this.cartLineGrid.getSelectionModel().getSelection()[0].index - 1;
        //         }
        //         view.select(select);

        //     }
        // });

        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.cartLineGrid);
    },
    prwinopen: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: gm.getMC('CMD_Job_Confirm', '작업지시'),
            width: myWidth,

            height: myHeight,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn){
                    var msg = '작업지시를 하시겠습니까?'
                    var myTitle = '작업지시';
                    Ext.MessageBox.show({
                        title: myTitle,
                        msg: msg,
                        buttons: Ext.MessageBox.YESNO,
                        icon: Ext.MessageBox.QUESTION,
                        fn: function(btn) {
                            if(btn == "no"){
                                MessageBox.close();
                            }else{
                                var form = gu.getCmp('formPanel').getForm();
                                var cartmaparr = gm.me().cartmap_uids;
                                var ac_uid = gm.me().vSELECTED_AC_UID;
                                //var rtgastUid = this.vSELECTED_RECORD.get('unique_id');
                                var rtgastUid = gm.me().vSELECTED_RTGAST_UID;

                                var selections = gm.me().grid.getSelectionModel().getSelection();
                                var rtgastUids =[];
                                var ac_uids =[];

                                for(var i=0; i< selections.length; i++) {
                                    var rec = selections[i];
                                    console_logs('rec', rec);

                                    var uid =  rec.get('unique_id');  //rtgast_uid
                                    rtgastUids.push(uid);

                                    var ac_uid = rec.get('coord_key3');   //프로젝트 uid
                                    ac_uids.push(ac_uid);
                                }

                                console_logs('gm.me().big_pcs_code', gm.me().big_pcs_code);
                                switch(vCompanyReserved4){
                                    case "DAEH01KR":
                                        if(gm.me().big_pcs_code==null) {
                                            Ext.Msg.alert('안내', '먼저 공정탭을 선택하세요.', function() {});
                                        } else {
                                            form.submit({
                                                url : CONTEXT_PATH + '/index/process.do?method=addWorkOrderHeavy',
                                                params:{
                                                    cartmap_uids: cartmaparr,
                                                    ac_uid: ac_uid,
                                                    reserved_varchar3: gm.me().big_pcs_code,
                                                    rtgastUid: rtgastUid
                                                },
                                                success: function(val, action){
                                                    prWin.close();
                                                    gm.me().grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
                                                    gm.me().store.load(function(){});
                                                },
                                                failure: function(val, action){
                                                    prWin.close();
                                                }
                                            });
                                        }
                                        break;

                                    default:
                                        var reserved_varchar3 =
                                            form.submit({
                                                url : CONTEXT_PATH + '/index/process-hanaro.do?method=addWorkOrderHanaro',
                                                params:{
                                    				cartmap_uids: cartmaparr,
                                                    ac_uid: ac_uid,
                                                    reserved_varchar3: gm.me().big_pcs_code,
                                                    rtgastUid: rtgastUid,
                                                    //auto_big_pcs_code : gm.me().big_pcs_code,
                                                    ac_uids: ac_uids,
                                                    rtgastUids: rtgastUids
                                                },
                                                success: function(val, action){
                                                    prWin.close();
                                                    gm.me().grid.getStore().getProxy().setExtraParam('reserved_varchar3', 'PRD');
                                                    gm.me().requestGoodsout.enable();
//                                    				gm.me().store.load(function(){});
                                                    gm.me().store.load();
                                                },
                                                failure: function(val, action){
                                                    prWin.close();
                                                }
                                            });
                                        break;
                                }
                            }
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
        console_logs('start');
        prWin.show(
            undefined, function(){


                var arr = gm.me().madeComboIds;
                for(var i=0; i<arr.length; i++) {
                    var comboId = arr[i];
                    console_logs('comboId', comboId);
                    Ext.getCmp(comboId).store.load(function(records) {
                        if(records!=null && records.length>0) {
                            var rec = records[0];
                            var mycomboId = gm.me().link + rec.get('pcs_code')+  'h_outmaker';
                            console_logs('record', records[0]);
                            Ext.getCmp(mycomboId).select(records[0]);
                        }
                    });

                }


            }
        );
        console_logs('end');

    },

    editRedord: function (field, rec) {

        var params = {};

        switch (field) {
            case 'lot_no':
                gm.editAjax('rtgast', 'po_no', rec.get('lot_no'), 'unique_id', rec.get('unique_id_long'),  {type:''});
                break;
            default:
                gm.editRedord(field, rec);
                break;
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


//		            this.unassignedPalletStore.load(function(records){
//		          	   console_logs('unassignedPalletStore', records);
//
//		             });

                    this.downListStore.proxy.setExtraParam('parent', gm.me().parent);
                    this.downListStore.load(function(records, operation, success) {

                        //	console_logs('unassignedPalletStore.load records', records);
                        var downListGrid = Ext.create('Ext.grid.Panel', {
                            layout: 'fit',
                            forceFit: true,
                            store: gm.me().downListStore,
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
    },
    madeComboIds: [],
    treatWorkFinish: function(){
        var rtgast_uids = [];
        var selections = this.grid.getSelectionModel().getSelection();
        for(var i=0; i< selections.length; i++) {
            var rec = selections[i];
            var uid =  rec.get('unique_id');
            rtgast_uids.push(uid);
        }
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=finishWorkOrderHeavy',
            params:{
                rtgastUids : rtgast_uids
            },
            reader: { 		},
            success : function(result, request) {
                gm.me().store.load();
                Ext.Msg.alert('안내', '요청하였습니다.', function() {});

            },
            failure: extjsUtil.failureMessage
        });
    },
    addMinPoHandler : function(){
        gMain.extFieldColumnStore.load({
            //params: { 	menuCode: 'SRO5_DDG'  },
            params: { 	menuCode: 'EPC5'  },
            callback: function(records, operation, success) {
                if(success ==true) {
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
                    var o = gMain.parseGridRecord(myRecords, 'ADDMINPO');
                    console_logs('ooooo', o);
                    var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
                    //var unassignedPalletStore = Ext.create('Rfx.store.UnassignedPalletStore', {});
                    var minPoListModel = Ext.create('Rfx.model.HEAVY4ProducePlan', {
                        fields: fields
                    });
                    var addMinPoListStore = new Ext.data.Store({
                        pageSize: 100,
                        model: minPoListModel,
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
                    console_logs('addMinPoListStore 후', addMinPoListStore);
//		            this.unassignedPalletStore.load(function(records){
//		          	   console_logs('unassignedPalletStore', records);
//
//		             });

                    addMinPoListStore.proxy.setExtraParam('parent', gm.me().parent);
                    addMinPoListStore.proxy.setExtraParam('reserved_varchar3', 'PRD');
                    addMinPoListStore.load(function(records, operation, success) {
                        var minPoSelModel = Ext.create("Ext.selection.CheckboxModel", {} );
                        console_logs('addMinPoListStore>>>>>>>>', records);
                        var addMinPoListGrid = Ext.create('Ext.grid.Panel', {
                            layout: 'fit',
                            forceFit: true,
                            store: addMinPoListStore,
                            height: '200',
                            border: true,
                            selModel: minPoSelModel,
                            autoScroll : true,
                            autoHeight: true,
                            columns: columns,
                            collapsible: false,
                            viewConfig: {
                                stripeRows: true,
                                enableTextSelection: false
                            }
                        });

                        addMinPoListGrid.getSelectionModel().on({
                            selectionchange: function(sm, selections) {
                                console_logs('selections>>>>>', selections);
                                gm.me().cartmaparr = [];
                                gm.me().po_quan = 0;
                                gm.me().reserved_double4 = 0;

                                for(var i=0; i< selections.length; i++) {
                                    var rec = selections[i];
                                    var uid =  rec.get('unique_uid');  //CARTMAP unique_id
                                    gm.me().cartmaparr.push(uid);

                                    var po_quan_unit = rec.get('quan');  // 소그룹 po 수량

                                    console_logs('unit 수량', po_quan_unit);
                                    gm.me().po_quan = gm.me().po_quan + po_quan_unit;
                                    console_logs('po_quan 수량', gm.me().po_quan);
                                    var tmp_weight = rec.get('mass');   //  소그룹 po 중량
                                    gm.me().reserved_double4 = gm.me().reserved_double4 + tmp_weight;
                                    console_logs('중량', gm.me().reserved_double4);

                                }

                                console_logs('cartmaparr>>>>>', gm.me().cartmaparr);
                            }
                        });

                        var win = Ext.create('ModalWindow', {
                            title: '소그룹리스트',
                            layout: 'fit',
                            forceFit: true,
                            width: 1200,
                            height: 400,
                            layout: 'absolute',
                            autoScroll : true,
                            plain:true,
                            tbar: [
                            ],
                            items: [addMinPoListGrid],
                            buttons: [{
                                text: CMD_OK,
                                handler: function(){
                                    if(win) {
                                        if(gm.me().cartmaparr == undefined){
                                            win.close();
                                        }else{
                                            win.close();
                                        }


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
    },
    printExcelHandler: function() {

        if(gm.me().vSELECTED_RTGAST_UID != null){
            var store = gm.me().cartLineGrid.getStore();
        }else{
            var store = gm.me().getStore();
        }

        console_logs('store>>>>>', store);

        store.getProxy().setExtraParam("srch_type", 'excelPrint');
        store.getProxy().setExtraParam("srch_fields", 'major');
        store.getProxy().setExtraParam("srch_rows", 'all');
        store.getProxy().setExtraParam("menuCode", gm.me().link);
        store.load({
            scope: this,
            callback: function(records, operation, success) {
                try {
                    var count = Number(store.getProxy().getReader().rawData.count);
                    console_logs('try count>>>>>'+count);
                    if(count > 255) {
                        Ext.MessageBox.alert('Info', 'Record quantity is Limited to 255.', callBack);
                        function callBack(id) {
                            gm.me().excelPrintFc ();
                        }
                    } else {
                        console_logs('else count>>>>>'+count);
//    					gm.me().excelPrintFc ();
                        var arrField = this.gSearchField;
                        try {
                            Ext.each(arrField, function(fieldObj, index) {

                                var dataIndex = '';

                                if(typeof fieldObj == 'string') { //text search
                                    dataIndex = fieldObj;
                                } else {
                                    dataIndex = fieldObj['field_id'];
                                }

                                var srchId = gMain.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                                var value = Ext.getCmp(srchId).getValue();

                                if(value!=null && value!='') {
                                    if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
                                        store.getProxy().setExtraParam(dataIndex, value);
                                    } else {
                                        var enValue = Ext.JSON.encode('%' + value+ '%');
                                        console_info(enValue);
                                        store.getProxy().setExtraParam(dataIndex, enValue);
                                    }//endofelse
                                }//endofif

                            });
                        } catch(noError){}
//    					store.load({
//    					    scope: this,
//    					    callback: function(records, operation, success) {
                        console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
                        var excelPath = store.getProxy().getReader().rawData.excelPath;
                        if(excelPath!=null && excelPath.length > 0) {
                            console_logs("excelPath>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",excelPath);
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
                            top.location.href=url;
                        } else {
                            alert('다운로드 경로를 찾을 수 없습니다.');
                        }
//    					    }
//    					});
                    }
                } catch(e){}
            }
        });
    },

    excelPrintFc : function () {

        var arrField = this.gSearchField;
        console_log("arrField>>>>>>>>>>>>>"+arrField);

        var store = Ext.create('Rfx.store.CartLineStore');
        store.getProxy().setExtraParam('rtgastuid', gm.me().uids);

        try {
            Ext.each(arrField, function(fieldObj, index) {

                var dataIndex = '';

                if(typeof fieldObj == 'string') { //text search
                    dataIndex = fieldObj;
                } else {
                    dataIndex = fieldObj['field_id'];
                }

                var srchId = gMain.getSearchField(dataIndex); //'srch' + dataIndex.substring(0,1).toUpperCase()+ dataIndex.substring(1);
                var value = Ext.getCmp(srchId).getValue();

                if(value!=null && value!='') {
                    if(dataIndex=='unique_id' || typeof fieldObj == 'object') {
                        store.getProxy().setExtraParam(dataIndex, value);
                    } else {
                        var enValue = Ext.JSON.encode('%' + value+ '%');
                        console_info(enValue);
                        store.getProxy().setExtraParam(dataIndex, enValue);
                    }//endofelse
                }//endofif

            });
        } catch(noError){}


        store.load({
            scope: this,
            callback: function(records, operation, success) {
                console_logs("store.load>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",records);
                var excelPath = store.getProxy().getReader().rawData.excelPath;
                if(excelPath!=null && excelPath.length > 0) {
                    console_logs("excelPath>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",excelPath);
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path="+ excelPath;
                    top.location.href=url;
                } else {
                    alert('다운로드 경로를 찾을 수 없습니다.');
                }
            }
        });
    },
    
    isComplishedStore : Ext.create('Mplm.store.cloudProjectTreeStore', {})
    ,
    getPcsCode: function(in_big_pcs_code) {

        console_logs('in_big_pcs_code', in_big_pcs_code);
        console_logs('gUtil.mesTplProcessAll', gUtil.mesTplProcessAll);
        var processes = gUtil.mesTplProcessAll;

        console_logs('processes', processes);
        if(processes!=null) {
            var list = processes[in_big_pcs_code];
            console_logs('list', list);
            return (list[0])['code'];
        } else {
            'PRD';
        }
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
        //console_logs('cellEditing>>>>>>>>>>', cellEditing);
        gm.me().workListStore = Ext.create('Rfx.store.BomListStore');
        //console_logs('workListStore>>>>>>>>>>');
        gm.me().workListStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_RTGAST_UID);


        try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
      
    },
    bSelected: false,
    refreshButtons: function(bSelected) {

        console_logs('this.big_pcs_code', this.big_pcs_code);

        if(bSelected!=undefined && bSelected!=null) {
            this.bSelected = bSelected;
        }

        if( this.bSelected == true &&
            this.big_pcs_code!=undefined &&
            this.big_pcs_code!=null &&
            this.big_pcs_code!='') {
            this.addWorkOrder.enable();
        } else {
            this.addWorkOrder.disable();
        }
    },
    setBigPcsCode: function(big_pcs_code) {
        console_logs('big_pcs_code', big_pcs_code);
        this.big_pcs_code = big_pcs_code;
        this.refreshButtons();
        this.store.getProxy().setExtraParam('po_type', this.big_pcs_code);
        this.store.getProxy().setExtraParam('rtg_type', 'OD');
        this.storeLoad();
    },
    potype : 'PRD',
    //selMode : 'SINGLE',
    //selCheckOnly: false,
    selAllowDeselect: true,

    prwinopen2: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: '불출 요청',
            width: 400,
            height: 100,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(btn){

                    var form = gu.getCmp('formPanel').getForm();
                    var rtgastUid = gm.me().vSELECTED_RTGAST_UID;
                    var val = form.getValues(false);
                    var datas = (gm.me().workOrderGrid.store.data)['items'];
                    var assymap_uids = [];
                    var vv_cnts=[];
                    var item_names=[];
                    var childs=[];
                    var ac_uids=[];

                    for(var i=0; i<datas.length; i++) {
                        var o = datas[i];
                        assymap_uids.push(o.get('unique_uid'));
                        vv_cnts.push(o.get('vv_cnt'));
                        item_names.push(o.get('item_name'));
                        childs.push(o.get('unique_id'));
                        ac_uids.push(o.get('ac_uid'));
                    }


                    console_logs('assymap_uids', assymap_uids);

                    var lot_no = gm.me().vSELECTED_LOT_NO;
                    var po_type=gm.me().vSELECTED_PO_TYPE;

                    var content="공정:"+po_type+" LOT번호:"+lot_no;

                    gMain.setCenterLoading(true);

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/index/process.do?method=requestGoodsout',
                        params:{
                            rtgastUid: rtgastUid,
                            po_no: gm.me().vSELECTED_PO_NO,
                            po_type:po_type,
                            assymap_uids: assymap_uids,
                            child:childs,
                            pr_quan: vv_cnts,
                            item_name:item_names[0],
                            pj_uid : ac_uids[0],
                            content : content,
                            req_date : val['req_date'],
                            reserved_varchar1 : gm.me().reserved_varchar1,
                            parent_code : gm.me().link
                        },

                        success : function(result, request) {
                            gMain.setCenterLoading(false);
                            Ext.Msg.alert('안내', '요청하였습니다.', function() {});
                            gm.me().reserved_varchar1 = 'Y';
                            gm.me().storeLoad();

                        },//endofsuccess
                        failure: extjsUtil.failureMessage
                    });//endofajax

                    if(prWin) {
                        prWin.close();
                    }

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
    changeProd: function () {
        
        var selections = gm.me().grid.getSelectionModel().getSelection();

        var unique_uids = [];
        var selected = null;
        for(var i=0; i<selections.length; i++) {
            var selection = selections[i];

            var item_code = selection.get('item_code');
            var item_name = selection.get('item_name');
            var specification = selection.get('specification');
            var lot_no = selection.get('lot_no');

            var line = '[' + lot_no + '] ' + item_code + ' , '+ item_name + ' , ' + specification;
            if(selected==null) {
                selected = line;
            } else {
                selected = selected + '\n' + line;
            }

            var unique_uid = selection.get('unique_uid');

            unique_uids.push(unique_uid);
        }
    

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel_changeProd'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '5 5 5 5',
            region: 'center',
            
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            
            items : [
                {
                    xtype: 'fieldcontainer',
                    flex:1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: '15 15 15 15',
                    items: [
                        new Ext.form.Hidden({
                            name: 'unique_uids',
                            value: unique_uids
                        }),
                        {
                            xtype: 'textarea',
                            fieldLabel: '선택 자재',
                            emptyText: '선택 자재',
                            margin: '5 5 5 5',
                            width: 400,
                            height: 100,
                            readOnly: true,
                            value: selected,
                            fieldStyle: 'background-color: #FBF8E6; background-image: none;',

                        },
                        {
                            xtype: 'textfield',
                            name: 'product_code',
                            fieldLabel: '제품번호',
                            margin: '5 5 5 5',
                            width: 200,
                            allowBlank: false
                        }
                        ]
                }
            ]



        });//Panel end...
        prwin = gMain.selPanel.changeProdopen(form);
    },
    changeProdopen: function (form) {

        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '제품번호 변경',
			plain: true,
			width: 400,
			height: 300,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    // var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    // var uniqueIdArr = [];
                    // var bararr = [];

					var form = gu.getCmp('formPanel_changeProd').getForm();
                    var val = form.getValues(false);
                    console_logs('val=', val);
                    if(val.product_code==null) {
                        Ext.MessageBox.alert('사용불가', '제품번호를 확인할 수 없습니다.');
                        return;
                    }
                    // uniqueIdArr.push(val.product_uid);
                    // bararr.push(val.item_code + '|' + val.item_name + '|' + val.specification
                    // + '  (포장:' + val.order_multiple + ')');
					// var checkLot = val.lot_nos;

					// console_logs('PRINT checkLot', checkLot);

                    prWin.setLoading(true);
                    form.submit({
                        url: CONTEXT_PATH + '/design/bom.do?method=updateProductInassy',
                        params: val,
                        success: function (val, action) {
                            console_logs('val', val);
                            prWin.setLoading(false);  
                            prWin.close();
                           // gm.me().showToast('결과', '제품정보 수정에 성공하였습니다.');
                            gMain.selPanel.store.load(function () {   });
                        },
                        failure: function (val, action, param3) {
                            //console_logs('param1', val);
                           // console_logs('param2', action);
                            //console_logs('param3', param3);
                            prWin.setLoading(false);  
                            prWin.close();
                           // gm.me().showToast('경고', '제품정보 수정 실패한 자재가 있습니다.');
                            gMain.selPanel.store.load(function () {     });

                        }
                    });


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    },
    printBarcode: function () {
        
        
        var item_code = null;
		var product_uid  = null;
        var order_multiple  = null;
        var specification = null;
        var item_name = null;
        var lot_nos = '';
        var lot_nos_disp = '';
        var selections = gm.me().grid.getSelectionModel().getSelection();

        var rtg_uid = '';

        for(var i=0; i<selections.length; i++) {
            var selection = selections[i];
            if(item_code == null) {
                item_code = selection.get('parent_item_code');
                specification = selection.get('parent_specification');
                item_name = selection.get('parent_item_name');
                product_uid = selection.get('parent_product_uid');
                order_multiple = selection.get('order_multiple');
                lot_nos = selection.get('lot_no');
                lot_nos_disp = selection.get('lot_no');

            } else {
                if(item_code != selection.get('parent_item_code')) {
                    Ext.MessageBox.alert('사용불가', '제품코드가 다른 자재가 선택되었습니다.');
                    return;
                }
                if(i==3 || i==6 ) {
                    lot_nos = lot_nos + '|';
                    lot_nos_disp = lot_nos_disp + '\n';
                } else {
                    lot_nos = lot_nos + ' ';
                    lot_nos_disp = lot_nos_disp + ' ';
                }
                lot_nos = lot_nos + selection.get('lot_no');
                lot_nos_disp = lot_nos_disp + selection.get('lot_no');
            }
        }
        
        console_logs('lot_nos', lot_nos);
        console_logs('lot_nos_disp', lot_nos_disp);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '5 5 5 5',
            region: 'center',
            
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            
            items : [
                {
                    xtype: 'fieldcontainer',
                    flex:1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: '15 15 15 15',
                    items: [
                        {
                            xtype: 'textfield',
                            margin: '3 3 3 3',
                            allowBlank: true,
                            hidden: true,
                            name: 'product_uid',
                            value: product_uid                        
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '제품번호',
                            margin: '3 3 3 3',
                            allowBlank: true,
                            name: 'item_code',
                            value: item_code,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                        }
                        ,
                        {
                            xtype: 'textfield',
                            fieldLabel: '품명',
                            margin: '3 3 3 3',
                            allowBlank: true,
                            name: 'item_name',
                            value: item_name,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',

                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '규격',
                            margin: '3 3 3 3',
                            name: 'specification',
                            value: specification,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                        }
                        ]
                },
                
                    {

                        xtype: 'fieldcontainer',
                        flex:1,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                title: '제품 바코드',
                                collapsible: false,
                                margin: '10 10 10 10',
                                flex: 1,
                                height:160,
                                defaults: {
                                    labelWidth: 60,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                                },
                                items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'print_qty',
                                            fieldLabel: '출력매수',
                                            margin: '5 5 5 5',
                                            width: 200,
                                            allowBlank: false,
                                            value: 1,
                                            maxlength: '1',
                                        },
                                        {
                                            xtype: 'radiogroup',
                                            fieldLabel: '출력 구분',
                                            margin: '5 5 5 5',
                                            width: 200,
                                            allowBlank: false,
                                            items: [
                                                {boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true},
                                                {boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
                                            ]
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'order_multiple',
                                            fieldLabel: '포장단위',
                                            emptyText: '포장단위',
                                            margin: '5 5 5 5',
                                            width: 200,
                                            allowBlank: true,
                                            value: order_multiple,
                                        }
            
                                ]
                            }, //endof fieldset
                            {
                                xtype: 'fieldset',
                                title: 'LOT 번호',
                                collapsible: false,
                                margin: '10 10 10 10',
                                width: 340,
                                height:160,
                                defaults: {
                                    labelWidth: 60,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'hiddenfield',
                                        name: 'lot_nos',
                                        value: lot_nos
                                    },
                                    {
                                        xtype: 'textarea',
                                        margin: '5 5 5 5',
                                        width: 200,
                                        readOnly: true,
                                        value: lot_nos_disp,
                                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',

                                    }
                                ]
                            }//endof fieldset
                        ]
                    }
                
                
            ]



        });//Panel end...
        prwin = gMain.selPanel.prbarcodeopen(form);
    },



    printBarcodeCap: function () {
        
    
        var store1 =  gm.me().combstBranchStore;


        var item_code = null;
		var product_uid  = null;
        var order_multiple  = null;
        var specification = null;
        var item_name = null;
        var lot_nos = '';
        var lot_nos_disp = '';
        var selections = gm.me().grid.getSelectionModel().getSelection();
        //var selections = gm.me().grid.getSelectionModel().getSelection()[0];

        var rtg_uid = '';


        // var cap_sixteen= 11000195000553; //16
        // var cap_twenty = 11000195000554; //20
        // var cap_twenty_five = 11000195000555; //25
        // var cap_thirty = 11000195000556; // 30
        // var cap_forty = 11000195000557; //40
        // var cap_fifty = 11000195000558; //50


        for(var i=0; i<selections.length; i++) {
            var selection = selections[i];

            //null 조건문 제외 .
            item_code = selection.get('item_code');
            
            //specification = selection.get('parent_specification');
            specification = selection.get('specification');

                //아이템명 수정
            //parent_item_name = selection.get('parent_item_name');
            item_name = selection.get('item_name');

            //parent product uid 를 수정
          
            product_uid = selection.get('product_uid');

            // switch(product_uid) {
            //     case 11000195000553 : product_uid = 11000195000553
            // }
            // product_uid = selection.get('parent_product_uid');
            


            order_multiple = selection.get('order_multiple');
            lot_nos = selection.get('lot_no');
            lot_nos_disp = selection.get('lot_no');

                
            //item code -- if null else 조건문 제외
            // if(item_code == null) {
            //     item_code = selection.get('parent_item_code');
            //     specification = selection.get('parent_specification');
            //     item_name = selection.get('parent_item_name');
            //     product_uid = selection.get('parent_product_uid');
            //     order_multiple = selection.get('order_multiple');
            //     lot_nos = selection.get('lot_no');
            //     lot_nos_disp = selection.get('lot_no');

            // } 

            // else {
            //     if(item_code != selection.get('parent_item_code')) {
            //         Ext.MessageBox.alert('사용불가', '제품코드가 다른 자재가 선택되었습니다.');
            //         return;
            //     }
            //     if(i==3 || i==6 ) {
            //         lot_nos = lot_nos + '|';
            //         lot_nos_disp = lot_nos_disp + '\n';
            //     } else {
            //         lot_nos = lot_nos + ' ';
            //         lot_nos_disp = lot_nos_disp + ' ';
            //     }
            //     lot_nos = lot_nos + selection.get('lot_no');
            //     lot_nos_disp = lot_nos_disp + selection.get('lot_no');
            // }



        }
        
        console_logs('lot_nos', lot_nos);
        console_logs('lot_nos_disp', lot_nos_disp);

        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '5 5 5 5',
            region: 'center',
            
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            fieldDefaults: {
                labelAlign: 'right',
                msgTarget: 'side'
            },
            defaults: {
                anchor: '100%',
                labelWidth: 60,
                margins: 10,
            },
            
            items : [
                {
                    xtype: 'fieldcontainer',
                    flex:1,
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                    bodyPadding: '15 15 15 15',
                    items: [
                        {
                            xtype: 'textfield',
                            margin: '3 3 3 3',
                            allowBlank: true,
                            hidden: true,
                            name: 'product_uid',
                            value: product_uid                        
                        },
                        {
                            xtype: 'textfield',
                            //store:gm.me().combstBranchStore,
                            fieldLabel: '제품번호',
                            margin: '3 3 3 3',
                            allowBlank: true,
                            name: 'item_code',
                            value: item_code,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                        }
                        ,
                        {
                            xtype: 'textfield',
                            fieldLabel: '품명',
                            margin: '3 3 3 3',
                            allowBlank: true,

                            //item name 을 parent item name으로 수정
                            name: 'item_name',
                            value: item_name,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',

                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: '규격',
                            margin: '3 3 3 3',
                            name: 'specification',
                            value: specification,
                            readOnly: true,
                            fieldStyle: 'overflow:scroll ;overflow-x:hidden; background-color: #F0F0F0; background-image: none;border-bottom: #999999 1px solid;border-left: #999999 1px solid;border-right: #999999 1px solid;border-top: #999999 1px solid;',
                        }
                        ]
                },
                
                    {

                        xtype: 'fieldcontainer',
                        flex:1,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                title: '제품 바코드',
                                collapsible: false,
                                margin: '10 10 10 10',
                                flex: 1,
                                height:160,
                                defaults: {
                                    labelWidth: 60,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                                },
                                items: [
                                        {
                                            xtype: 'numberfield',
                                            name: 'print_qty',
                                            fieldLabel: '출력매수',
                                            margin: '5 5 5 5',
                                            width: 200,
                                            allowBlank: false,
                                            value: 1,
                                            maxlength: '1',
                                        },
                                        {
                                            xtype: 'radiogroup',
                                            fieldLabel: '출력 구분',
                                            margin: '5 5 5 5',
                                            width: 200,
                                            allowBlank: false,
                                            items: [
                                                {boxLabel: '개별', name: 'print_type', inputValue: 'EACH', checked: true},
                                                {boxLabel: '동일', name: 'print_type', inputValue: 'SAME'},
                                            ]
                                        },
                                        {
                                            xtype: 'numberfield',
                                            name: 'order_multiple',
                                            fieldLabel: '포장단위',
                                            emptyText: '포장단위',
                                            margin: '5 5 5 5',
                                            width: 200,
                                            allowBlank: true,
                                            value: order_multiple,
                                        }
            
                                ]
                            }, //endof fieldset
                            {
                                xtype: 'fieldset',
                                title: 'LOT 번호',
                                collapsible: false,
                                margin: '10 10 10 10',
                                width: 340,
                                height:160,
                                defaults: {
                                    labelWidth: 60,
                                    anchor: '100%',
                                    layout: {
                                        type: 'hbox',
                                        defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                                    }
                                },
                                items: [
                                    {
                                        xtype: 'hiddenfield',
                                        name: 'lot_nos',
                                        value: lot_nos
                                    },
                                    {
                                        xtype: 'textarea',
                                        margin: '5 5 5 5',
                                        width: 200,
                                        readOnly: true,
                                        value: lot_nos_disp,
                                        fieldStyle: 'background-color: #FBF8E6; background-image: none;',

                                    }
                                ]
                            }//endof fieldset
                        ]
                    }
                
                
            ]



        });//Panel end...
        prwin = gMain.selPanel.prbarcodeopen(form);
    },



    prbarcodeopen: function (form) {


        // rtg unique id 보내기 위함
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var rtg_uid = '';
        var rtgUidAray = [];

        for(var i=0; i<selections.length; i++) {
            var selection = selections[i];
              
                //추가작성
                rtg_uid = selection.get('unique_id_long');
                rtgUidAray.push(rtg_uid);
                
                console_logs('rtg_uid Array select >>>>> ' , rtgUidAray);
            
         }
         //닫기



        prWin = Ext.create('Ext.Window', {
            modal: true,
            title: '바코드 출력',
			plain: true,
			width: 600,
			height: 400,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function () {

                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                    var uniqueIdArr = [];
                    var bararr = [];

					var form = gu.getCmp('formPanel').getForm();
                    var val = form.getValues(false);
                    console_logs('val=', val);
                    if(val.product_uid==null) {
                        Ext.MessageBox.alert('사용불가', 'produt uid 를 찹을 수 없습니다.');
                        return;
                    }
                    uniqueIdArr.push(val.product_uid);
                    bararr.push(val.item_code + '|' + val.item_name + '|' + val.specification
                    + '  (포장:' + val.order_multiple + ')');
					var checkLot = val.lot_nos;

					console_logs('PRINT checkLot', checkLot);

                    form.submit({

                        //원본 (생산바코드 두개로 출력되는버전, 하지만 생산완료가 안되는 오류 발생)
                        //url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcode',

                        //미주 생산바코드 글자크기 작은 용지로 수정한버전(제대로 출력됨)
                        //(밑에가 제대로 출력됨)
                        url: CONTEXT_PATH + '/sales/productStock.do?method=printBarcodeMjcm01kr',

                        params: {
                            productUids: uniqueIdArr,
                            barcodes: bararr,
                            lot_no: checkLot,
                            rtg_uid : rtgUidAray


                        },
                        success: function (val, action) {
                            prWin.close();
                            gm.me().showToast('결과', '바코드 정보를  프린터에 전송하였습니다.');
                            // gMain.selPanel.store.load(function () {
                            // });
                        },
                        failure: function (val, action) {
                            prWin.close();
                            Ext.Msg.alert('메시지', '바코드 출력 요청을 하였으나 실패하였습니다.');
                            // gMain.selPanel.store.load(function () {
                            // });
                        }
                    });


                }//btn handler
            }, {
                text: CMD_CANCEL,
                handler: function () {
                    if (prWin) {

                        prWin.close();

                    }
                }
            }]
        });
        prWin.show();
    }

});