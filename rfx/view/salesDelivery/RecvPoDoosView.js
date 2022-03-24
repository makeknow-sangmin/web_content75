//수주관리 메뉴
Ext.define('Rfx.view.salesDelivery.RecvPoDoosView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'received-mgmt-ds-view',
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

        switch(this.link){
            case 'SRO5_DS6':
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'reserved_timestamp1',
                    text: gm.getMC('CMD_Order_Date', '등록일자'),
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });
                break;
            default:
                this.addSearchField ({
                    type: 'dateRange',
                    field_id: 'regist_date',
                    text: gm.getMC('CMD_Order_Date', '등록일자'),
                    sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
                    edate: new Date()
                });
                break;
        }

        switch(vCompanyReserved4){
            case "DDNG01KR":
            case "SHNH01KR":
            case "HSGC01KR":
            case "KWLM01KR":
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
                break;
            case "DOOS01KR":
                break;
            default :
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
                         xtype: 'combo'
                        ,anchor: '100%'
                        ,width:175
                        ,field_id: 'wa_code'
                        ,store: "BuyerStore"
                        ,displayField: 'wa_name'
                        ,valueField: 'wa_code'
                        ,emptyText: '고객사'
                        ,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
                        ,minChars: 2
                    });
                   
        }

        switch(vCompanyReserved4){
            case "SWON01KR":
                this.addSearchField('reserved1');
                this.addSearchField('pj_code');
                break;
            case "PNLC01KR":
                this.addSearchField (
                    {
                        type: 'area'
                        ,field_id: 'tag_no'
                        ,emptyText: 'TAG NO'
                    });
                this.addSearchField (
                    {
                        type: 'area'
                        ,field_id: 'pj_code'
                        ,emptyText: 'SPOOL NO'
                    });
                break;
            case "DDNG01KR":
                this.addSearchField('pj_code');//P/O번호
                this.addSearchField('area_code');//블록
                this.addSearchField('h_reserved44');//ACTIVITY
                this.addSearchField('reserved1');//도장외부스펙1
                this.addSearchField('h_reserved9');  // 제작메모2
                this.addSearchField('comment');   //자재내역1

                break;
            case "SHNH01KR":
                this.addSearchField('pj_name');    // 프로젝트
                this.addSearchField('area_code');  // 블럭
                this.addSearchField('description');   //자재그룹(물성)
                this.addSearchField('reserved1');	// 도장외부스펙1
                this.addSearchField('moldel_name');	// 도장외부스펙2
                this.addSearchField('h_reserved60');	// 시공 W/C
                this.addSearchField('pj_code');
                break;
            case "DOOS01KR":
                var pj_type = '';
                switch(this.link) {
                    case 'SRO5_DS':
                    case 'SRO5_HSG':
                        pj_type = 'S';
                        break;
                    case 'SRO5_DS2':
                    case 'SRO5_HSG2':
                        pj_type = 'T';
                        break;
                    case 'SRO5_DS3':
                        pj_type = 'TP';
                        break;
                    case 'SRO5_DS4':
                        pj_type = 'EP';
                        break;
                    case 'SRO5_DS6':
                    case 'SRO5_HSG3':
                        pj_type = 'DS';
                        break;
                    case 'SRO5_DS7':
                        pj_type = 'DT';
                        break;
                    case 'SRO5_DS9':
                        pj_type = 'DP';
                        break;
                    case 'SRO5_DS8':
                        pj_type = 'ES';
                        break;
                }

                if(this.link == 'SRO5_DS' || this.link == 'SRO5_DS6' || this.link == 'SRO5_DS8') { 
                    this.addSearchField (
                        {
                            field_id: 'can_produce'
                            ,store: 'CanProduceStore'
                            ,displayField: 'codeName'
                            ,valueField: 'systemCode'
                            ,innerTpl	: '<div data-qtip="{code_name_kr}">{code_name_kr}</div>'
                        });
                }
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'partLineItemDetail',
                    tableName: 'srcahd',
                    field_id: 'area_code',
                    fieldName: 'area_code',
                    params: {
                        pj_type: pj_type,
                        status: 'BM'
                    }
                });
                this.addSearchField({
                    type: 'condition',
                    width: 140,
                    sqlName: 'partLineItemDetail',
                    tableName: 'project',
                    field_id: 'pj_name',
                    fieldName: 'pj_name',
                    params: {
                        pj_type: pj_type,
                        status: 'BM'
                    }
                });
                if(this.link == 'SRO5_DS' || this.link == 'SRO5_DS2' || this.link == 'SRO5_DS3' ) {
                    this.addSearchField({
                        type: 'condition',
                        width: 140,
                        sqlName: 'partLineItemDetail',
                        tableName: 'srcahd',
                        field_id: 'specification',
                        fieldName: 'specification',
                        params: {
                            pj_type: pj_type,
                            status: 'BM'
                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 200,
                        sqlName: 'partLineItemDetail',
                        tableName: 'srcahd',
                        field_id: 'usage1',
                        fieldName: 'usage1',
                        params: {
                            pj_type: pj_type,
                            status: 'BM'
                        }
                    });
                }
                break;
            case "HSGC01KR":
                var pj_type = '';
                switch(this.link) {
                    case 'SRO5_HSG':
                        pj_type = 'S';
                        break;
                    case 'SRO5_HSG2':
                        pj_type = 'T';
                        break;
                    case 'SRO5_HSG3':
                        pj_type = 'DS';
                        break;
                    case 'SRO5_HSG4':
                        pj_type = 'ES';
                        break;
                }
                if(this.link == 'SRO5_HSG' || this.link == 'SRO5_HSG2' || this.link == 'SRO5_HSG3' || this.link == 'SRO5_HSG4') {
                    this.addSearchField({
                        type: 'condition',
                        width: 150,
                        sqlName: 'partLineItemDetail',
                        tableName: 'project',
                        field_id: 'pj_code',
                        fieldName: 'pj_code',
                        params: {
                            pj_type: pj_type,
                            status: 'BM'
                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 150,
                        sqlName: 'partLineItemDetail',
                        tableName: 'project',
                        field_id: 'pj_name',
                        fieldName: 'pj_name',
                        params: {
                            pj_type: pj_type,
                            status: 'BM'
                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 150,
                        sqlName: 'partLineItemDetail',
                        tableName: 'project',
                        emptyText: '공사명',
                        field_id: 'reserved_varchar2',
                        fieldName: 'reserved_varchar2',
                        params: {
                            pj_type: pj_type,
                            status: 'BM'
                        }
                    });
                    this.addSearchField({
                        type: 'condition',
                        width: 150,
                        sqlName: 'partLineItemDetail',
                        tableName: 'project',
                        emptyText: '공사번호',
                        field_id: 'reserved_varchar3',
                        fieldName: 'reserved_varchar3',
                        params: {
                            pj_type: pj_type,
                            status: 'BM'
                        }
                    });
                }
                break;
            default :

                this.addSearchField('area_code');
                this.addSearchField('h_reserved44');
                this.addSearchField('reserved1');
                this.addSearchField('pj_code');
        }

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
                remove_buttons.push('REGIST', 'COPY');
                request_pos = 3;
                break;
            default:
                remove_buttons.push('COPY');
        }

        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS :remove_buttons
        });


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

        var BuyerStore = Ext.create('Mplm.store.BuyerStore',{});
        switch(vCompanyReserved4){
        case 'KWLM01KR':
            searchToolbar.insert(9,{
            xtype: 'combo'
            ,anchor: '100%'
            ,width:175
            ,field_id: 'wa_code'
            ,store: BuyerStore
            ,displayField: 'wa_name'
            ,valueField: 'wa_code'
            ,emptyText: '고객사'
            ,innerTpl	: '<div data-qtip="{wa_code}">[{wa_code}]{wa_name}</div>'
            ,minChars: 1
            ,typeAhead:true
            ,queryMode: 'remote'
            ,fieldStyle: 'background-color: #FBF8E6'
            ,listeners: {
                select: function(combo, record) {
                    var selected = combo.getValue();
                    gm.me().store.getProxy().setExtraParam('wa_code', selected);
                    this.store.removeAll();
                    this.store.reload();
                }
            }
        })
        break;
        default:
        break;
        }

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
            default:
                this.createGrid(searchToolbar, buttonToolbar);
                break;
        }

        //this.createGridCore(arr, option);

        //this.createGrid(arr);
        var parent_code = this.link;

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

        this.deliveryRequestAction = Ext.create('Ext.Action', {
            iconCls: 'mfglabs-step_forward_14_0_5395c4_none',
            text: gm.getMC('CMD_Shipment_request', '출하 요청'),
            tooltip: '출하 요청',
            disabled: true,

            handler: function() {
                Ext.MessageBox.show({
                    title:'확인',
                    msg: '납품서를 생성 하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn:  function(result) {
                        if(result=='yes') {
                            var selections = gm.me().grid.getSelectionModel().getSelection();
                            gm.me().deliveryCreate(selections);
                        } else {
                            return;
                        }
                    },
                    //animateTarget: 'mb4',
                    icon: Ext.MessageBox.QUESTION
                });
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

        buttonToolbar.insert(request_pos, this.requestAction);
        buttonToolbar.insert(request_pos, '-');
        
        switch(vCompanyReserved4) {
        case 'KWLM01KR':
            buttonToolbar.insert(request_pos, this.requestDgnAction);
            buttonToolbar.insert(request_pos, '-');
            buttonToolbar.insert(request_pos, this.changePjCodesAction);
            buttonToolbar.insert(request_pos, '-');
            buttonToolbar.insert(9, this.orderRequestAction);
            buttonToolbar.insert(9, '-');
            buttonToolbar.insert(11, this.deliveryRequestAction);
            buttonToolbar.insert(11, '-');
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
                gUtil.enable(gMain.selPanel.deliveryRequestAction);
                gUtil.enable(gMain.selPanel.requestDgnAction);
                gUtil.enable(gMain.selPanel.modifyPoAction);
                
                
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
                gUtil.disable(gMain.selPanel.deliveryRequestAction);
                gUtil.disable(gMain.selPanel.requestDgnAction);
                gUtil.disable(gMain.selPanel.modifyPoAction);
                
                
                gUtil.disable(gMain.selPanel.changePjCodesAction);
                gUtil.disable(gMain.selPanel.moldidAction);
                gUtil.disable(gMain.selPanel.minLotAction);
                gUtil.disable(gMain.selPanel.requestProduceAction);
                gUtil.disable(gMain.selPanel.requestPaintAction);
                this.buttonToolbar3.items.items[0].update('자재를 선택하시면 선택한 자재의 수량 및 중량을 확인할 수 있습니다.');
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

    deliveryCreate: function(selections) {
        console_logs('=>nap', selections);
        alert('납품서 생성!');

        Ext.Ajax.request({
            url: CONTEXT_PATH + '/sales/delivery.do?method=deliveryRemove',
            params: {
                unique_ids: dl_uids
            },
            success: function(result, request) {
                gm.me().store.load();

                gm.me().showToast('안내', dl_uids.length + '건 반려되었습니다.');
            }, // endofsuccess
            failure: extjsUtil.failureMessage
        }); // endofajax
    }

});
