Ext.define('Rfx.view.executiveInfo.ReportSearchView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'report-search-view',
    initComponent: function(){

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.ReportSearch', [{
                property: 'user_name',
                direction: 'ASC'
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
            text: '작성일',
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

        this.printReportAction = Ext.create('Ext.Action', {
            xtype : 'button',
            iconCls: 'af-pdf',
            text: '성적서출력',
            tooltip: '최신 버전의 성적서를 출력합니다',
            disabled: false,
            handler: function() {
                var reportSelection = gm.me().grid.getSelectionModel().getSelection();
                if(reportSelection.length > 0) {
                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/xdview/examTest.do?method=printExamTest',
                        params:{
                            target_uid : reportSelection[0].getId(),
                            group_uid : reportSelection[0].get('parent')
                        },
                        success : function(result, request) {
                            var jsonData = Ext.JSON.decode(result.responseText);
                            var excelPath = jsonData.excelPath;
                            var url = CONTEXT_PATH + "/filedown.do?method=direct&path=" + excelPath;
                            top.location.href = url;
                        },//Ajax success
                        failure: function(result, request) {
                            Ext.Msg.alert('오류', '성적서를 찾을 수 없습니다.');
                        }
                    });
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
        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });

        this.callParent(arguments);

        this.storeLoad();

        //디폴트 로드
        gMain.setCenterLoading(false);

    }
});
