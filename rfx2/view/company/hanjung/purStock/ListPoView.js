//주문서별 현황

var searchDatetypeStore  = Ext.create('Mplm.store.SearchDatetypeStore', {hasNull: false} );

Ext.define('Rfx2.view.company.hanjung.purStock.ListPoView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'list-po-view',
    initComponent: function(){

        //검색툴바 필드 초기화
        this.initSearchField();

        this.blockExpand = true;

        if(vCompanyReserved4 == 'KWLM01KR') {
            this.addSearchField({
                type: 'radio',
                field_id :'date_check',
                items: [
                    {
                        text :  '포함',
                        name : 'date_check',
                        value: 'N',
                        checked: true
                    },
                    {
                        text :  '미포함',
                        name : 'date_check',
                        value: 'Y'
                    }
                ]
            });
        }

        switch(vCompanyReserved4) {
            case 'HSGC01KR':
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'create_date',
                    text:'주문일자:',
                    labelWidth: 70,
                    sdate: Ext.Date.add(new Date(gm.GetServerTime()), Ext.Date.MONTH, -1),
                    edate: Ext.Date.add(new Date(gm.GetServerTime()), Ext.Date.MONTH, 0)
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'rtgast-po',
                    tableName: 'rtgast',
                    field_id: 'po_no',
                    fieldName: 'po_no',
                    params: {
                        rtg_type: 'O'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'rtgast-po',
                    tableName: 'supast',
                    field_id: 'supplier_name',
                    fieldName: 'supplier_name',
                    params: {
                    }
                });
                break;
            case 'KWLM01KR':
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'create_date',
                    text:'주문일자:',
                    labelWidth: 70,
                    sdate: new Date(),
                    edate: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
                });
//				this.addSearchField('project_varchar3');
                this.addSearchField('pj_name');
                this.addSearchField('supplier_name');
                this.addSearchField('po_no');
                // this.addSearchField (
                // {
                // 	field_id: 'state'
                // 	,store: "DatetypePpo2Store"
                // 	,displayField:   'code_name_kr'
                // 	,valueField:   'system_code'
                // 	,innerTpl	: '<div data-qtip="{system_code}">{code_name_kr}</div>'
                // });
                // this.addSearchField({
                // 	 field_id: 'reserved_number2'
                // 	,store: 'DivisionStore2'
                // 	,displayField:   'division_name'
                // 	,valueField:   'id'
                // 	,innerTpl	: '<div data-qtip="{id}">{division_name}</div>'
                // });
                break;
            case 'SKNH01KR':
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'create_date',
                    text:'주문일자:',
                    labelWidth: 70,
                    sdate: new Date(),
                    edate: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
                });
//                this.addSearchField('project_varchar3');
                this.addSearchField('supplier_name');
                this.addSearchField('po_no');
                this.addSearchField (
                    {
                        field_id: 'state_po'
                        ,store: "DatetypePpo2Store"
                        ,displayField:   'code_name_kr'
                        ,valueField:   'system_code'
                        ,innerTpl	: '<div data-qtip="{system_code}">{code_name_kr}</div>'
                    });
                break;
            default:
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'create_date',
                    text:'주문일자:',
                    labelWidth: 70,
                    sdate: new Date(),
                    edate: Ext.Date.add(new Date(), Ext.Date.MONTH, 1)
                });
//                this.addSearchField('project_varchar3');
                this.addSearchField('supplier_name');
                this.addSearchField('po_no');
                this.addSearchField (
                    {
                        field_id: 'state'
                        ,store: "DatetypePpo2Store"
                        ,displayField:   'code_name_kr'
                        ,valueField:   'system_code'
                        ,innerTpl	: '<div data-qtip="{system_code}">{code_name_kr}</div>'
                    });
        }

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        console_logs('this.fields', gMain.pageSize);

        this.createStore('Rfx.model.ListPo', [{
                property: 'unique_id',
                direction: 'DESC'
            }],
            gMain.pageSize/*pageSize*/
            ,{}
            ,['rtgast']
        );

        switch(vCompanyReserved4) {
            case 'DABP01KR':
                this.store.getProxy().setExtraParam('is_po', 'Y');
                this.store.getProxy().setExtraParam('is_gr', 'N');
                this.store.getProxy().setExtraParam('route_type', 'P');
                break;
            case 'KWLM01KR':
                this.store.getProxy().setExtraParam('mp_status', 'PC');
                break;
            default:
                break;
        }

        var option = {
            // features: [groupingFeature],
            listeners: {
                itemdblclick: this.attachFileView
            }
        };


        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];

            switch(dataIndex) {
                case 'reserved_varchar9':
                    columnObj['renderer'] = function(value) {
                        if(value == null || value == 'N' || value.length < 1 || value == undefined) {
                            value = "N";
                        }
                        return value;
                    }
                    break;
            }
        });
        //grid 생성.
        this.createGridCore(arr, option);
        this.editAction.setText('상세보기');
        this.setEditPanelTitle('상세보기');

        // remove the items
        (buttonToolbar.items).each(function(item,index,length){
            switch(vCompanyReserved4) {
                case 'DOOS01KR':
                    if(index==1||index==3||index==4||index==5) {
                        buttonToolbar.items.remove(item);
                    }
                    break;
                case 'HSGC01KR':
                    if(index==1||index==3||index==4) {
                        buttonToolbar.items.remove(item);
                    }
                    break;
                default:
                    if(index==1||index==3||index==4||index==5) {
                        buttonToolbar.items.remove(item);
                    }
            }

        });

        var is_rotate = '';

        switch(vCompanyReserved4) {
            case 'SKNH01KR':
            case 'APM01KR':
            case 'DABP01KR':
                is_rotate = 'Y';
                break;
            default:
                break;
        }

        this.restorePoAction = Ext.create('Ext.Action',{
            iconCls: 'af-remove',
            text: '주문취소',
            tooltip: '주문을 취소합니다.',
            disabled: true,
            handler: function() {
                var rec = gMain.selPanel.rec;

                if(rec.get('state') == 'A') {
                    Ext.MessageBox.show({
                        title:'확인',
                        msg: '주문을 취소 하시겠습니까?',
                        buttons: Ext.MessageBox.YESNO,
                        fn:  function(result) {
                            if(result=='yes') {
                                gm.me().restorePo();

                            }
                        },
                        icon: Ext.MessageBox.QUESTION
                    });
                } else {
                    Ext.Msg.alert('경고', '결재완료 상태의 주문건만 취소할 수 있습니다.');
                }
            }
        });

        this.sendMailAction = Ext.create('Ext.Action',{
            iconCls: 'af-external-link',
            text: '메일전송',
            disabled: true,
            handler: function(widget, event) {
                console_logs('==>Dddd', gm.me().grid.getSelectionModel().getSelection());
                var selection = gm.me().grid.getSelectionModel().getSelection();
                var rec = selection[0];
                var supplier_name = '';
                var rtgast_uid = rec.get('unique_id_long');//rtgast_uid
                var supplier_email_address = rec.get('supplier_email_address');
                var po_no = rec.get('po_no');//po_no
                var po_detail = /*Ext.getCmp('po_detail').getValue()*/'';

                var email = vCUR_EMAIL;
                switch(vCompanyReserved4) {
                    case 'KBTC01KR':
                        email = 'ikbtech001@gmail.com';
                        break;
                    default:
                        break;
                }

                po_detail = po_detail.replace(/(?:\r\n|\r|\n)/g, '<br />');
                po_detail = po_detail + "<br /><br /><br />본 메일은 발신전용이오니 아래의 연락처에 문의하세요.<br /><br />";
                po_detail = po_detail + "문의처: " + vCUR_DEPT_NAME + ', ' + vCUR_USER_NAME + ' (' + email + ')<br />';
                po_detail = po_detail + "별첨: 주문서";

                var byCompany = ''; // "/발주서 -(주)제이엔에스";

                switch(vCompanyReserved4) {
                    case 'KBTC01KR':
                        byCompany = "/발주서 -(주)KB텍";
                        supplier_name = rec.get('supplier_name') + ' - ';
                        break;
                    default:
                        byCompany = '';
                        break;
                }

                //console_logs('gSelectedRtgast', gSelectedRtgast);
                //console_logs('po_no', po_no);
                var mailForm = Ext.create('Ext.form.Panel', {
                    id: 'formPanelSendmail',
                    defaultType: 'textfield',
                    border: false,
                    bodyPadding: 15,
                    region: 'center',
                    defaults: {
                        anchor: '100%',
                        allowBlank: false,
                        msgTarget: 'side',
                        labelWidth: 100
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'rtgast_uid',
                            value: rtgast_uid
                        }),
                        new Ext.form.Hidden({
                            name: 'po_no',
                            value: po_no
                        }),
                        {
                            name: 'mailTo',
                            allowBlank: false,
                            value: supplier_email_address,
                            anchor: '100%'  // anchor width by percentage
                        },
                        {
                            name: 'mailSubject',
                            allowBlank: false,
                            value: '[' + po_no + ']' + supplier_name + '주문합니다.' + byCompany,
                            anchor: '100%'  // anchor width by percentage
                        },
                        {
                            name: 'mailContents',
                            allowBlank: false,
                            xtype: 'htmleditor',
                            value: po_detail,
                            height: 240,
                            anchor: '100%'
                        },
                        {
                            xtype: 'filefield',
                            emptyText: panelSRO1149,
                            buttonText: '업로드',
                            allowBlank: true,
                            buttonConfig: {
                                iconCls: 'af-upload'
                            },
                            anchor: '100%'
                        }
                    ]
                });

                var win = Ext.create('ModalWindow', {
                    title: '공급사에 메일 전송',
                    width: 750,
                    height: 430,
                    items: mailForm,
                    buttons: [{
                        text: '메일전송 ' + CMD_OK,
                        handler: function(){
                            var form = Ext.getCmp('formPanelSendmail').getForm();
                            if(form.isValid())
                            {
                                var val = form.getValues(false);
                                //console_logs('val', val);
///********************파일첨부시 추가(Only for FileAttachment)**************
                                //alert('add Handler:' + /*(G)*/vFILE_ITEM_CODE);
                                /*(G)*/vFILE_ITEM_CODE = RandomString(10);
                                val["file_itemcode"] = /*(G)*/vFILE_ITEM_CODE;

                                mailForm.submit({
                                    url: CONTEXT_PATH + '/uploader.do?method=multi&file_itemcode=' +/*(G)*/vFILE_ITEM_CODE,
                                    waitMsg: 'Uploading Files...',
                                    success: function(fp, o) {
                                        console_logs('save  success', o);
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/pdf.do?method=printPoAndSendMail',
                                            params:{
                                                rtgast_uid : val['rtgast_uid'],
                                                po_no : val['po_no'],
                                                mailTo : val['mailTo'],
                                                mailSubject : val['mailSubject'],
                                                mailContents : val['mailContents'],
                                                file_itemcode : vFILE_ITEM_CODE,
                                                pdfPrint : 'sendMail'
                                            },
                                            success : function(result, request) {
                                                console_logs('save  success2', result);
                                                if(win) {
                                                    win.close();
                                                }//
                                                Ext.MessageBox.alert('전송확인', '전송되었습니다.');
                                            },
                                            failure: extjsUtil.failureMessage
                                        });//ajaxrequest
                                    },
                                    failure : function(){
                                        console_log('failure');
//	                    		mask.hide();
                                        Ext.MessageBox.alert(error_msg_prompt,'Failed');
                                    }
                                });

                            } else {
                                Ext.MessageBox.alert(error_msg_prompt, error_msg_content);
                            }

                        }//endofhandler
                    },{
                        text: CMD_CANCEL,
                        handler: function(){
                            if(win) {
                                win.close();
                            }//endofwin
                        }//endofhandler
                    }//CMD_CANCEL
                    ]//buttons
                });
                win.show();

            }//endofhandler
        });

        //PDF 파일 출력기능
        this.printPDFAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: 'PDF',

            tooltip:'주문서 출력',
            disabled: true,

            handler: function(widget, event) {
                var rtgast_uid = gMain.selPanel.vSELECTED_UNIQUE_ID;
                var po_no = gMain.selPanel.vSELECTED_PO_NO;

                var route_type = gMain.selPanel.vSELECTED_ROUT_TYPE;

                if(route_type == 'U'
                    || vCompanyReserved4 == 'SKNH01KR'
                    || vCompanyReserved4 == 'APM01KR'
                    // || vCompanyReserved4 == 'KWLM01KR'
                    || vCompanyReserved4 == 'DABP01KR'
                    || vCompanyReserved4 == 'SWON01KR'
                ) {
                    is_rotate = 'Y';
                }

                var supplier_code = gMain.selPanel.rec.get('supplier_code');

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/pdf.do?method=printPo',
                    params:{
                        rtgast_uid : rtgast_uid,
                        po_no : po_no,
                        pdfPrint : 'pdfPrint',
                        is_rotate: is_rotate,
                        route_type:route_type,
                        supplier_name: supplier_code
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

                        switch(vCompanyReserved4) {
                            case 'KWLM01KR':
                                gm.me().updatePrintYn(rtgast_uid);
                                break;
                            default:
                                break;
                        }

                    },
                    failure: extjsUtil.failureMessage
                });
                is_rotate = '';

            }
        });
        //버튼 추가.
        buttonToolbar.insert(1, this.sendMailAction);
        buttonToolbar.insert(1, this.printPDFAction);
        if(vCompanyReserved4 == 'SKNH01KR') {
            buttonToolbar.insert(1, this.restorePoAction);
        }
        buttonToolbar.insert(1, '-');

//        this.callParent(arguments);

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.rec = rec;
                console_logs('여기', rec);
                gMain.selPanel.vSELECTED_UNIQUE_ID = rec.get('id'); //rtgast_uid
                gMain.selPanel.vSELECTED_PO_NO = rec.get('po_no'); //po_no
                gMain.selPanel.vSELECTED_QUAN = rec.get('quan');
                gMain.selPanel.vSELECTED_ROUT_TYPE = rec.get('route_type_s');
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.editAction.enable();
                gMain.selPanel.printPDFAction.enable();
                gMain.selPanel.sendMailAction.enable();
                gMain.selPanel.restorePoAction.enable();

            } else {
                gMain.selPanel.vSELECTED_UNIQUE_ID = -1;
                gMain.selPanel.editAction.disable();
                gMain.selPanel.printPDFAction.disable();
                gMain.selPanel.sendMailAction.disable();
                gMain.selPanel.restorePoAction.disable();
            }
            this.listPoviewGrid.getStore().getProxy().setExtraParam('rtgastuid', gMain.selPanel.vSELECTED_UNIQUE_ID);
            this.listPoviewGrid.getStore().getProxy().setExtraParam('limit', 100);
            console_logs('rtgastuid>>>>>>>>>', gMain.selPanel.vSELECTED_UNIQUE_ID);
            this.listPoviewGrid.getStore().load(function(record) {
                var sales_amounts = 0;
                var po_qtys = 0;

                for(var i=0; i<record.length; i++) {
                    console_logs('>>>>>>Weqweq', record[i]);
                    var sales_amount = record[i].get('sales_amount_local');
                    var po_qty = record[i].get('po_qty');
                    sales_amount = parseFloat(sales_amount);
                    po_qty = parseFloat(po_qty);
                    sales_amounts += sales_amount;
                    po_qtys += po_qty;
                }
                console_logs('>>>>>>sales_amounts', sales_amounts);
                console_logs('>>>>>>po_qtys', po_qtys);
                console_logs('>>>>>>buttonToolbar3', gm.me().buttonToolbar3);
                gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(sales_amounts) + ' / 총 주문수량 : ' + po_qtys);
            }); // this.listPoviewGrid 와 번갈아서 해봐야 함. 되었다 안되었다 함.
        });
        this.createCrudTab();
        this.crudTab.setSize(this.getCrudeditSize());
        console_logs('getCrudeditSize>>>>>>>>>', this.getCrudeditSize());

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.cancelPo = Ext.create('Ext.Action', {
            disabled: true,
            glyph: 'xf00d@FontAwesome',
            cls: 'red-color',
            text: '주문취소',
            tooltip: '주문취소',
            handler: this.cancelPoHandler
        });

        this.returnPoAction = Ext.create('Ext.Action',{
            iconCls: 'af-remove',
            text: '발주반려',
            tooltip:'발주 반려',
            hidden: vCompanyReserved4 == 'KWLM01KR' ? false : true,
            disabled: true,
            handler: this.returnPoHandler
        });


        this.addTablistPoviewGridPanel('상세보기', 'PPO2_SUB', {
                pageSize: 100,
                //model: 'Rfx.model.HEAVY4WorkOrder',
                model:'Rfx.store.ListPoViewStore',
                dockedItems: [
                    {
                        dock: 'top',
                        xtype: 'toolbar',
                        cls: 'my-x-toolbar-default3',
                        items: [
                            this.cancelPo, '-', this.returnPoAction, '->', this.buttonToolbar3
                        ]
                    }
                ],
                sorters: [{
                    property: '',
                    direction: ''
                }]
            },

            function(selections) {

                var sales_amounts = 0;
                var po_qtys = 0;
                if (selections.length) {
                    gMain.selPanel.cancelPo.enable();
                    gMain.selPanel.returnPoAction.enable();

                    var rec = selections[0];
                    console_logs('상세정보>>>>>>>>>>>>>', rec);

                    var uids = [];

                    for( var i=0; i<selections.length; i++) {
                        var o = selections[i];
                        //            	o.set('gr_qty', gMain.selPanel.gr_qty);
                        gMain.selPanel.vSELECTED_QUAN = rec.get('quan');
                        var xpoast_uid = o.get('id');
                        uids.push(xpoast_uid);
                        console_logs('uids', uids);
                        console_logs('gMain.selPanel.vSELECTED_QUAN>>>>>>>>>>>>>', gMain.selPanel.vSELECTED_QUAN);
                        var sales_amount = o.get('sales_amount_local');
                        var po_qty = o.get('po_qty');
                        sales_amount = parseFloat(sales_amount);
                        po_qty = parseFloat(po_qty);
                        sales_amounts += sales_amount;
                        po_qtys += po_qty;
                    }
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(sales_amounts) + ' / 총 주문수량 : ' + po_qtys);
                } else {
                    gMain.selPanel.cancelPo.disable();
                    gMain.selPanel.returnPoAction.disable();
                    console_logs('>>>>listPoviewGrid', gm.me().listPoviewGrid.getStore().data.items);
                    var items = gm.me().listPoviewGrid.getStore().data.items;
                    for(var i=0; i<items.length; i++) {
                        var sales_amount = items[i].get('sales_amount_local');
                        var po_qty = items[i].get('po_qty');
                        sales_amount = parseFloat(sales_amount);
                        po_qty = parseFloat(po_qty);
                        sales_amounts += sales_amount;
                        po_qtys += po_qty;
                    }
                    gm.me().buttonToolbar3.items.items[1].update('총 금액 : ' + gUtil.renderNumber(sales_amounts) + ' / 총 주문수량 : ' + po_qtys);
                }
            },
            'listPoviewGrid'//toolbar
        );
        this.callParent(arguments);
        //디폴트 로드
        gMain.setCenterLoading(false);
        this.store.getProxy().setExtraParam('rtg_state_list', "A:G"); //입고된 것도 출력.
        if(vCompanyReserved4 == 'HSGC01KR') {
            switch(this.link) {
                case 'PPO2_MK':
                    this.store.getProxy().setExtraParam('po_type', "MK");
                    break;
                default:
                    this.store.getProxy().setExtraParam('po_type', "MN");
            }

        }
        this.store.load();
    },
    selectPcsRecord: null,
    items : [],

    setEditPanelTitle: function(t) {
        //this.vEDIT_PANEL_TITLE = t;
        this.vMESSAGE['상세보기'] = t;
    },
    getFieldList: function() {

        var items = [];
        if(this.formItems!=null) {
            for(var i=0; i<this.formItems.length; i++) {
                var form = this.formItems[i];

                //일반  Form 찾기
                for(var j=0; j<this.vFORM_FIELD_LIST.length; j++) {
                    var arr = Ext.ComponentQuery.query('[xtype=' + this.vFORM_FIELD_LIST[j] + ']', form);
                    if(arr!=null && arr.length>0) {
                        items = items.concat(arr);
                    }
                }

            }
        }

        return items;
    },

    addTablistPoviewGridPanel :function(title, menuCode, arg, fc, id) {

        gMain.extFieldColumnStore.load({
            params: { 	menuCode: menuCode  },
            callback: function(records, operation, success) {
                console_logs('menuCode>>>>>>>>>>', menuCode);
//		    	 setEditPanelTitle();
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
    returnPoHandler: function() {
        var viewSelections = gm.me().listPoviewGrid.getSelectionModel().getSelection();
        var selections = gm.me().grid.getSelectionModel().getSelection();
        var xpoast_uids = [];
        var po_no = selections[0].get('po_no');
        var item_quan = selections[0].get('item_quan');
        var pj_code = selections[0].get('pj_code');
        var item_length = viewSelections.length;
        var check_all = false;

        for(var i=0; i<item_length; i++) {
            var rec = viewSelections[i];
            gr_qty = rec.get('gr_qty');
            if(gr_qty != null && gr_qty > 0) {
                Ext.Msg.alert('경고', '입고된 항목이 있습니다.',  function(){})
                return;
            }
            xpoast_uids.push(rec.get('id'));
        }

        var msg = '주문반려하시겠습니까?<br> 이작업은 취소할 수 없습니다.'
        var alert = '알림';

        if(item_quan == item_length) {
            msg = '발주전체 반려하시겠습니까?<br> 이작업은 취소할 수 없습니다.'
            alert = '경고';
            check_all = true;
        };

        Ext.MessageBox.confirm(alert, msg, function(btn){
            if(btn=='yes'){
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/prch.do?method=returnListPoItems',
                    params:{
                        xpoast_uids:xpoast_uids,
                        po_no : po_no,
                        check_all : check_all,
                        pj_code : pj_code
                    },
                    success : function(result, request) {
                        Ext.Msg.alert('저장', '반려되었습니다.', function() {});
                        gm.me().listPoviewGrid.store.load(function(record){
                        });
                        gm.me().store.load();

                    },//endofsuccess


                });//endofajax
            } else{	}
        });
    },
    cancelPoHandler: function(){
        var listPoviewGrid = Ext.getCmp('listPoviewGrid');
        var selections = gm.me().listPoviewGrid.getSelectionModel().getSelection();
        var uids=[];
        var blocking=[];

        for(var i=0; i< selections.length; i++) {
            var record = selections[i];

            var unique_id = record.get('id');
            var po_qty = record.get('po_qty');//주문수량
            var gr_qty = record.get('gr_qty');//입고수량
            var po_blocking_qty = po_qty-gr_qty;//취소가능수량

            uids.push(unique_id);
            blocking.push(po_blocking_qty);
        }


        Ext.MessageBox.confirm('확인', '총' + uids.length + '건 을 주문취소하시겠습니까? 이작업은 취소할 수 없습니다.', function(btn){
            if(btn=='yes'){
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/purchase/prch.do?method=modifyListPoGroup',
                    params:{
                        account_code : gMain.selPanel.vSELECTED_PJ_CODE,
                        po_blocking_qty : blocking,
                        unique_id 		: uids
                    },
                    success : function(result, request) {
                        Ext.Msg.alert('저장', '취소되었습니다.', function() {});
                        gm.me().listPoviewGrid.store.load(function(record){
                        });

                    },//endofsuccess


                });//endofajax
            } else{	}
        });





    },
    getCrudeditSize: function() {
        if(this.crudEditSize>0) {
            return this.crudEditSize;
        }

        if(gMain.checkPcHeight()) {
            //console_logs('getCrudeditSize', this.getCrudeditSize);
            return this.crudEditSize<0 ? 800 : this.crudEditSize;
        } else {
            return 200;
        }
    },

    callBackWorkList: function(title, records, arg, fc, id) {
        var gridId = id== null? this.getGridId() : id;
        console_logs('gridId>>>>>>>>>>', gridId);

        var o = gMain.parseGridRecord(records, gridId);
        var fields=o['fields'], columns=o['columns'], tooltips=o['tooltips'];
        console_logs('fields>>>>>>>>>>', fields);
        console_logs('columns>>>>>>>>>>', columns);
        var modelClass = arg['model'];
        var pageSize = arg['pageSize'];
        var sorters = arg['sorters'];
        var dockedItems = arg['dockedItems'];
        console_logs('callBackWorkList dockedItems', dockedItems);
//		var important = o['important'];
        var cellEditing = new Ext.grid.plugin.CellEditing({clicksToEdit: 1});
        this.listPoViewStore = Ext.create('Rfx.store.ListPoViewStore');
        if(gm.me()!=null) {
            this.listPoViewStore.getProxy().setExtraParam('rtgastuid', gm.me().vSELECTED_UNIQUE_ID);
        }


        Ext.each(
            columns,function(o, index) {
                o['sortable'] = true;
                switch (o['dataIndex']) {
                    // case 'po_qty':
                    // case 'gr_qty':
                    case 'sales_amount':
                    case 'sales_amount_local':
                        o['style'] = 'text-align:right';
                        o['align'] = 'right';
                        o['css'] = 'edit-cell';
                        o["renderer"] =function(value, meta) {
                            meta.css = 'custom-column';
                            return value;
                        };
                        o['editor'] = {
                            allowBlank : false,
                            xtype : 'numberfield',
                            // minValue : 0
                        };
                        break;
                    case 'po_blocking_qty':
                    case 'sales_price':
                    case 'sales_price_local':
                        o['style'] = 'text-align:right';
                        o['align'] = 'right';
                        o['css'] = 'edit-cell';
                        o["renderer"] =function(value, meta) {
                            meta.css = 'custom-column';
                            return value;
                        };
                        o['editor'] = {
                            allowBlank : false,
                            xtype : 'numberfield',
                            // minValue : 0
                        };
                        break;
                    case 'req_delivery_date':
                        o['align'] = 'right';
                        o['css'] = 'edit-cell';
                        o["renderer"] =function(value, meta) {
                            meta.css = 'custom-column';
                            if(value == null) {
                                return "";
                            } else {
                                if(value.length>9) {
                                    var s = value.substr(0,10);
                                    return s;
                                } else {
                                    if(Ext.isIE) {
                                        return value;
                                    } else {
                                        return Ext.util.Format.date(value, 'Y-m-d');//Ext.util.Format.date(value, 'Y-m-d');
                                    }
                                }
                            }
                        };
                        o['editor'] = {
                            allowBlank : true,
                            xtype : 'datefield',
                            submitFormat: 'Y-m-d',
                            dateFormat: 'Y-m-d',
                            format:'Y-m-d',
                            renderer: Ext.util.Format.dateRenderer('Y-m-d')
                        };
                    default:
                        break;

                }
            });

        switch(vCompanyReserved4) {
            case 'KBTC01KR':
                break;
            default:
                try { Ext.FocusManager.enable({focusFrame: true}); } catch(e) { console_logs('FocusError', e);}
        }


        var origin_qty = 0;
        var po_qty = 0;
        var po_blocking_qty = 0;
        var can_qty = 0;
        var gr_qty= 0;
        var sales_price= 0;
        var unique_id= 0;
        var item_name='';
        var pj_code = '';
        // var req_date = '';
        this.listPoviewGrid = Ext.create('Ext.grid.Panel', {
            //id: gridId,
            store: this.listPoViewStore,
            //store: store,
            title: title,
            cls : 'rfx-panel',
            border: true,
            resizable: true,
            scroll: true,
            multiSelect: true,
            collapsible: false,
            layout          :'fit',
            forceFit: false,
            dockedItems: dockedItems,
            selModel :Ext.create("Ext.selection.CheckboxModel",{ mode: vCompanyReserved4 == 'KWLM01KR' ? 'multi' : 'single'}),
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

                    //	 gMain.selPanel.downListRecord(record);
                }, //endof itemdblclick
                cellkeydown:function (listPoviewGrid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
                    console_logs('++++++++++++++++++++ e.getKey()', e.getKey());

                    if (e.getKey() == Ext.EventObject.ENTER) {
                        console_logs('++++++++++++++++++++ e.getKey()', e.getKey());
                    }


                },
                itemclick: function (view, rec, htmlItem, index, eventObject, opts) {
                    console_logs('++++++++++++++++++++ itemclick rec', rec);
                    unique_id = rec.get('id');
                    po_qty = rec.get('po_qty');
                    origin_qty = rec.get('po_qty');//수정 전 주문수량
                    gr_qty = rec.get('gr_qty');//입고수량
                    sales_price = rec.get('sales_price');//주문단가
                    sales_amount = rec.get('sales_amount'); // 금액
                    switch(vCompanyReserved4) {
                        case 'KWLM01KR':
                            sales_price = rec.get('sales_price_local');//주문단가
                            sales_amount = rec.get('sales_amount_local'); // 금액
                            break;
                    }
                    can_qty = po_qty-gr_qty;//주문가능수량
                    po_blocking_qty = rec.get('po_blocking_qty');//주문취소수량
                    // req_date = rec.get('req_date');
                    item_name = rec.get('item_name');
                    mass = rec.get('mass');
                    req_delivery_date = null;
                },
                edit: function(view, rec, opts) {
                    console_logs('++++++++++++++++++++ in edit rec', rec);

                    var field = rec.field;
                    switch(field){
                        case 'po_qty':
                            po_qty = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'gr_qty':
                            gr_qty = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'po_blocking_qty':
                            po_blocking_qty = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'sales_price':
                        case 'sales_price_local':
                            sales_price = rec.value;//새로 입력되는 주문수량
                            break;
                        case 'req_delivery_date':
                            req_delivery_date = rec.value;
                            break;
                        case 'sales_amount':
                        case 'sales_amount_local':
                            console_logs('>>>>ccc', rec.value);
                            sales_amount = Math.floor(rec.value);
                        default:
                            break;
                    }

                    if(vCompanyReserved4 == 'KWLM01KR' && field != 'sales_amount' && field != 'sales_amount_local') {
                        var ctr_flag = rec.record.get('ctr_flag');
                        var mass = rec.record.get('mass');
                        var po_qty = rec.record.get('po_qty');
                        switch(ctr_flag) {
                            case 'M':
                                sales_amount = Math.floor(sales_price * mass)
                                break;
                            default:
                                sales_amount = Math.floor(sales_price * po_qty)
                                break;
                        }

                        console_logs('recrecrec', mass + ' : ' + po_qty);
                    };

                    if(req_delivery_date!=null) {
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/purchase/prch.do?method=updateXpoastReqdate',
                            params:{
                                req_delivery_date:req_delivery_date,
                                unique_id:unique_id  // xpoast_uid
                            },
                            success : function(result, request) {

                                gm.me().showToast('결과','[' + item_name + '] ' + ' 의 요청납기 '+  '가 수정되었습니다.');

                                gm.me().listPoviewGrid.store.load(function(record){
                                });

                            },//endofsuccess

                        });//endofajax
                    }



                    if(origin_qty<po_qty){
                        Ext.Msg.alert('다시 입력','변경 수량은 주문수량을 초과할수 없습니다.');
                        po_qty =origin_qty;
                        gm.me().listPoviewGrid.store.load();
                    }else{
                        console_logs('++++++++++++++++++++ po_blocking_qty22', po_blocking_qty);

                        if(po_blocking_qty<can_qty || po_blocking_qty == can_qty){

                            Ext.Ajax.request({
                                url: CONTEXT_PATH + '/purchase/prch.do?method=destroy',
                                params:{
                                    // po_qty:po_qty,
                                    // gr_qty:gr_qty,
                                    account_code:gMain.selPanel.vSELECTED_PJ_CODE,
                                    po_blocking_qty:po_blocking_qty,
                                    sales_price:sales_price,
                                    sales_amount:sales_amount,
                                    unique_id:unique_id  // xpoast_uid
                                },
                                success : function(result, request) {
                                    //취소수량은 취소가능수량(주문가능수량)을 넘을 수 없다.
                                    console_logs('++++++++++++++++++++ result', result);

                                    gm.me().showToast('결과','[' + item_name + '] ' + ' 의 수량이 '+  '이 수정되었습니다.');

                                    gm.me().listPoviewGrid.store.load(function(record){
                                    });

                                },//endofsuccess

                            });//endofajax
                        }else{
                            Ext.Msg.alert('다시 입력','취소수량은 취소가능수량을 초과할수 없습니다.');
                            gr_qty = gr_qty;
                            gm.me().listPoviewGrid.store.load();
                        }
                    }
                }

            },//endof listeners
            columns: columns
        });
        this.listPoviewGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                fc(selections);
            }
        });


        var tabPanel = Ext.getCmp(gMain.geTabPanelId());

        tabPanel.add(this.listPoviewGrid);
    },
    selMode : vCompanyReserved4 == 'KWLM01KR' ? 'MULIT' : 'SINGLE',
    selCheckOnly: false,
    selAllowDeselect: true,
    setActiveCrudPanel: function(mode) {
        this.crudMode = mode;

        var crudTab = Ext.getCmp(gMain.geViewCrudId());
        if(crudTab!=null) {
            crudTab.setTitle(this.vMESSAGE[this.crudMode]);
            this.createAction.setText(this.vButtonLabel[this.crudMode]);
            if(this.propDisplayProp == true) {
                switch(this.crudMode) {
                    case "VIEW":
                        crudTab.setSize(this.getCrudviewSize());
                        crudTab.setActiveItem(1);
                        //if(gMain.getOpenCrudWindow() == true) {
                        crudTab.collapse();
                        //}
                        break;
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        //crudTab.expand();
                        break;
                    case "EDIT":
                    case "COPY":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                }
                this.fillEditForm(this.selected_records, this.crudMode);
            } else {
                switch(this.crudMode) {
                    case "CREATE":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                    case "VIEW":
                        crudTab.collapse();
                        break;
                    case "EDIT":
                    case "COPY":
                        crudTab.setSize(this.getCrudeditSize());
                        crudTab.setActiveItem(0);
                        crudTab.expand();
                        break;
                }
            }
        }
    },

    restorePo: function() {

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=restorePo',
            params:{
                rtgast_uid : gMain.selPanel.rec.id// rtgast_uid
            },
            success : function(result, request) {
                Ext.Msg.alert('알림','취소가 완료 되었습니다.');
                gm.me().storeLoad();
            },//endofsuccess

        });//endofajax
    },

    attachFileView: function() {
        var fieldPohistory = [
            { name: 'account_code', type: "string" },
            { name: 'account_name', type: "string" },
            { name: 'po_no', type: "string" },
            { name: 'po_date', type: "string" },
            { name: 'seller_code', type: "string" },
            { name: 'seller_name', type: "string" },
            { name: 'sales_price', type: "string" },
            { name: 'pr_qty', type: "string" }
        ];

        Ext.define('SrcCst', {
            extend: 'Ext.data.Model',
            fields: [{name: 'object_name', 	type: "string" },
                {name: 'file_path', 	type: "string" },
                {name: 'file_size', 	type: "string" }],
            proxy: {
                type: 'ajax',
                api: {
                    read: CONTEXT_PATH + '/rtgMgmt/routing.do?method=detailSrcCstPo',
                },
                reader: {
                    type: 'json',
                    root: 'datas',
                    totalProperty: 'count',
                    successProperty: 'success',
                    excelPath: 'excelPath'
                }
            }
        });

        var selections = gm.me().grid.getSelectionModel().getSelection();
        console_logs('===>attachFileView', selections);
        if(selections) {
            file_store = new Ext.data.Store({
                pageSize: getPageSize(),
                model: 'SrcCst',
                sorters: [{
                    property: 'unique_id',
                    direction: 'DESC'
                }]
            });
            var rec = gm.me().grid.getSelectionModel().getSelection()[0];
            var unique_id = selections[0].get('unique_id');
            file_store.getProxy().setExtraParam('rtg_uid',unique_id);
            file_store.load();

            var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );

            var fileGrid = Ext.create('Ext.grid.Panel', {
                title: '첨부',
                store: file_store,
                collapsible: true,
                multiSelect: true,
                selModel: selFilegrid,
                stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
                dockedItems: [{
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default2',
                    items: [
                        {
                            xtype: 'component',
                            id: gu.id('file_quan'),
                            style: 'margin-right:5px;width:100px;text-align:right',
                            html: '총수량 : 0'
                        }
                    ]
                }

                ],
                columns: [
                    {
                        text     : 'UID',
                        width     : 100,
                        sortable : true,
                        dataIndex: 'id'
                    },
                    {
                        text     : '파일명',
                        flex     : 1,
                        sortable : true,
                        dataIndex: 'object_name'
                    },
                    {
                        text     : '파일유형',
                        width     : 70,
                        sortable : true,
                        dataIndex: 'file_ext'
                    },
                    {
                        text     : '날짜',
                        width     : 160,
                        sortable : true,
                        dataIndex: 'create_date'
                    },
                    {
                        text     : 'size',
                        width     : 100,
                        sortable : true,
                        xtype: 'numbercolumn',
                        format: '0,000',
                        style: 'text-align:right',
                        align: 'right',
                        dataIndex: 'file_size'
                    }]
            });

            var prWin =	Ext.create('Ext.Window', {
                modal : true,
                title: '첨부파일',
                width: 1200,
                height: 600,
                items: [
                    fileGrid
                ],
                buttons: [
                    {text: CMD_OK,
                        //scope:this,
                        handler:function(){
                            if(prWin) {
                                prWin.close();
                            }
                        }
                    }
                ]
            })
            prWin.show();
        }
    },

    updatePrintYn: function(rtgast_uid) {
        console_logs('>>rtgast_uid', rtgast_uid);

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/prch.do?method=updatePoPrintYn',
            params:{
                unique_id : rtgast_uid
            },
            success : function(result, request) {
                gm.me().storeLoad();
            },//endofsuccess

        });//endofajax

    },

    buttonToolbar3 : Ext.create('widget.toolbar', {
        items: [{
            xtype: 'tbfill'
        },{
            xtype: 'label',
            style: 'color: #000000; font-weight: bold; font-size: 15px; margin: 5px; align: right',
            text: '총 금액 : 0 / 총 주문수량 : 0'
        }]
    }),
});

