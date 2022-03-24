//수주관리 메뉴
Ext.define('Rfx2.view.company.dabp01kr.designPlan.DgnRequestItemView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'dgn-request-item-view',
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

//        this.addSearchField ({
//            type: 'dateRange',
//            field_id: 'regist_date',
//            text: gm.getMC('CMD_Order_Date', '등록일자'),
//            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
//            edate: new Date()
//        });

        // var isnewStore = new Ext.data.SimpleStore({
        //     fields:['code_name_kr', 'system_code'],
        //     data: [
        //         ["설계완료", 'F'],
        //         ["설계요청", 'R']
        //     ]
        // });

        this.addSearchField({
            type:           'combo',
            field_id:		'is_new',
            displayField:   'codeName',
            valueField:     'systemCode',
            store: 			'IsNewStore',
            emptyText:      '설계상태',
            innerTpl: 		'<div data-qtip="{systemCode}">[{systemCode}] {codeName}</div>'    
        });
        // if(vCompanyReserved4 == 'KWLM01KR') {
        //     searchToolbar.insert(2,{
        //         type:           'combo',
        //         field_id:		'wa_name',
        //         displayField:   'wa_name',
        //         valueField:     'wa_name',
        //         store: 			DistinctWaName,
        //         emptyText:      '고객사',
        //         minChars: 1,
        //         typeAhead:true,
        //         queryMode: 'remote',
        //         editable:true,
        //         innerTpl: 		'<div data-qtip="{wa_name}">{wa_name}</div>'    
        //     });
        //     searchToolbar.insert(3,{
        //         type:           'combo',
        //         field_id:		'pj_name',
        //         displayField:   'pj_name',
        //         valueField:     'pj_name',
        //         store: 			DistinctPjName,
        //         emptyText:      '호선',
        //         minChars: 2,
        //         innerTpl: 		'<div data-qtip="{pj_name}">{pj_name}</div>'    
        //     });
        // } else {
        //     this.addSearchField('wa_name');
        //     this.addSearchField('pj_name');
        // }
        this.addSearchField('item_name');
        this.addSearchField('pj_code');
        this.addSearchField('area_code');//블록
        this.addSearchField('alter_item_code'); //설계번호
       
        //Function Callback 정의
        //redirect
        this.refreshActiveCrudPanel = function(source, selectOn, unique_id, record) {
            if(selectOn==true) {
                this.propertyPane.setSource(source); // Now load data
                this.selectedUid = unique_id;
                gUtil.enable(this.removeAction);
                gUtil.enable(this.editAction);
                gUtil.enable(this.copyAction);
                gUtil.enable(this.viewAction);
                gUtil.disable(this.registAction);

            } else {//not selected
                this.propertyPane.setSource(source);
                this.selectedUid = '-1';
                gUtil.disable(this.removeAction);
                gUtil.disable(this.editAction);
                gUtil.disable(this.copyAction);
                gUtil.disable(this.viewAction);
                gUtil.enable(this.registAction);
                this.crudTab.collapse();
            }

            console_logs('this.crudMode', this.crudMode);
            this.setActiveCrudPanel(this.crudMode);
        };

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();

        console_logs('searchToolbar', searchToolbar);

        var remove_buttons = [];
        var request_pos = 5;

        switch(vCompanyReserved4){
            case 'HSGC01KR':
                remove_buttons.push('EDIT', 'REGIST', 'COPY');
                request_pos = 3;
                break;
            case 'KWLM01KR':
                remove_buttons.push('REGIST', 'COPY', 'REMOVE');
                request_pos = 3;
                break;
            default:
                remove_buttons.push('COPY');
        }

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS :remove_buttons
        });

        console_logs('>>buttonToolbar', this.searchAction);

        switch(vCompanyReserved4){
            case "DDNG01KR":
                this.createStoreSimple({
                    modelClass: 'Rfx.model.HEAVY4RecvPoViewModel',
                    pageSize: 100,//gMain.pageSize,
                    sorters: [{
                        property: 'wa_name, assymap.unique_id',
                        direction: 'DESC'
                    }]

                }, {
                    groupField: 'wa_name'
                });
                break;

            case 'PNLC01KR':
                this.createStoreSimple({
                    modelClass: 'Rfx.model.HEAVY4RecvPoViewModel',
                    pageSize: 100,//gMain.pageSize,
                    sorters: [{
                        property: 'specification',//TAG NO
                        direction: 'asc'
                    }],
                    deleteClass: 'assymap'

                }, {
                    groupField: 'specification'
                });
                break;
            case 'DOOS01KR':
                var storeName = 'Rfx.model.HEAVY4RecvPoViewModel';
                if(this.link == 'SRO5_DS2' || this.link == 'SRO5_HSG2') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewTModel';
                } else if(this.link == 'SRO5_DS3') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewPModel';
                } else if(this.link == 'SRO5_DS4') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewEPModel';
                } else if(this.link == 'SRO5_DS6'  || this.link == 'SRO5_HSG3') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewDSModel';
                } else if(this.link == 'SRO5_DS7') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewDTModel';
                } else if(this.link == 'SRO5_DS8') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewESModel';
                }

                this.createStore(storeName, [{
                        property: 'reserved_integer1',
                        direction: 'asc',
                    }],
                    //gMain.pageSize
                    [100]  //pageSize
                    , this.sortBy
                    //삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                    , ['assymap']
                );
                break;
            case 'HSGC01KR':
                var storeName = 'Rfx.model.HEAVY4RecvPoViewModel';
                if(this.link == 'SRO5_DS2' || this.link == 'SRO5_HSG2') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewTModel';
                } else if(this.link == 'SRO5_DS3') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewPModel';
                } else if(this.link == 'SRO5_DS4') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewEPModel';
                } else if(this.link == 'SRO5_DS6'  || this.link == 'SRO5_HSG3') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewDSModel';
                } else if(this.link == 'SRO5_DS7') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewDTModel';
                } else if(this.link == 'SRO5_DS8' || this.link == 'SRO5_HSG4') {
                    storeName = 'Rfx.model.HEAVY4RecvPoViewESModel';
                }

                this.createStore(storeName, [{
                        property: 'unique_id',
                        direction: 'asc',
                    }],
                    //gMain.pageSize
                    [100]  //pageSize
                    , this.sortBy
                    //삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                    , ['assymap']
                );
                break;
            default:
                this.createStore('Rfx.model.HEAVY4RecvPoViewTModelGWLM', [{
                        property: 'can_produce',
                        direction: 'asc',
                    }],
                    //gMain.pageSize
                    [100]  //pageSize
                    , this.sortBy
                    //삭제테이블 지정. 지정하지 않으면 create_ep_id의 모든 테이블에 대하여 삭제를 시도한다.
                    , ['assymap']
                );

                break;
        }

        var DistinctWaName = Ext.create('Mplm.store.DistinctWaName',{});
        var DistinctPjName = Ext.create('Mplm.store.DistinctPjName',{});

        searchToolbar.insert(2,{
                xtype:           'combo',
                anchor: '100%',
                width:175,
                field_id:		'wa_name',
                displayField:   'wa_name',
                valueField:     'wa_name',
                store: 			DistinctWaName,
                emptyText:      '고객사',
                minChars: 1,
                // typeAhead:true,
                queryMode: 'remote',
                innerTpl: 		'<div data-qtip="{wa_name}">{wa_name}</div>',
                listeners: {
                        select: function(combo, record) {
                            var selected = combo.getValue();
                            gm.me().store.getProxy().setExtraParam('wa_name',selected);
                            DistinctPjName.getProxy().setExtraParam('query_level',selected);
                            DistinctPjName.load();
                    },
                        blur:function() {
                            if(this.getRawValue() == "" ) {
                                this.clearValue();
                                gm.me().store.getProxy().setExtraParam('wa_name',null);
                            }
                        }
                }
            });
            searchToolbar.insert(3,{
                xtype:           'combo',
                anchor: '100%',
                width:175,
                field_id:		'pj_name',
                displayField:   'pj_name',
                valueField:     'pj_name',
                store: 			DistinctPjName,
                emptyText:      '호선',
                minChars: 2,
                innerTpl: 		'<div data-qtip="{pj_name}">{pj_name}</div>',
                listeners: {
                        select: function(combo, record) {
                            var selected = combo.getValue();
                            gm.me().store.getProxy().setExtraParam('pj_name',selected);
                            DistinctPjName.getProxy().setExtraParam('query_level',null);
                    },
                        blur:function() {
                            if(this.getRawValue() == "" ) {
                                this.clearValue();
                                gm.me().store.getProxy().setExtraParam('pj_name',null);
                            }
                        }
                }
            });

        this.tabchangeHandler = function(tabPanel, newTab, oldTab, eOpts)  {
            //console_logs('tabpanel newTab', newTab);
            //console_logs('tabpanel newTab newTab.title', newTab.title);

            switch(newTab.title) {
                case '구매요청':
                    gMain.selPanel.refreshBladeInfoAll();
                    break;
//            case '공정설계':
//            	gMain.selPanel.refreshProcess();
//            	break;
            }


        };

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);
        arr.push(this.buttonToolbar3);

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
        /*for(var i=0; i< this.columns.length; i++) {
        	var o = this.columns[i];
        	//console_logs('this.columns' + i, o);
        }*/



        if(vCompanyReserved4 == 'HSGC01KR' && this.link == 'SRO5_HSG') {
            this.setRowClass(function(record, index) {

                var c = record.get('reserved20');

                switch(c) {
                    case 'Y':
                        return 'green-row';
                        break;
                    default:
                        break;
                }

            });
        }


        //grid 생성.
        switch(vCompanyReserved4){
            case "DDNG01KR":
                var option = {
                    features: [{
                        //id: 'group',
                        ftype: 'groupingsummary',
                        groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
                        hideGroupedHeader: true,
                        /*enableGroupingMenu: false*/
                    }]

                };
                this.createGridCore(arr, option);
                break;
            case "PNLC01KR":
                var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
                    /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
                    groupHeaderTpl: '<div><font color=#003471>{name} :: </font> ({rows.length} 항목)</div>'
                });
                var option = {
                    features: [groupingFeature]
                };
                this.createGridCore(arr, option);
                break;
                var option = {
                    features: [{
                        //id: 'group',
                        ftype: 'groupingsummary',
                        groupHeaderTpl: '<div><font color=#003471>{name}</font></div>',
                        hideGroupedHeader: true,
                        /*enableGroupingMenu: false*/
                    }]

                };
                this.createGridCore(arr, option);
                break;
            case "DOOS01KR":
                var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
                    /*groupHeaderTpl: '<div><font color=#003471>{name} :: <b>{[values.rows[0].data.pcs_name]} </b></font> ({rows.length} 공정)</div>'*/
                    groupHeaderTpl: '<div><font color=#003471>{can_produce} :: </font> ({rows.length} 항목)</div>'
                });
                var option = {
                    features: [groupingFeature]
                };
                this.createGridCore(arr, option);
                break;
            case "HSGC01KR":
                if (this.link == 'SRO5_HSG' || this.link == 'SRO5_HSG2') {
                    this.createGrid(searchToolbar, buttonToolbar, null,  [
                        {
                            locked: false,
                            arr: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
                        },
                        {
                            text: '수량',
                            locked: false,
                            arr: [14, 15]
                        },
                        {
                            locked: false,
                            arr: [16]
                        },
                        {
                            text: '중량',
                            locked: false,
                            arr: [17, 18]
                        },
                        {
                            locked: false,
                            arr: [19, 20]
                        },
                        {
                            text: '단가',
                            locked: false,
                            arr: [21, 22]
                        },
                        {
                            locked: false,
                            arr: [23, 24]
                        },
                        {
                            text: 'P/O금액',
                            locked: false,
                            arr: [25, 26]
                        },
                        {
                            locked: false,
                            arr: [27, 28, 29, 30, 31, 32, 33, 34]
                        },
                    ]);
                } else {
                    this.createGrid(searchToolbar, buttonToolbar);
                }
                break;
            case 'KWLM01KR':
                 var option = {
                     viewConfig: {
                        stripeRows: true,
                        markDirty:false,
                        enableTextSelection: true,
                        listeners: {
                            itemdblclick: this.setBom
                        }
                    }
                };
                this.createGrid(searchToolbar, buttonToolbar, option);
                break;
            default:
                this.createGrid(searchToolbar, buttonToolbar);
                break;
        }

        //this.createGridCore(arr, option);

        //this.createGrid(arr);

        var parent_code = this.link;

        // 첨부파일 확인 용도
        this.attachFileAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-retweet_14_0_5395c4_none',
            text: '파일 첨부',
            tooltip: '파일 첨부',
            disabled: true,
            handler: function() {

                gm.me().attachFile();
            } //handler end...

        });

        //주문번호 일괄 적용
        this.changePjCodesAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '주문번호 일괄수정',
            tooltip: '주문번호 일괄수정',
            disabled: true,
            handler: function() {
                gMain.selPanel.treatPjCodes();
            }
        });
        
        
        //작업지시 Action 생성
        this.requestDgnAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '설계 요청',
            tooltip: '설계 요청',
            disabled: true,
            handler: function() {
                var dng_uid = gMain.selPanel.SELECTED_UID;

                var selectedDngUid = [];
                var selectedUids = '';
            	var selections = gm.me().grid.getSelectionModel().getSelection();
            	if(selections) {
                   for(var i=0; i<selections.length; i++){
                       var rec = selections[i];
                       selectedDngUid.push(rec.get('id'));
                       selectedUids = selectedUids + (selectedUids ==''?'':',') + rec.get('id');
                   }
                }
                
                
                    Ext.MessageBox.show({
	                    title:'확인',
	                    msg: '설계요청 하시겠습니까?',
	                    buttons: Ext.MessageBox.YESNO,
	                    fn:  function(result) {
	                        if(result=='yes') {
	                            gm.me().doDgnRequest(selectedUids);
	                        }
	                    },
	                    //animateTarget: 'mb4',
	                    icon: Ext.MessageBox.QUESTION
	                });
	            }
            //endof handler
        });
        
        this.modifyPoAction = Ext.create('Ext.Action', {
        	glyph: 'xf00c@FontAwesome',
            text: '주문 생성',
            tooltip: '주문 생성',
            disabled: true,
            handler: function() {
            	
            }
        });

        //작업지시 Action 생성
        this.orderRequestAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '발주 요청',
            tooltip: '발주 요청',
            disabled: true,

            handler: function() {
                switch(parent_code) {
                    case "SRO5_DS":
                    case "SRO5_DS6":
                    case "SRO5_DS8":
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                        var not_registed = false;
                        var not_stocked = false;
                        var not_order_no = false;
                        var produce_msg = '발주 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';

                        for(var i = 0; i < selections.length; i++) {

                            var status = selections[i].get('can_produce');
                            var order_no = selections[i].get('pj_code');

                            switch(status) {
                                case '자재미입고':
                                    not_stocked = true;
                                    produce_msg = '미입고된 하위 자재가 있습니다.<br>그래도 발주 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';
                                    break;
                                case 'BOM미등록':
                                    not_registed = true;
                                    break;
                                default:
                                    break;
                            }
                        }

                        if (!not_registed /*&& !not_order_no*/) {
                            Ext.MessageBox.show({
                                title:'확인',
                                msg: produce_msg,
                                buttons: Ext.MessageBox.YESNO,
                                fn:  function(result) {
                                    if(result=='yes') {
                                        gMain.selPanel.doRequest('PRD');
                                    }
                                },
                                //animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }/* else if(not_order_no) {
						 Ext.MessageBox.alert('알림', '주문번호가 없는 자재가 존재합니다.');
					 }*/ else {
                            Ext.MessageBox.alert('알림', '하위 자재를 등록하지 않은 모자재가 존재합니다.');
                        }
                        break;
                    case "SRO5_DS2":
                    case "SRO5_DS3":
                    case "SRO5_DS4":
                    case "SRO5_DS7":
                    case "SRO5_DS9":
                    case 'SRO5_SEW':

                        var not_order_no = false;
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                        for(var k = 0; k < selections.length; k++) {
                            var order_no = selections[k].get('pj_code');

                            if(order_no.substr(0,2) == '미정') {
                                not_order_no = true;
                                produce_msg = '주문번호를 입력하시기 바랍니다.';
                                break;
                            }
                        }

                        console_logs('mesTplProcessBig',  gUtil.mesTplProcessBig);

                        var arr = [];

                        for(var i=1; i<gUtil.mesTplProcessBig.length; i++) {

                            var o = gUtil.mesTplProcessBig[i];
                            console_logs('o', o);

                            var pcsCode = o['code'];

                            isRightBigPcs = false;

                            if(parent_code == 'SRO5_DS2' || parent_code == 'SRO5_DS7') {
                                if(pcsCode == 'TPRD' || pcsCode == 'KPRD') isRightBigPcs = true;
                            } else {
                                if(pcsCode == 'NPNT' || pcsCode == 'GPNT') isRightBigPcs = true;
                            }

                            if(parent_code == 'SRO5_SEW') {
                                isRightBigPcs = true;
                            }

                            if(isRightBigPcs) {
                                console_logs('pcsCode=', pcsCode);
                                var o1 = gUtil.mesTplProcessAll;
                                console_logs('o1=', o1);
                                var subArr = o1[pcsCode];
                                console_logs('subArr=', subArr);

                                var pcsnames = ''
                                for(j=0; j<subArr.length; j++) {
                                    var o2 = subArr[j];

                                    if(pcsnames!='') {
                                        pcsnames = pcsnames + ' -> ';
                                    }
                                    pcsnames = pcsnames + o2['name'];
                                }

                                arr.push({

                                    inputValue: pcsCode,
                                    boxLabel: o['name'] + '  (' + pcsnames +')',
                                    name:'big_pcs_code',
                                    cls: 'font-gray',
                                    checked: (i==0)?true:false,
                                    listeners: {

                                    }
                                });
                            }
                        }

                        gm.me().requestform = Ext.create('Ext.form.Panel', {

                            xtype: 'form',
                            // title:'공정 선택',
                            frame: true ,
                            border: false,
                            bodyPadding: 10,
                            region: 'center',
                            layout: 'column',
                            layout: 'form',
                            fieldDefaults: {
                                labelAlign: 'right',
                                msgTarget: 'side'
                            },
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '발주 요청할 공정의 유형을 선택하세요.',

                                    items: [{
                                        xtype: 'radiogroup',
                                        bind:{
                                            value:'{switchItem}'
                                        },
                                        defaults: {
                                            name: 'big_pcs_code'
                                        },
                                        fieldLabel:'대공정',
                                        labelAlign:'top',
                                        columns:1,
                                        items: arr
                                    }, {
                                    xtype: 'combo',
                                    id: 'rush_order_flag',
                                    name : 'rush_order_flag',
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'EMERGENCY_CODE'}),
                                    displayField:   'code_name_kr',
                                    valueField:   'system_code',
                                    sortInfo: { field: 'code_order', direction: 'ASC' },
                                    typeAhead: false,
                                    hideLabel: true,
                                    emptyText: '긴급여부(기본값 일반)',
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            var system_code = record.get('system_code');
                                            Ext.getCmp('rush_order_flag').setValue(system_code);
                                        },
                                        afterrender: function(t,o) {
                                            t.value = t.store.data.items;   
                                            console_logs('===>cas', t);
                                            // Ext.getCmp('rush_order_flag').setValue(t.value);
                                        }
                                    }
                                }, {
                                    xtype: 'combo',
                                    id: 'reserved_number2',  // 사업부
                                    name : 'reserved_number2',
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    store: Ext.create('Mplm.store.DivisionStore2', {}),
                                    displayField:   'wa_name',
                                    valueField:   'unique_id',
                                    sortInfo: { field: 'sort_seq', direction: 'ASC' },
                                    typeAhead: false,
                                    hideLabel: true,
                                    emptyText: '사업부(기본값 본사)',
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{unique_id}">{wa_name}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        afterrender: function(t,o) {
                                            t.value = t.store.data.items;   
                                            Ext.getCmp('reserved_number2').setValue(t.value);
                                        }
                                    }
                                }]
                                }]
                        });

                        var myRqsWidth = 500;
                        var myRqstHeight = 500;
                        if(vCompanyReserved4 ==  'KWLM01KR') {
                            myRqsWidth = 600;
                            myRqstHeight = 400;
                        }
                        var prWin =	Ext.create('Ext.Window', {
                            modal : true,
                            title: '발주요청',
                            width: myRqsWidth,
                            height: myRqstHeight,
                            items: gm.me().requestform,

                            buttons: [
                                {text: CMD_OK,
                                    //scope:this,
                                    handler:function(){

                                    	console_logs('==== form value gm', gm);
                                        var form = gm.me().requestform.getForm();

                                        console_logs('=== form value', form.getValues());
                                        
                                        console_logs('form value gMain', gMain);
                                        console_logs('form value gMain.selPanel', gMain.selPanel);

                                        var o = form.getValues();
                                        var big_pcs_code = o['big_pcs_code'];
                                        var arr = [];
                                        arr.push(big_pcs_code);
                                        gMain.selPanel.doRequest(arr, prWin);

                                        /*if(prWin){
                                            prWin.close();
                                        }*/

                                    }},

                                {text: CMD_CANCEL,
                                    scope:this,
                                    handler:function(){
                                        if(prWin){
                                            prWin.close();
                                        }
                                    }}
                            ]
                        });

                        if(not_order_no) {
                            Ext.MessageBox.alert('알림', '주문번호가 없는 자재가 존재합니다.</br>주문번호를 입력하시고, 발주 요청을 하시기 바랍니다.');
                        } else {
                            prWin.show();
                        }

                        break;

                    case "SRO5_HSG":
                    case "SRO5_HSG2":
                    case "SRO5_HSG3":
                    case "SRO5_HSG4":
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                        var produce_msg = '생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';

                        Ext.MessageBox.show({
                            title:'확인',
                            msg: produce_msg,
                            buttons: Ext.MessageBox.YESNO,
                            fn:  function(result) {
                                if(result=='yes') {
                                    if(parent_code == 'SRO5_HSG' || parent_code == 'SRO5_HSG3'  || parent_code == 'SRO5_HSG4') {
                                        gMain.selPanel.doRequest('ASB');
                                    } else {
                                        gMain.selPanel.doRequest('STE');
                                    }
                                }
                            },
                            //animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                        break;
                }

            }
        });

        //작업지시 Action 생성
        this.requestAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '생산 요청',
            tooltip: '생산 요청',
            disabled: true,

            handler: function() {
                switch(parent_code) {
                    /*
                                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                                        var produce_msg = '생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';
                                        Ext.MessageBox.show({
                                            title:'확인',
                                            msg: produce_msg,
                                            buttons: Ext.MessageBox.YESNO,
                                            fn:  function(result) {
                                                if(result=='yes') {
                                                    gMain.selPanel.doRequest('PRD');
                                                }
                                            },
                                            //animateTarget: 'mb4',
                                            icon: Ext.MessageBox.QUESTION
                                        });
                                        break;*/
                    case "SRO5_DS":
                    case "SRO5_DS6":
                    case "SRO5_DS8":
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                        var not_registed = false;
                        var not_stocked = false;
                        var not_order_no = false;
                        var produce_msg = '생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';

                        for(var i = 0; i < selections.length; i++) {

                            var status = selections[i].get('can_produce');
                            var order_no = selections[i].get('pj_code');

                            /*if(order_no.substr(0,2) == '미정') {
                                not_order_no = true;
                                produce_msg = '주문번호를 입력하시기 바랍니다.';
                                break;
                            }*/

                            switch(status) {
                                case '자재미입고':
                                    not_stocked = true;
                                    produce_msg = '미입고된 하위 자재가 있습니다.<br>그래도 생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';
                                    break;
                                case 'BOM미등록':
                                    not_registed = true;
                                    break;
                                default:
                                    break;
                            }
                        }

                        if (!not_registed /*&& !not_order_no*/) {
                            Ext.MessageBox.show({
                                title:'확인',
                                msg: produce_msg,
                                buttons: Ext.MessageBox.YESNO,
                                fn:  function(result) {
                                    if(result=='yes') {
                                        gMain.selPanel.doRequest('PRD');
                                    }
                                },
                                //animateTarget: 'mb4',
                                icon: Ext.MessageBox.QUESTION
                            });
                        }/* else if(not_order_no) {
						 Ext.MessageBox.alert('알림', '주문번호가 없는 자재가 존재합니다.');
					 }*/ else {
                            Ext.MessageBox.alert('알림', '하위 자재를 등록하지 않은 모자재가 존재합니다.');
                        }
                        break;
                    case "SRO5_DS2":
                    case "SRO5_DS3":
                    case "SRO5_DS4":
                    case "SRO5_DS7":
                    case "SRO5_DS9":
                    case 'SRO5_SEW':

                        var not_order_no = false;
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();

                        for(var k = 0; k < selections.length; k++) {
                            var order_no = selections[k].get('pj_code');

                            if(order_no.substr(0,2) == '미정') {
                                not_order_no = true;
                                produce_msg = '주문번호를 입력하시기 바랍니다.';
                                break;
                            }
                        }

                        console_logs('mesTplProcessBig',  gUtil.mesTplProcessBig);

                        var arr = [];

                        for(var i=1; i<gUtil.mesTplProcessBig.length; i++) {

                            var o = gUtil.mesTplProcessBig[i];
                            console_logs('o', o);

                            var pcsCode = o['code'];

                            isRightBigPcs = false;

                            if(parent_code == 'SRO5_DS2' || parent_code == 'SRO5_DS7') {
                                if(pcsCode == 'TPRD' || pcsCode == 'KPRD') isRightBigPcs = true;
                            } else {
                                if(pcsCode == 'NPNT' || pcsCode == 'GPNT') isRightBigPcs = true;
                            }

                            if(parent_code == 'SRO5_SEW') {
                                isRightBigPcs = true;
                            }

                            if(isRightBigPcs) {
                                console_logs('pcsCode=', pcsCode);
                                var o1 = gUtil.mesTplProcessAll;
                                console_logs('o1=', o1);
                                var subArr = o1[pcsCode];
                                console_logs('subArr=', subArr);

                                var pcsnames = ''
                                for(j=0; j<subArr.length; j++) {
                                    var o2 = subArr[j];

                                    if(pcsnames!='') {
                                        pcsnames = pcsnames + ' -> ';
                                    }
                                    pcsnames = pcsnames + o2['name'];
                                }

                                arr.push({

                                    inputValue: pcsCode,
                                    boxLabel: o['name'] + '  (' + pcsnames +')',
                                    name:'big_pcs_code',
                                    cls: 'font-gray',
                                    checked: (i==0)?true:false,
                                    listeners: {

                                    }
                                });
                            }
                        }

                        gm.me().requestform = Ext.create('Ext.form.Panel', {

                            xtype: 'form',
                            // title:'공정 선택',
                            frame: true ,
                            border: false,
                            bodyPadding: 10,
                            region: 'center',
                            layout: 'column',
                            layout: 'form',
                            fieldDefaults: {
                                labelAlign: 'right',
                                msgTarget: 'side'
                            },
                            items: [
                                {
                                    xtype: 'fieldset',
                                    title: '생산할 공정의 유형을 선택하세요.',

                                    items: [{
                                        xtype: 'radiogroup',
                                        bind:{
                                            value:'{switchItem}'
                                        },
                                        defaults: {
                                            name: 'big_pcs_code'
                                        },
                                        fieldLabel:'대공정',
                                        labelAlign:'top',
                                        columns:1,
                                        items: arr
                                    }, {
                                    xtype: 'combo',
                                    id: 'rush_order_flag',
                                    name : 'rush_order_flag',
                                    fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                                    store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'EMERGENCY_CODE'}),
                                    displayField:   'code_name_kr',
                                    valueField:   'system_code',
                                    sortInfo: { field: 'code_name_kr', direction: 'ASC' },
                                    typeAhead: false,
                                    hideLabel: true,
                                    emptyText: '긴급여부(기본값 일반)',
                                    listConfig:{
                                        loadingText: 'Searching...',
                                        emptyText: 'No matching posts found.',
                                        getInnerTpl: function() {
                                            return '<div data-qtip="{system_code}">{code_name_kr}</div>';
                                        }			                	
                                    },
                                    listeners: {
                                        select: function(combo, record) {
                                            console_logs('=>1', combo);
                                            console_logs('=>2', record);

                                            var system_code = record.get('system_code');

                                            Ext.getCmp('rush_order_flag').setValue(system_code);
                                        }
                                    }
                                }]
                                }]
                        });

                        var myRqsWidth = 500;
                        var myRqstHeight = 500;
                        if(vCompanyReserved4 ==  'KWLM01KR') {
                            myRqsWidth = 600;
                            myRqstHeight = 400;
                        }
                        var prWin =	Ext.create('Ext.Window', {
                            modal : true,
                            title: '생산요청',
                            width: myRqsWidth,
                            height: myRqstHeight,
                            items: gm.me().requestform,

                            buttons: [
                                {text: CMD_OK,
                                    //scope:this,
                                    handler:function(){

                                    	console_logs('==== form value gm', gm);
                                        var form = gm.me().requestform.getForm();

                                        console_logs('=== form value', form.getValues());
                                        
                                        console_logs('form value gMain', gMain);
                                        console_logs('form value gMain.selPanel', gMain.selPanel);

                                        var o = form.getValues();
                                        var big_pcs_code = o['big_pcs_code'];
                                        var arr = [];
                                        arr.push(big_pcs_code);
                                        gMain.selPanel.doRequest(arr, prWin);

                                        /*if(prWin){
                                            prWin.close();
                                        }*/

                                    }},

                                {text: CMD_CANCEL,
                                    scope:this,
                                    handler:function(){
                                        if(prWin){
                                            prWin.close();
                                        }
                                    }}
                            ]
                        });

                        if(not_order_no) {
                            Ext.MessageBox.alert('알림', '주문번호가 없는 자재가 존재합니다.</br>주문번호를 입력하시고, 생산요청을 하시기 바랍니다.');
                        } else {
                            prWin.show();
                        }

                        break;

                    case "SRO5_HSG":
                    case "SRO5_HSG2":
                    case "SRO5_HSG3":
                    case "SRO5_HSG4":
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                        var produce_msg = '생산 요청 하시겠습니까?<br>이 작업은 취소할 수 없습니다.';

                        Ext.MessageBox.show({
                            title:'확인',
                            msg: produce_msg,
                            buttons: Ext.MessageBox.YESNO,
                            fn:  function(result) {
                                if(result=='yes') {
                                    if(parent_code == 'SRO5_HSG' || parent_code == 'SRO5_HSG3'  || parent_code == 'SRO5_HSG4') {
                                        gMain.selPanel.doRequest('ASB');
                                    } else {
                                        gMain.selPanel.doRequest('STE');
                                    }
                                }
                            },
                            //animateTarget: 'mb4',
                            icon: Ext.MessageBox.QUESTION
                        });
                        break;
                }

            }
        });

        //제작생산요청 Action 생성 --신화용
        this.requestProduceAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '제작생산요청',
            tooltip: '제작생산요청',
            disabled: true,

            handler: function() {

                gMain.selPanel.pcstype = 'D';
                gMain.selPanel.reserved_varchar3 = 'PRD';
                gMain.selPanel.doRequestProduce();

            }
        });

        //도장작업지시 Action 생성 --신화용
        this.requestPaintAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '도장생산요청',
            tooltip: '도장생산요청',
            disabled: true,

            handler: function() {
                gMain.selPanel.pcstype = 'P';
                gMain.selPanel.reserved_varchar3 = 'PNT';
                gMain.selPanel.doRequestProduce();
                //gMain.selPanel.doRequest();


            }
        });

        //moldid Action 생성
        this.moldidAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '물성 입력',
            tooltip: '물성 입력',
            disabled: true,

            handler: function() {
                gMain.selPanel.moldidInput();
            }
        });

        //group Action 생성
        this.minLotAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: '소그룹구성',
            tooltip: '소그룹구성',
            disabled: true,

            handler: function() {

                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/index/process.do?method=bringdrawingnum',
                    params:{
                    },
                    success : function(response, request) {
                        var rec = Ext.JSON.decode(response.responseText);

                        //console_logs('maxnumber>>>>>>>>>>>>>', rec);
                        //Ext.getCmp('alter_item_code').setValue(rec);
                        //gMain.selPanel.maxnum = rec.get('datas');
                        gMain.selPanel.maxnum = rec['datas'];
                        //console_logs('gMain.selPanel.maxnum>>>>>>>>>>>>>', gMain.selPanel.maxnum);
                        gMain.selPanel.mingroupInput();
                    },
                    failure: function(val, action){
                        alert('ajax실패');
                    }
                });


            }
        });
        //버튼 추가.
        switch(vCompanyReserved4) {
            case 'DOOS01KR':
                switch(this.link) {
                    case 'SRO5_DS6':
                    case 'SRO5_DS7':
                    case 'SR05_DS9':
                        //buttonToolbar.insert(5, this.changePjCodesAction);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

//        buttonToolbar.insert(request_pos, this.requestAction);
//        buttonToolbar.insert(request_pos, '-');
        
        switch(vCompanyReserved4) {
        case 'KWLM01KR':
//            buttonToolbar.insert(request_pos, this.requestDgnAction);
//            buttonToolbar.insert(request_pos, '-');
//            buttonToolbar.insert(request_pos, this.changePjCodesAction);
//            buttonToolbar.insert(request_pos, '-');
//            buttonToolbar.insert(9, this.orderRequestAction);
//            buttonToolbar.insert(9, '-');
            buttonToolbar.insert(2, this.purchase_requestAction);
            buttonToolbar.insert(3, '-');
            buttonToolbar.insert(4, this.delete_requestAction);
            buttonToolbar.insert(5, this.attachFileAction);
            break;
        default:
    }
        
        

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            console_logs('selections', selections);
            if (selections.length) {
                var rec = selections[0];
                console_logs('selections.length', selections.length);
                gUtil.enable(gMain.selPanel.removeAction);
                gUtil.enable(gMain.selPanel.editAction);
                gUtil.enable(gMain.selPanel.requestAction);
                gUtil.enable(gMain.selPanel.orderRequestAction);
                gUtil.enable(gMain.selPanel.requestDgnAction);
                gUtil.enable(gMain.selPanel.modifyPoAction);
                this.purchase_requestAction.enable();
                this.delete_requestAction.enable();
                
                gUtil.enable(gMain.selPanel.changePjCodesAction);
                gUtil.enable(gMain.selPanel.moldidAction);
                gUtil.enable(gMain.selPanel.minLotAction);
                gUtil.enable(gMain.selPanel.requestProduceAction);
                gUtil.enable(gMain.selPanel.requestPaintAction);

                gMain.selPanel.vSELECTED_AC_UID = rec.get('ac_uid');
                gMain.selPanel.vSELECTED_PJ_CODE = rec.get('pj_code');
                gMain.selPanel.vSELECTED_PJ_CODE = gUtil.stripHighlight(gMain.selPanel.vSELECTED_PJ_CODE);
                var ac_uid = gMain.selPanel.vSELECTED_AC_UID;
                gMain.selPanel.pj_code = gMain.selPanel.vSELECTED_PJ_CODE+"-" ;
                var str = rec.get('h_reserved44');
                var o = str.substring(str.length-3, str.length-2);
                if(o<4){
                    gMain.selPanel.vSELECTED_ACTIVITY = "선행";
                }else{
                    gMain.selPanel.vSELECTED_ACTIVITY = "후행";
                }
                console_logs('activite', gMain.selPanel.vSELECTED_ACTIVITY);

                var total_mass = 0.0;
                var total_quan = 0;

                for(var k = 0; k < selections.length; k++) {
                    total_mass += selections[k].get('mass');
                    total_quan += selections[k].get('quan');
                }

                this.buttonToolbar3.items.items[0].update('▶ 선택한 자재의 총중량 : ' +  total_mass.toFixed(2) +
                    'kg / 선택한 자재의 총수량 : ' + total_quan);

            } else {
                gUtil.disable(gMain.selPanel.removeAction);
                gUtil.disable(gMain.selPanel.editAction);
                gUtil.disable(gMain.selPanel.requestAction);
                gUtil.disable(gMain.selPanel.orderRequestAction);
                gUtil.disable(gMain.selPanel.requestDgnAction);
                gUtil.disable(gMain.selPanel.modifyPoAction);
                this.purchase_requestAction.disable();
                this.delete_requestAction.disable();
                
                gUtil.disable(gMain.selPanel.changePjCodesAction);
                gUtil.disable(gMain.selPanel.moldidAction);
                gUtil.disable(gMain.selPanel.minLotAction);
                gUtil.disable(gMain.selPanel.requestProduceAction);
                gUtil.disable(gMain.selPanel.requestPaintAction);
                this.buttonToolbar3.items.items[0].update('자재를 선택하시면 선택한 자재의 수량 및 중량을 확인할 수 있습니다.');
            }

        });

        this.grid.getSelectionModel().on({
            selectionchange:function(sm, selections) {
                if(selections!=null && selections.length>0) {
                    gm.me().attachFileAction.enable();
                } else {
                    gm.me().attachFileAction.disable();
                }
            }

        });

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

        switch(this.link){
            case "SRO5_DGN":
                this.store.getProxy().setExtraParam('is_new',  'R');
                this.store.getProxy().setExtraParam('menuCode',  'SRO5_DGN');
                break;
            case "SRO5_DS" :
            case "SRO5_HSG" :
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('order_com_unique', 79070000002);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'S');
                break;
            case "SRO5_DS2" :
            case "SRO5_HSG2":
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('order_com_unique', 79070000002);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'T');
                break;
            case "SRO5_DS3" :
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('order_com_unique', 79070000002);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'TP');
                break;
            case "SRO5_DS4" :
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'EP');
                break;
            case "SRO5_DS6" :
            case "SRO5_HSG3":
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'DS');
                break;
            case "SRO5_DS7" :
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'DT');
                break;
            case "SRO5_DS8" :
            case "SRO5_HSG4":
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'ES');
                break;
            case "SRO5_DS9" :
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('status', "BM");
                this.store.getProxy().setExtraParam('pj_type', 'DP');
                break;
            case "SRO5_SEW" :
                this.store.getProxy().setExtraParam('parentCode',  this.link);
                this.store.getProxy().setExtraParam('status', "BM");
                //this.store.getProxy().setExtraParam('pj_type', 'DP');
                break;
            default :
                this.store.getProxy().setExtraParam('order_com_unique',  -1);
                break;
        }

        switch(vCompanyReserved4) {
            case 'KWLM01KR':
                console_logs('KWLM01KR standard_flag', 'A');
                this.store.getProxy().setExtraParam('standard_flag',  'A');
                break;
            case 'HSGC01KR':
                this.store.getProxy().setExtraParam('hsg_flag', 'Y');
                break;
            default:
        }

        //디폴트 로드
        gMain.setCenterLoading(false);
        this.storeLoad();
    },



    selectPcsRecord: null,
    items : [],
    pj_code: null,
//    assymap_uids : [],
    computeProduceQty: function(cur) {
        //console_logs('computeProduceQty cur', cur);
        var target_stock_qty_useful = this.getInputTarget('stock_qty_useful');
        var target_bm_quan = this.getInputTarget('bm_quan');

        var val = cur - target_stock_qty_useful.getValue();
        if(val<0) {
            val = 0;
        }
        target_bm_quan.setValue(val);
    },

    refreshBladeInfo: function() {
        var val = gMain.getBladeInfo();
        var target = this.getInputTarget('blade_size_info');
        target.setValue(val);
    },

    refreshBladeInfoAll: function() {
        var val1 = gMain.getBladeInfoAll();
        var target1 = this.getInputTarget('blade_size_info1');
        target1.setValue(val1);
    },
    //원지/원단 수량 설정
    refreshBmquan: function(cur) {
        var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
        target_bm_quan1.setValue(cur);

        var target_bm_quan2 = this.getInputTarget('bm_quan', '2');
        target_bm_quan2.setValue(cur);
    },
    refreshProcess: function() {

        var target_bm_quan = this.getInputTarget('bm_quan');
        var bm_quan = target_bm_quan.getValue();

        var o = Ext.getCmp(	this.link + '-'+ 'grid-top-spoQty' ).setText('생산수량: ' + bm_quan);


//		var target_bm_quan1 = this.getInputTarget('bm_quan', '1');
//		var bm_quan1 = target_bm_quan1.getValue();
//		Ext.getCmp(	this.link + '-'+ 'grid-top-paperQty' ).setText('원지수량: ' + bm_quan1);


        var val = gMain.getBladeInfo();
        Ext.getCmp(	this.link + '-'+ 'grid-top-bladeinfo' ).setText(val);


    },


    doDgnRequest: function(selectedUids) {
        var dng_uids = selectedUids;
        console_logs('=>>dng_uids', dng_uids);
        
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=updateDgnPlan',
            params: {
                assy_uids : dng_uids
            },
            success : function(result, request) {
                gMain.selPanel.store.load();
                Ext.Msg.alert('안내', '설계 요청하였습니다.', function() {});
                // prWin.close();
                
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax
    },

    //생산요청.
    doRequest: function(big_pcs_codes/*string array*/, prWin/*현재 사용은 안함.*/) {

        if(big_pcs_codes==null) {
        	alert('cannot be null');
        	return;
        }
        
        
        var arr = null;
        
        if (Ext.isArray(big_pcs_codes)) {
        	arr = big_pcs_codes;
        } else {
        	arr = [];
        	arr.push(big_pcs_codes);
        }
        

    	
    	var assymap_uids = [];
        var selections = this.grid.getSelectionModel().getSelection();
        for(var i=0; i< selections.length; i++) {
            var rec = selections[i];
            var uid =  rec.get('unique_id');
            assymap_uids.push(uid);
        }

        var parent_code = this.link;
        
//     	var big_pcs_codes = [];
//     	for(var name in o) {
//     		big_pcs_codes.push(o[name]);
//
//    	}
//    	for(var i = 0; i < Object.keys(o).length; i++) {
//    		 big_pcs_codes.push(Object.keys('big_pcs_code')[i]);
//    	}


//    	switch(parent_code) {
//    	case "SRO5_DS":
//    		big_pcs_code = "PRD";
//    		big_pcs_codes = [];
//    		break;
//    	case "SRO5_DS2":
//    		big_pcs_code = "";
//    		big_pcs_codes = ['TPRD', 'PNT', 'APKG'];
//    		break;
//    	}

        var rush_order_flag = null;
        var reserved_number2 = null;

        switch(vCompanyReserved4) {
            case 'KWLM01KR':
                rush_order_flag = Ext.getCmp('rush_order_flag').getValue(); // 긴급여부
                if(rush_order_flag == null || rush_order_flag == undefined) {
                    rush_order_flag = 'GE'  // 광림 긴급여부 일반
                }
                break;
            default:
                break;
        }
        
        var myWin = prWin;
        gm.me().setLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/index/process.do?method=addRequestHeavy',
            method: 'POST',
            params: {
                assymap_uids: assymap_uids,
                parent_code: parent_code,
                big_pcs_codes: arr,
                rush_order_flag: rush_order_flag ,
                reserved_number2: reserved_number2
            },

            success : function(result, request) {
                gm.me().store.load(function(records) {
                    Ext.Msg.alert('안내', '생산 요청 요청하였습니다.', function() {});
                    gm.me().setLoading(false);
                    console_logs('gm.me().store.load records', records);

                    if(myWin!=null){
                        myWin.close();
                    }



                });
                //this.reload();
            },//endofsuccess

            failure: extjsUtil.failureMessage
        });//endofajax

    },

    //제작생산요청 - 신화
    doRequestProduce: function() {

        var assymap_uids = [];
        var selections = this.grid.getSelectionModel().getSelection();
        for(var i=0; i< selections.length; i++) {
            var rec = selections[i];
            var uid =  rec.get('unique_id');
            assymap_uids.push(uid);
        }

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
                                    id : 'po_no',
                                    name      : 'po_no',
                                    fieldLabel: 'LOT 명',
                                    margin: '0 5 0 0',
                                    width: 300,
                                    allowBlank: false,
                                    value : gMain.selPanel.lotname,
                                    maxlength: '1',
                                    emptyText: '영문대문자와 숫자만 입력',
                                    validator: function(v) {
                                        if (/[^A-Z0-9_-]/g.test(v)) {
                                            v = v.replace(/[^A-Z0-9_-]/g,'');
                                        }
                                        /* if(/^[ㄱ-ㅎ|가-힣\ ]/g.test(v)){
                                             console_logs('입력 제한 >>>>', v);
                                             v = v.replace(/^[ㄱ-ㅎ|가-힣\ ]/g,'');
                                         }*/
                                        this.setValue(v);
                                        return true;
                                    }
                                },
                                {
                                    id: 'dupCheckButton',
                                    xtype:'button',
                                    style: 'margin-left: 3px;',
                                    width : 50,
                                    text: '중복'+CMD_CONFIRM,
                                    //style : "width : 50px;",
                                    handler : function(){

                                        var po_no = Ext.getCmp('po_no').getValue();

                                        //중복 코드 체크
                                        Ext.Ajax.request({
                                            url: CONTEXT_PATH + '/index/process.do?method=checkName',
                                            params:{
                                                po_no : po_no
                                            },

                                            success : function(result, request) {
                                                var resultText = result.responseText;
                                                if(resultText=='0') {
                                                    Ext.MessageBox.alert('정상', '사용가능합니다.');
                                                    gMain.selPanel.checkname = true;
                                                    //alert('사용가능합니다.');
                                                }else {
                                                    Ext.MessageBox.alert('사용불가', '이미 사용중인 코드입니다.');
                                                    //alert('코드를 확인하세요.');
                                                }

                                                console_log('resultText', gMain.selPanel.checkname);

                                            },//Ajax success
                                            failure: extjsUtil.failureMessage
                                        });



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


        prwin = gMain.selPanel.prwinrequest(form);



    },

    prwinrequest: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: 'LOT 명',
            width: myWidth,

            //height: myHeight,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){
                    //console_logs('중복 확인>>>>>>',gMain.selPanel.checkname);
                    if(gMain.selPanel.checkname == false){
                        Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
                    }else{
                        var form = gu.getCmp('formPanel').getForm();
                        var assymap_uids =[];
                        var po_quan = 0;
                        var reserved_double4 = 0;
                        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                        for(var i=0; i< selections.length; i++) {
                            var rec = selections[i];
                            console_logs('rec', rec);
                            var uid =  rec.get('id');  //assymap unique_id
                            console_logs('uid', uid);
                            assymap_uids.push(uid);
                            var po_quan_unit = rec.get('bm_quan');  //BOM 수량

                            console_logs('unit 수량', po_quan_unit);
                            po_quan = po_quan + po_quan_unit;
                            console_logs('po_quan 수량', po_quan);
                            var tmp_weight = rec.get('reserved_double1');   //  BOM 중량
                            reserved_double4 = reserved_double4 + tmp_weight;
                            console_logs('중량', reserved_double4);
                        }
                        console_logs('assymap_uids', assymap_uids);
                        //var cartmaparr = gMain.selPanel.cartmap_uids;
                        var ac_uid = gMain.selPanel.vSELECTED_AC_UID;

                        form.submit({
                            url : CONTEXT_PATH + '/index/process.do?method=addPrdPntLotHeavy',
                            params:{
                                assymap_uids: assymap_uids,
                                ac_uid: ac_uid,
                                pcsType : gMain.selPanel.pcstype,
                                reserved_varchar3 : gMain.selPanel.reserved_varchar3,
                                po_quan: po_quan,
                                reserved_double4 : reserved_double4
                            },
                            success: function(val, action){
                                prWin.close();

                                gMain.selPanel.store.load(function(){});
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
    //도장생산요청 - 신화
    /* doRequestPaint: function() {

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
                 assymap_uids: assymap_uids
             },

             success : function(result, request) {
                 gMain.selPanel.store.load();
                 Ext.Msg.alert('안내', '요청하였습니다.', function() {});

             },//endofsuccess

             failure: extjsUtil.failureMessage
         });//endofajax

     },*/

    savePcsstdHandler: function() {
        var gridPcsStd = Ext.getCmp('recvPoPcsGrid');
        //console_logs('gridPcsStd', gridPcsStd);

        var modifiend =[];

        var target_bm_quan = gMain.selPanel.getInputTarget('bm_quan', '1');

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
                gridPcsStd.store.getProxy().setExtraParam('unique_id', gMain.selPanel.vSELECTED_UNIQUE_ID);
                console_log(record);
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
                    srcahd_uid:gMain.selPanel.vSELECTED_UNIQUE_ID
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

    moldidInput: function(){
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
                margins: 10,
            },
            items   : [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items   : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '도장외부스펙1',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'textfield',
                                    id : 'reserved1',
                                    name      : 'reserved1',
                                    margin: '0 5 0 0',
                                    width: 150,
                                    allowBlank: false
                                }

                            ]
                        }/*,{
	                           xtype: 'fieldcontainer',
	                           fieldLabel: '제작메모2',
	                           combineErrors: true,
	                           msgTarget : 'side',
	                           layout: 'hbox',
	                           defaults: {
	                               flex: 1,
	                               hideLabel: true
	                           },
	                           items: [
	                               {
	                                   xtype     : 'textfield',
	                                   id : 'h_reserved9',
	                                   name      : 'h_reserved9',
	                                   margin: '0 5 0 0',
	                                   width: 150,
	                                   allowBlank: false
	                               }
	                              
	                           ]
	                       }*/


                    ]
                }
            ]

        });//Panel end...
        myHeight = 120;
        myWidth = 390;


        prwin = gMain.selPanel.prwinopen(form);

    },
    prwinopen: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: 'Information Insert',
            width: myWidth,

            //height: myHeight,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){
                    var form = gu.getCmp('formPanel').getForm();
                    var assymap_uids = [];
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('unique_id');
                        assymap_uids.push(uid);
                    }

                    form.submit({
                        url : CONTEXT_PATH + '/index/process.do?method=updatePntspec',
                        params:{
                            assymap_uids: assymap_uids
                        },
                        success: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                        }
                    });


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

    //소그룹 입력 폼
    mingroupInput: function(rec){
        var form_ = null;
        //var checkname = false;
        console_logs('from rec>>>>>>>>>', rec);
        form = Ext.create('Ext.form.Panel', {
            id: 'formPanelMini',
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
                margins: 10,
            },
            items   : [
                {
                    xtype: 'fieldset',
                    title: '소그룹 속성 입력',
                    collapsible: true,
                    defaults: {
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items   : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '소그룹명',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'textfield',
                                    id : 'item_code',
                                    name      : 'item_code',
                                    margin: '0 5 0 0',
                                    //width: 250,
                                    allowBlank: false,
                                    value : gMain.selPanel.pj_code
                                },{
                                    xtype     : 'button',
                                    id : 'itemcodeChk',
                                    name      : 'itemcodeChk',
                                    margin: '0 5 0 0',
                                    text : '중복'+CMD_CONFIRM,
                                    //width: 150,
                                    allowBlank: false,
                                    handler : function(){
                                        alert('중복 확인 하기');
                                    }
                                }

                            ]
                        },{
                            xtype: 'fieldcontainer',
                            fieldLabel: '제작완료요청일',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'datefield',
                                    id : 'reserved7',
                                    name      : 'reserved7',
                                    margin: '0 5 0 0',
                                    width: 150,
                                    allowBlank: false,
                                    format: 'Y-m-d',
                                    submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
                                    dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
                                }

                            ]
                        },{
                            xtype: 'fieldcontainer',
                            fieldLabel: '후공정',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'combo',
                                    id : 'description',
                                    name      : 'description',
                                    mode: 'local',
                                    store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'POST_PROCESS'}),
                                    displayField:   'code_name_kr',
                                    value: '도장',
                                    //sortInfo: { field: 'create_date', direction: 'DESC' },
                                    margin: '0 5 0 0',
                                    width: 150,
                                    allowBlank: false
                                }

                            ]
                        },{
                            xtype: 'fieldcontainer',
                            fieldLabel: '특기사항',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'combo',
                                    id : 'comment',
                                    name      : 'comment',
                                    mode: 'local',
                                    store: Ext.create('Mplm.store.CommonCodeStore', {parentCode: 'PRE_POST_WORK'}),
                                    value: gMain.selPanel.vSELECTED_ACTIVITY,
                                    displayField:   'code_name_kr',

                                    margin: '0 5 0 0',
                                    width: 150,
                                    allowBlank: false
                                }

                            ]
                        },{
                            xtype: 'fieldcontainer',
                            fieldLabel: '전달사항',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'textfield',
                                    id : 'request_comment',
                                    name      : 'request_comment',
                                    margin: '0 5 0 0',
                                    width: 150

                                }

                            ]
                        },{
                            xtype: 'fieldcontainer',
                            fieldLabel: '제작도관리번호',
                            combineErrors: true,
                            msgTarget : 'side',
                            layout: 'hbox',
                            defaults: {
                                flex: 1,
                                hideLabel: true
                            },
                            items: [
                                {
                                    xtype     : 'textfield',
                                    id : 'alter_item_code',
                                    name      : 'alter_item_code',
                                    margin: '0 5 0 0',
                                    value : gMain.selPanel.maxnum,
                                    width: 150,
                                    allowBlank: false
                                }

                            ]
                        }
                    ]
                }
            ]
        });//Panel end...
        myHeight = 120;
        myWidth = 390;

        prwin = gMain.selPanel.propen(form);
    },

    propen: function(form) {
        prWin =	Ext.create('Ext.Window', {
            modal : true,
            title: 'Information Insert',
            width: myWidth,

            //height: myHeight,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                handler: function(){
                    var form = Ext.getCmp('formPanelMini').getForm();
                    var assymap_uids = [];
                    var mass = 0;   //po 중량
                    var quan = 0;  //po 수량
                    var sales_price = 0;
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        var uid =  rec.get('unique_id');
                        var mass_unit = rec.get('mass');
                        mass = mass+ mass_unit;
                        assymap_uids.push(uid);
                        var quan_unit = rec.get('quan');
                        console_logs('quan_unit', quan_unit);
                        quan = quan + quan_unit;
                        sales_price = selections[0].get('sales_price');
                        console_logs('reserved_double2', quan);
                    }

                    var ac_uid = selections[0].get('ac_uid');
                    var area_code = selections[0].get('area_code');

                    area_code = gUtil.stripHighlight(area_code);  //하이라이트 삭제

                    form.submit({
                        url : CONTEXT_PATH + '/index/process.do?method=addCombineSubLot',
                        params:{
                            assymap_uids: assymap_uids,
                            ac_uid : ac_uid,
                            totalmass : mass,
                            reserved_double2 : quan,
                            sales_price : sales_price,
                            area_code : area_code
                        },
                        success: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            //prWin.close();
                            // alert('소그룹명 중복');
                        }
                    });


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

    buttonToolbar3 : Ext.create('widget.toolbar', {
        cls: '.my-x-toolbar-default2',
        items: [{
            xtype: 'label',
            style: 'color: #FFFFFF; font-weight: bold; font-size: 15px;',
            text: '자재를 선택하면 현재 선택한 자재의 수량 및 중량을 확인할 수 있습니다.'
        }]
    }),

    treatPjCodes: function(){
        var form = Ext.create('Ext.form.Panel', {
            id: gu.id('formPanel'),
            xtype: 'form',
            frame: false,
            border: false,
            bodyPadding: '3 3 0',
            region: 'center',
            defaults: {
                anchor: '100%'
            },
            items : [
                {
                    xtype: 'fieldset',
                    title: '입력',
                    collapsible: true,
                    defaults: {
                        labelWidth: 60,
                        anchor: '100%',
                        layout: {
                            type: 'hbox',
                            defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
                        }
                    },
                    items : [
                        {
                            xtype: 'fieldcontainer',
                            fieldLabel: '주문번호',
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
                                    id: gu.id('pj_code'),
                                    name      : 'pj_code',
                                    fieldLabel: '주문번호',
                                    margin: '0 5 0 0',
                                    width: 300,
                                    allowBlank: false,
                                    //value :gm.me().lotname,
                                    fieldStyle: 'text-transform:uppercase',
                                    maxlength: '1',
                                    value: '',
                                    readOnly: false//,

                                },
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
            title: '변경할 주문번호를 입력하십시오',
            width: myWidth,

            //height: myHeight,
            plain:true,
            items: form,
            buttons: [{
                text: CMD_OK,
                id: gu.id('prwinopen-OK-button'),
                disabled: false,
                handler: function(){
                    //console_logs('중복 확인>>>>>>',gMain.selPanel.checkname);
                    /*if(gMain.selPanel.checkname == false){
                        Ext.MessageBox.alert('경고', '중복 확인 버튼을 눌러주세요');
                    }else{*/
                    var form = gu.getCmp('formPanel').getForm();
                    var assymaparr = [];
                    var projectarr = [];
                    var po_quan = 0;
                    var reserved_double4 = 0;
                    var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
                    for(var i=0; i< selections.length; i++) {
                        var rec = selections[i];
                        projectarr.push(rec.get("ac_uid"));
                        assymaparr.push(rec.get("unique_id"));
                    }
                    gu.getCmp('prwinopen-OK-button').setDisabled(true);
                    form.submit({

                        url: CONTEXT_PATH + '/index/process.do?method=changeOrderNumber',
                        params:{
                            projectarr: projectarr,
                            assymaparr: assymaparr
                        },
                        success: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        },
                        failure: function(val, action){
                            prWin.close();
                            gMain.selPanel.store.load(function(){});
                        }
                    });
                }// checkname of end

                //}//btn handler
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

    setBom: function() {
        var selections = gMain.selPanel.grid.getSelectionModel().getSelection();
        console_logs('====selections', selections);
        if(selections) {
            var wa_name = selections[0].get('order_com_unique');
            var pj_name = selections[0].get('pj_name');
            var pj_code = selections[0].get('pj_code');
            var pj_uid = selections[0].get('ac_uid');
            var parent_uid = selections[0].get('unique_id');

            return gm.me().renderBom(wa_name, pj_name, pj_code, pj_uid, parent_uid, null);
        }
    },
    
    editRedord: function(field, rec) {

        switch(vCompanyReserved4) {
            case 'DOOS01KR':
                var value = rec.get(field);
                var tableName = gm.getTableName(field);
                var whereField = "unique_id";
                switch(gm.getTableName(field)) {
                    case 'project':
                        var ac_uid = rec.get("ac_uid");
                        var assymap_uid = rec.get("unique_id");
                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/index/process.do?method=changeOrderNumber',
                            params:{
                                ac_uid: ac_uid,
                                assymap_uid: assymap_uid,
                                pj_code: value
                            },
                            success : function(result, request) {
                                //gMain.selPanel.store.load();
                            },//endofsuccess
                            failure: extjsUtil.failureMessage
                        });//endofajax

                        break;
                    default:
                        gm.editRedord(field, rec);
                }
                //this.getStore().load();
                break;
            case 'HSGC01KR':
                switch(gm.getTableName(field)) {
                    case 'project':
                        if(field == 'pj_reserved_varchar2') {
                            field = 'reserved_varchar2';
                            rec.set(field, rec.get('pj_reserved_varchar2'));
                            rec.set('tableName', 'project');
                        }
                        rec.set('project_uid', rec.get('ac_uid'));
                        gm.editRedord(field, rec);
                        break;
                    default:
                        gm.editRedord(field, rec);
                }
                //this.getStore().load();
                break;
            default:
                gm.editRedord(field, rec);
        }
    },
    /*//Page toolbar 사용
    usePagingToolbar: true,
    //goto page
    useGotoToolbar: true,
    //FullPage Buffering
    bufferingStore: true*/
    delete_requestAction : Ext.create('Ext.Action', {
        itemId: 'removeButton',
        iconCls:'af-remove',
        text: '반려',
        disabled: true,
        handler: function(widget, event) {
            gm.me().removeRequestAction();

        }// endof handler
    }),

    removeRequestAction: function() {
        var selections = this.grid.getSelectionModel().getSelection();
        var uids = [];
        for(var i=0; i<selections.length; i++) {
            var rec = selections[i];
            uids.push(rec.get('unique_id_long'));
        }
        console_logs('===uids', uids);

        if(uids == null || uids.length < 0) {
            return;
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/purchase/material.do?method=assyReturn',
            params: {
                unique_ids:uids
            },
            success: function(result, request) {
                var result = result.responseText;
                gm.me().store.load();
            },
            failure: extjsUtil.failureMessage
        });
    },


    purchase_requestAction : Ext.create('Ext.Action', {

        itemId: 'purchaseButton',
        iconCls:'font-awesome_4-7-0_dollar_14_0_5395c4_none',
        text: PURCHASE_REQUEST,
        disabled: true,
        handler: function(widget, event) {
            gm.me().doRequestAction(false);

        }// endof handler
    }),

    doRequestAction: function(isGoodsin) {


        var selections = null;
        var rqstType = null;

        selections = this.grid.getSelectionModel().getSelection();
            rqstType = '구매요청';
         console_logs(rqstType, selections);

        console_logs('selections', selections);
        if (selections == null || selections.length == 0) {
            Ext.MessageBox.alert(error_msg_prompt, '선택한 자재가 없습니다.');
        }

        var nique_uids = new Array();
        var new_pr_quans = new Array();

        var userStore = Ext.create('Mplm.store.UserStore', {
            hasNull: false
        });

        var route_type = isGoodsin == true ? 'G' : 'P';

        var puchaseReqTitle = '[' + this.selectedPjCode + '] ' + this.selectedPjName + ' : ' + rqstType;

        var unique_uids = [];
        var child_uids = [];
        var parent_uids = [];
        var pj_uids = [];
        this.catmapObj = [];

        var ac_uid_first = selections[0].get('ac_uid');

        for (var i = 0; i < selections.length; i++) {
            var rec = selections[i];
            console_logs('==zz', rec);
            if (isGoodsin == false) {
                var ac_uid = rec.get('ac_uid');
                if (ac_uid == null || ac_uid.length < 0) {
                    Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + this.selectedPjName + '] 프로젝트에 속한 자재만 ' + rqstType + '할 수 있습니다.');
                    return;
                }
                if(ac_uid_first != ac_uid) {
                    Ext.MessageBox.alert(error_msg_prompt, '작업중인 [' + this.selectedPjName + '] 프로젝트에 속한 자재만(같은 프로젝트만) ' + rqstType + '할 수 있습니다.');
                    return;
                }

                new_pr_quans.push(rec.get('bm_quan'));

            }

            unique_uids[i] = rec.get('unique_id_long');
            if (new_pr_quans[i] < 0.00000001) {
                Ext.MessageBox.alert('입력 확인', '"' + rec.get('item_name') + '"의 요청 수량이 0입니다.');
                return;
            }

            this.catmapObj[i] = rec;

            child_uids.push(rec.get('child'));
            parent_uids.push(rec.get('ac_uid'));

        }//emdoffor

        var item_name = rec.get('item_name');
        var item_code = rec.get('item_code');
        var item_qty = selections.length;

        var userStore = Ext.create('Mplm.store.UserStore');
        userStore.getProxy().setExtraParam('user_type', 'PUR');

        var formItems = [{
                    xtype: 'fieldset',
                    title: '구매 요청',
                    collapsible: false,
                    width: '100%',
                    style: 'padding:10px',
                    //bodyStyle: 'padding:15px',
                    defaults: {
                        width: '100%',
                        //labelWidth: 89,
                        //anchor: '100%',
                        layout: {
                            type: 'hbox'//,
                            // defaultMargins: {
                            //     top: 10,
                            //     right: 10,
                            //     bottom: 10,
                            //     left: 10
                            // }
                        }
                    },
                    items: [
                        new Ext.form.Hidden({
                            name: 'route_type',
                            value: route_type
				        }),
                        new Ext.form.Hidden({
                            name: 'pj_uid',
                            value: ac_uid_first
                        }),
					      
                        // new Ext.form.Hidden({
                        // id: 'hid_userlist_role',
                        // name: 'hid_userlist_role'
                        // }),
                        // new Ext.form.Hidden({
                        //     id: 'hid_userlist',
                        //     name: 'hid_userlist'
                        // }),
                        new Ext.form.Hidden({
                        id: 'pr_quan',
                        name: 'pr_quan',
                        value: new_pr_quans
                        }),
                        new Ext.form.Hidden({
                            id: 'unique_uids',
                            name: 'unique_uids',
                            value: unique_uids
                        }),
                        new Ext.form.Hidden({
                            id: 'child',
                            name: 'child',
                            value: child_uids
                        }),
                        new Ext.form.Hidden({
                            id: 'parent',
                            name: 'parent',
                            value: parent_uids
                        }),
                        new Ext.form.Hidden({
                            id: 'req_date',
                            name: 'req_date'
                        }),
                        new Ext.form.Hidden({
                            id: 'type',
                            name: 'type',
                            value: 'BOM'
                        }),
                        {
                            fieldLabel: '요청사항',
                            xtype: 'textarea',
                            rows: 4,
                            anchor: '100%',
                            name: 'req_info'
                        },{
	                	xtype: 'datefield',
	                	id: 'request_date',
	                	name: 'request_date',
		            	fieldLabel: toolbar_pj_req_date,
		            	format: 'Y-m-d HH:mm:ss',
				    	submitFormat: 'Y-m-d HH:mm:ss',// 'Y/m/d H:i:s',
				    	dateFormat: 'Y-m-d HH:mm:ss',// 'Y/m/d H:i:s'
		            	// value: Ext.Date.add (new Date(),Ext.Date.DAY,14),
	            		anchor: '100%'
                        }, 
                        {
                        fieldLabel: '구매담당자',
                        xtype: 'combo',    
	            		anchor: '100%',
	            		id: 'po_user_uid',
	            		name: 'po_user_uid',
	            		store: userStore,
	            		displayField:   'user_name',
	            		valueField: 'unique_id',
	            		emptyText: '선택',
	            		allowBlank: false,
	            		sortInfo: { field: 'user_name', direction: 'ASC' },
	            	    typeAhead: false,
	            	    //hideLabel: true,
	            	    minChars: 1,
	            		listConfig:{
	            			loadingText: '검색중...',
	            	        emptyText: '일치하는 항목 없음.',
	            	      	getInnerTpl: function(){
	            	      		return '<div data-qtip="{unique_id}">{user_name}</div>';
	            	      	}
	            		},
	            		listeners: {
	            	        //    select: function (combo, record) {
	            	        // 	   var reccode = record.get('area_code');
	            	        // 	   Ext.getCmp('maker_code').setValue(reccode);
	            	        //    }
	            	      }	
                        }
                    ]
                }];

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
                var myHeight = (this.useRouting==true) ? 430: 410;
                var myWidth = 600;

                var items = [form];

                var prWin = Ext.create('Ext.Window', {
                    modal: true,
                    title: '구매 요청',
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
                                    console_logs('val', val);

                                    var myWin = prWin;
                                    myWin.setLoading(true);

                                    form.submit({
                                        url: CONTEXT_PATH + '/purchase/request.do?method=createBuyingRequest',
                                        params: val,
                                        success: function(val, action) {
                                            console_logs('----success----', val);
                                            myWin.setLoading(false);
                                            myWin.close();
                                            gm.me().store.load(function() {});
                                        },
                                        failure: function(val, action) {
                                            console_logs('----failure----', val);
                                            prWin.close();
                                            gm.me().store.load(function() {});

                                        }
                                    });
                                        
                                } // end of formvalid 
                            } //else
                        }
                    }, {
                        text: CMD_CANCEL,
                        handler: function(btn) {
                            prWin.close();
                        }
                    }]
                });

                prWin.show(undefined, function(){
                    var combo = gu.getCmp('target_supplier');
                    console_logs('combo', combo);
                    var selections = gm.me().grid.getSelectionModel().getSelection();
                    if(selections==null || selections.length==0) {
                        return;
                    }
                    var rec = selections[0];
                    console_logs('rec', rec);
                    var supplier_uid = rec.get('coord_key1');
                    var supplier_name = rec.get('supplier_name');


                    if(combo!=null) { //공급사 자동선택
                        // combo.setValue(supplier_uid);
                        // var record = combo.findRecordByValue(val);
                        // if(record!=null) {
                        //     combo.select(record);
                        // }
                        combo.store.load(function(records) {
                            console_logs('combo.store.load records', records);

                            if(records!=null) {
                                  for (var i=0; i<records.length; i++){
                                    console_logs('obj', records[i]);

                                         var obj = records[i];
                                         try {
                                              if(obj.get(combo.valueField)==supplier_uid ) {
                                                  combo.select(obj);
                                              }
                                         } catch(e){}
                                  }
                            }//endofif

                          });


                    }//endof if(combo!=null) {
                });

    },

    attachFile: function() {
        var record = gm.me().grid.getSelectionModel().getSelection()[0];

        this.attachedFileStore.getProxy().setExtraParam('group_code', record.get('ac_uid'));
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
		});
		

        var selFilegrid =   Ext.create("Ext.selection.CheckboxModel", {} );
        this.fileGrid = Ext.create('Ext.grid.Panel', {
            title: '첨부',
            store: this.attachedFileStore,
            collapsible: true,
            multiSelect: true,
            // hidden : ! this.useDocument,
            // selModel: selFilegrid,
            stateId: 'fileGrid' + /* (G) */ vCUR_MENU_CODE,
            dockedItems: [{
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: [
                    {
                        xtype : 'button',
                        text : '파일 첨부',
                        scale: 'small',
                        glyph: 'xf0c6@FontAwesome',
                        scope : this.fileGrid,
                        handler : function() {

                                console_logs('=[===record', record);
                            var url =  CONTEXT_PATH + '/uploader.do?method=multi&group_code=' + record.get('ac_uid');

                            var uploadPanel = Ext.create('Ext.ux.upload.Panel', {
                                uploader : 'Ext.ux.upload.uploader.FormDataUploader',
                                uploaderOptions : {
                                    url : url
                                },
                                synchronous : true
                            });
                                var uploadDialog = Ext.create('Ext.ux.upload.Dialog', {
                                    dialogTitle : '파일 첨부',
                                    panel : uploadPanel
                                });

                                this.mon(uploadDialog, 'uploadcomplete', function(uploadPanel, manager, items, errorCount) {
                                	
                                	console_logs('this.mon uploadcomplete uploadPanel', uploadPanel);
                                	console_logs('this.mon uploadcomplete manager', manager);
                                	console_logs('this.mon uploadcomplete items', items);
                                	console_logs('this.mon uploadcomplete errorCount', errorCount);
                                	
                                	gm.me().uploadComplete(items);
                                    //if (!errorCount) {
                                        uploadDialog.close();
                                    //}
                                }, this);

                                uploadDialog.show();
                            }
                        },
                        this.removeActionFile, 
                        '-',
                        this.sendFileAction,
                        '->',
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

        var win = Ext.create('ModalWindow', {
            title: CMD_VIEW + '::' + /*(G)*/' 첨부파일',
            width: 1300,
            height: 600,
            minWidth: 250,
            minHeight: 180,
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            xtype:'container',
            plain: true,
            items: [
                this.fileGrid
            ],
            buttons: [{
                text: CMD_OK,
                handler: function() {
                    if(win) {win.close();}
                }
            }]
        });
	    win.show();
        
        
        // this.fileGrid.getSelectionModel().on({
	    // 	selectionchange: function(sm, selections) {

	    // 		if(selections!=null && selections.length>0) {
		//     		gm.me().removeActionFile.enable();
		//     		gm.me().sendFileAction.enable();
	    // 		} else {
	    // 			gm.me().removeActionFile.disable();
	    // 			gm.me().sendFileAction.disable();
	    // 		}

	    // 	}
        // });
    },
    
    attachedFileStore : Ext.create('Mplm.store.AttachedFileStore', {group_code: null} ),

    uploadComplete : function(items) {
    	
    	console_logs('uploadComplete items', items);
    	
        var output = 'Uploaded files: <br>';
        Ext.Array.each(items, function(item) {
            output += item.getFilename() + ' (' + item.getType() + ', '
                + Ext.util.Format.fileSize(item.getSize()) + ')' + '<br>';
        });
        
        console_logs('파일업로드 결과', output);
        
        this.attachedFileStore.load(function(records) {
            if(records!=null) {
                var o = gu.getCmp('file_quan');
                if (o != null) {
                    o.update( '총수량 : ' + records.length);
                }
                
            }
        });
        
        
        
    },


});
