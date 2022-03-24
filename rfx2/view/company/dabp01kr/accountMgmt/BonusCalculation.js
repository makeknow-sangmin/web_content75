Ext.define('Rfx2.view.company.dabp01kr.accountMgmt.BonusCalculation', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'salarycalculation-view',
    initComponent: function(){

        //this.initDefValue();

        //생성시 디폴트 값.


        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.BonusCalculation', [{
                property: 'user_name',
                direction: 'ASC'
            }],
            1000000
            ,{}
            , ['paysal']
        );


        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        (buttonToolbar.items).each(function(item,index,length){
            if(index==1||index==2||index==3||index==4||index==5) {
                buttonToolbar.items.remove(item);
            }
        });

        var yearStore = Ext.create('Ext.data.Store', {
            fields: ['year', 'name'],
            data : [
                {"year":"2018", "name":"2018년"},
                {"year":"2017", "name":"2017년"},
                {"year":"2016", "name":"2016년"}
            ]
        });

        var monthStore = Ext.create('Ext.data.Store', {
            fields: ['month'],
            data : [
                {"month":"1", "name":"1월"},
                {"month":"2", "name":"2월"},
                {"month":"3", "name":"3월"},
                {"month":"4", "name":"4월"},
                {"month":"5", "name":"5월"},
                {"month":"6", "name":"6월"},
                {"month":"7", "name":"7월"},
                {"month":"8", "name":"8월"},
                {"month":"9", "name":"9월"},
                {"month":"10", "name":"10월"},
                {"month":"11", "name":"11월"},
                {"month":"12", "name":"12월"}
            ]
        });

        var today = new Date();
        var month = today.getMonth() + 1;
        var year = today.getFullYear();

        if(month - 1 == 0) {
            year = year - 1;
            month = 12;
        } else {
            month = month - 1;
        }

        this.year = Ext.create('Ext.form.ComboBox', {
            width: 100,
            store: yearStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'year',
            value: year,
            listeners:{
                change: function(combo, value) {
                    //gm.me().year.value = value;
                    gm.me().store.getProxy().setExtraParam('year', gm.me().year.value);
                }
            }
        });

        this.month = Ext.create('Ext.form.ComboBox', {
            width: 80,
            store: monthStore,
            queryMode: 'local',
            displayField: 'name',
            valueField: 'month',
            value: month,
            listeners:{
                change: function(combo, value) {
                    //gm.me().month.value = value;
                    gm.me().store.getProxy().setExtraParam('month', gm.me().month.value);
                }
            }
        });

        this.CalculateSalAction = Ext.create('Ext.Action',{
            iconCls: 'af-play',
            text: '상여금산출',
            tooltip: '상여금을 산출합니다.',
            disabled: false,
            handler: function() {
                Ext.MessageBox.show({
                    title:'확인',
                    msg: gm.me().year.value + '년 ' + gm.me().month.value + '월의 상여금을 산출하시겠습니까?',
                    buttons: Ext.MessageBox.YESNO,
                    fn:  function(result) {
                        if(result=='yes') {
                            gm.me().calculateSal();

                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });
            }
        });

        this.printPDFAtBoAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '상여금지급명세서',
            disabled: false,
            handler: function(widget, event) {

                var result_length = gm.me().store.data.length;

                if(result_length > 0) {
                    var rec = gm.me().grid.getSelectionModel().getSelection();

                    var bonus_uids = [];

                    for(var i = 0; i < rec.length; i++) {
                        bonus_uids.push(rec[i].getId());
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printAtBo',
                        params:{
                            bonus_uids : bonus_uids,
                            pdfPrint : 'pdfPrint',
                            is_rotate : 'N',
                            year: gm.me().year.value,
                            month: gm.me().month.value
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


                } else {
                    Ext.Msg.alert('경고', '검색 결과가 없는 상태에서 PDF를 출력 할 수 없습니다.');
                }
            }
        });

        this.printPDFAtBlAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '상여금지급대장',
            disabled: false,
            handler: function(widget, event) {

                var result_length = gm.me().store.data.length;

                if(result_length > 0) {
                    var rec = gm.me().grid.getSelectionModel().getSelection();

                    var bonus_uids = [];

                    for(var i = 0; i < rec.length; i++) {
                        bonus_uids.push(rec[i].getId());
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printAtBl',
                        params:{
                            bonus_uids : bonus_uids,
                            pdfPrint : 'pdfPrint',
                            is_rotate : 'N',
                            year: gm.me().year.value,
                            month: gm.me().month.value
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
                } else {
                    Ext.Msg.alert('경고', '검색 결과가 없는 상태에서 PDF를 출력 할 수 없습니다.');
                }
            }
        });

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        buttonToolbar.insert(0, this.printPDFAtBlAction);
        buttonToolbar.insert(0, this.printPDFAtBoAction);
        buttonToolbar.insert(0, this.CalculateSalAction);
        buttonToolbar.insert(0, this.month);
        buttonToolbar.insert(0, this.year);

        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });


        this.callParent(arguments);

        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('year', this.year.value);
        this.store.getProxy().setExtraParam('month', this.month.value);

        this.storeLoad();
    },

    calculateSal: function() {
        gMain.setCenterLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/account/attitude.do?method=calculateBonus',
            params: {
                year: gm.me().year.value,
                month: gm.me().month.value,
                creator: vCUR_USER_NAME,
                creator_uid: vCUR_USER_ID
            },
            success: function(result, request) {
                gMain.setCenterLoading(false);
                gm.me().storeLoad();
            },
            failure: extjsUtil.failureMessage
        });
    }
});
