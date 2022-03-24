Ext.define('Rfx2.view.executiveInfo.ReportSearchView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'report-search-view',
    initComponent: function(){


        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReportSearch', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize
            ,{}
            , ['rpfiletoken']
        );

        //검색툴바 필드 초기화
        this.initSearchField();

        this.addSearchField ({
            type: 'dateRange',
            field_id: 'create_date',
            text: '출하일',
            labelWidth: 40,
            sdate: Ext.Date.add(new Date(), Ext.Date.MONTH, -1),
            edate: new Date()
        });

		this.addSearchField('fname');
		this.addSearchField('creator');

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : [
                'REGIST','COPY','REMOVE','EDIT'
            ]
        });

        this.removeReportAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '삭제하기',
            hidden: gMain.menu_check == true ? false : true,
            disabled: true,
            handler: function(widget, event) {
                Ext.MessageBox.show({
                    title: '삭제하기',
                    msg: '선택한 항목을 삭제하시겠습니까?<br>삭제한 성적서는 복구가 불가능합니다!',
                    buttons: Ext.MessageBox.YESNO,
                    fn: gm.me().deleteConfirm,
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        switch(vCompanyReserved4) {
            case 'MKEE01KR':
                switch(vCUR_USER_ID) {
                    case 'tykim':
                    case 'parkjh':
                    //case 'mke04':
                    case 'root':
                        buttonToolbar.insert(1, this.removeReportAction);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        //검색 버튼 누를 시 param 추가
        buttonToolbar.items.items[0].handler = function() {
            gm.me().store.getProxy().setExtraParam('class_code', 'Q1REPORT');
            gm.me().redrawStore();
        };

        this.printReportAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-pdf',
            text: '성적서출력',
            tooltip: '최신 버전의 성적서를 출력합니다',
            disabled: false,
            handler: function() {
                var reportSelection = gm.me().grid.getSelectionModel().getSelection();
                if(reportSelection.length > 0) {
                    gm.me().excelDownload(reportSelection.length, reportSelection, 0);
                } else {
                    Ext.Msg.alert('경고', '성적서를 선택하세요.');
                }
            }
        });

        buttonToolbar.insert(1, this.printReportAction);

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        var combstStore = Ext.create('Mplm.store.CombstStore', {});

        var searchTemp = {
            id: gu.id('information'),
            fieldLabel: '종전자재',
            width: 300,
            field_id: 'information',
            name: 'information',
            xtype: 'combo',
            emptyText: '업체코드',
            store: combstStore,
            displayField: 'company_name',
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            sortInfo: {
                field: 'company_name',
                direction: 'ASC'
            },
            minChars: 1,
            margin: '0 3 3 3',
            typeAhead: false,
            hideLabel: true,
            hideTrigger: true,
            listConfig: {
                loadingText: '검색중...',
                emptyText: '일치하는 결과가 없습니다.',
                // Custom rendering template for each item
                getInnerTpl: function () {
                    return '<div data-qtip="{company_name}">[{company_name}]{wa_name}</div>';
                }
            },
            pageSize: 10,
            listeners: {
                select: function(combo, record) {
                    gm.me().store.getProxy().setExtraParam('company_name', record.get('company_name'));
                }
            }
        };

        searchToolbar.add(12, searchTemp);

        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                if(selections.length > 0) {
                    gUtil.enable(gm.me().removeReportAction);
                }
            }
        });

        this.callParent(arguments);

        this.store.getProxy().setExtraParam('class_code', 'Q1REPORT');

        this.storeLoad();

        //디폴트 로드
        gMain.setCenterLoading(false);

    },

    deleteConfirm: function (result){
        if(result=='yes') {

            var selection = gm.me().grid.getSelectionModel().getSelection();

            var unique_ids = [];

            for(var i = 0; i < selection.length; i++) {
                unique_ids.push(selection[i].get('unique_id_long'));
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/xdview/examTest.do?method=deleteReport',
                params : {
                    "report_uids": unique_ids
                },
                method: 'POST',
                success: function(rec, op) {
                    //console_logs('success rec', rec);
                    //console_logs('success op', op);
                    gm.me().redrawStore();
                },
                failure: function (rec, op)  {
                    Ext.Msg.alert('안내', '삭제에 실패하였습니다.', function() {});

                }
            });
        }
    },

    excelDownload: function(size, reportSelection, pos) {

        if(size > pos) {
            var value_keys = reportSelection[pos].get('fname').split('-');
            var value_key = value_keys[value_keys.length-1];

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/xdview/examTest.do?method=printExamTest',
                params:{
                    target_uid : reportSelection[pos].getId(),
                    group_uid : reportSelection[pos].get('parent'),
                    value_key : value_key,
                    temp_name : reportSelection[pos].get('fname')
                },
                success : function(result, request) {
                    var jsonData = Ext.JSON.decode(result.responseText);
                    var excelPath = jsonData.excelPath;
                    var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                    top.location.href = url;
                    gm.me().excelDownload(size, reportSelection, ++pos);
                },//Ajax success
                failure: function(result, request) {
                    Ext.Msg.alert('오류', '성적서를 출력할 수 없습니다. 엑셀 템플릿 관리에서 각 항목 위치가 정확한지 확인하세요.');
                }
            });
        }
    }
});
