Ext.define('Rfx2.view.company.dabp01kr.accountMgmt.SalaryCalculation', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'salarycalculation-view',
    attStatusStore: Ext.create('Rfx.store.AttStatusStore'),
    attCalculateStore: Ext.create('Rfx.store.AttCalculateStore'),
    initComponent: function(){

    	//생성시 디폴트 값.

        //모델을 통한 스토어 생성
        this.createStore('Rfx.model.SalaryCalculation', [{
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
        this.addSearchField('division_name');
        this.addSearchField('user_name');
        this.addSearchField (
            {
                field_id: 'sal_system'
                ,store: "SalarySystemStore"
                ,displayField: 'codeName'
                ,valueField: 'systemCode'
                ,innerTpl	: '<div data-qtip="{codeNameEn}">{codeName}</div>'
            });
        this.addSearchField({
            type: 'radio',
            field_id :'work_yn',
            items: [
                {
                    text :  '모두',
                    value: '',
                    name : 'work_yn',
                    checked: true
                },
                {
                    text :  '재직',
                    name : 'work_yn',
                    value: 'Y',
                    checked: false
                },
                {
                    text :  '퇴사',
                    name : 'work_yn',
                    value: 'N',
                    checked: false
                }
            ]
        });

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
                    gm.me().store.getProxy().setExtraParam('month', gm.me().month.value);
                }
            }
        });

        this.CalculateSalAction = Ext.create('Ext.Action',{
            iconCls: 'af-play',
            text: '급여산출',
            tooltip: '급여를 산출합니다.(매달 1일에 前월 것 자동계산)',
            disabled: false,
            handler: function() {
				Ext.MessageBox.show({
					title:'확인',
					msg: gm.me().year.value + '년 ' + gm.me().month.value + '월의 급여를 산출하시겠습니까?',
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

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.printPDFAtSaAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '급여지급명세서',
            disabled: false,
            handler: function(widget, event) {

                var result_length = gm.me().store.data.length;

                if(result_length > 0) {
                    var rec = gm.me().summaryGrid.getSelectionModel().getSelection();

                    var salary_uids = [];

                    for(var i = 0; i < rec.length; i++) {
                        salary_uids.push(rec[i].getId());
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printAtSa',
                        params:{
                            salary_uids : salary_uids,
                            pdfPrint : 'pdfPrint',
                            is_rotate : 'N',
                            year: gm.me().year.value,
                            month: gm.me().month.value,
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

        this.printPDFAtSlAction = Ext.create('Ext.Action',{
            iconCls: 'af-pdf',
            text: '급여지급대장',
            disabled: false,
            handler: function(widget, event) {

                var result_length = gm.me().store.data.length;

                if(result_length > 0) {
                    var rec = gm.me().summaryGrid.getSelectionModel().getSelection();

                    var salary_uids = [];

                    for(var i = 0; i < rec.length; i++) {
                        salary_uids.push(rec[i].getId());
                    }

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/pdf.do?method=printAtSl',
                        params:{
                            salary_uids : salary_uids,
                            pdfPrint : 'pdfPrint',
                            is_rotate : 'Y',
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

        buttonToolbar.insert(0, this.printPDFAtSlAction);
        buttonToolbar.insert(0, this.printPDFAtSaAction);
        buttonToolbar.insert(0, this.CalculateSalAction);
        buttonToolbar.insert(0, this.month);
        buttonToolbar.insert(0, this.year);

        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.createCenter()]
        });


        this.callParent(arguments);
        
        //디폴트 로드
        gMain.setCenterLoading(false);

        this.store.getProxy().setExtraParam('year', this.year.value);
        this.store.getProxy().setExtraParam('month', this.month.value);

        this.storeLoad();

        this.summaryGrid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
                gm.me().vSELECTED_RECORD = (selections!=null && selections.length>0) ? selections[0] : null;
                gm.me().vSELECTED_UNIQUE_ID = gm.me().vSELECTED_RECORD==null ? -1 : gm.me().vSELECTED_RECORD.get('id');
                gMain.doSelectGrid(selections);

                if(selections.length > 0) {

                    var rec = selections[0];
                    var this_year = gm.me().year.value;
                    var this_month = gm.me().month.value;
                    var uid_usrast = rec.get('uid_usrast');
                    var user_name = rec.get('user_name');
                    
                    var next_year = this_month == 12 ? parseInt(this_year) + 1 : this_year;
                    var next_month = this_month == 12 ? 1 : parseInt(this_month) + 1;

                    gm.me().attStatusStore.load({
                        params : {
                            year : this_year,
                            month : this_month,
                            next_year : next_year,
                            next_month : next_month,
                            uid_usrast : uid_usrast
                        },
                        callback : function(records, operation, success) {

                        }
                    });
                    gm.me().attCalculateStore.load({
                        params : {
                            year : this_year,
                            month : this_month,
                            next_year : next_year,
                            next_month : next_month,
                            uid_usrast : uid_usrast
                        },
                        callback : function(records, operation, success) {

                        }
                    });

                    Ext.getCmp(gu.id('user_name_left')).setHtml(user_name + '님의 근태현황');
                    Ext.getCmp(gu.id('user_name_right')).setHtml(user_name + '님의 집계현황');
                }
            }
        });
    },

    calculateSal: function() {
        gMain.setCenterLoading(true);
        Ext.Ajax.request({
            url: CONTEXT_PATH + '/account/attitude.do?method=calculateSal',
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
	},

    createCenter: function() {

        var cellEditing_1 = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });
        var cellEditing_2 = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });

        this.gridCalSalary = Ext.create('Ext.grid.Panel', {
            store: this.attCalculateStore,
            plugins: [cellEditing_1],
            width : '60%',
            columns: [
                {dataIndex: 'dte', text: '일자', width: 50, align: 'center', sortable: false,
                    renderer : function(value) {
                        return value.split("-")[2].split(" ")[0];
                    }
                },
                {dataIndex: 'dte', text: '요일', width: 50, align: 'center', sortable: false,
                    renderer : function(value) {
                        var date = new Date(value);
                        var week = new Array('일', '월', '화', '수', '목', '금', '토');
                        return week[date.getDay()];
                    }
                },
                {dataIndex: 'in_judge', text: '판정', width: 90, align: 'center', sortable: false,
                    renderer : function(value) {
                        if(value == null || value.length < 1) {
                            return '(미집계)';
                        } else {
                            return value;
                        }
                    },
                    editor: {
                        xtype: 'combobox',
                        editable: false,
                        displayField: 'state_name',
                        valueField: 'state_name',
                        store: Ext.create('Ext.data.Store', {
                            fields: ['state_name'],
                            data : [
                                {"state_name" : "결근"},
                                {"state_name" : "정상출근"},
                                {"state_name" : "조기출근"},
                                {"state_name" : "지각"},
                                {"state_name" : "휴일"},
                                {"state_name" : "휴일출근"},
                                {"state_name" : "토요출근"},
                                {"state_name" : "연차"},
                                {"state_name" : "휴가"},
                                {"state_name" : "교육"},
                                {"state_name" : "훈련"},
                                {"state_name" : "공상"}
                            ]
                        })
                    }
                },
                {dataIndex: 'in_time', text: '출근', width: 50, align: 'center', sortable: false,
                    renderer : function(value) {
                        if(value != null && value.length > 0) {
                            var in_time = new Date(value);
                            var minutes = in_time.getMinutes();
                            if(minutes < 10)  {
                                minutes = '0' + minutes;
                            }
                            return in_time.getHours() + ':' + minutes;
                        }
                    }
                },
                {dataIndex: 'out_time', text: '퇴근', width: 50, align: 'center', sortable: false,
                    renderer : function(value) {
                        if(value != null && value.length > 0) {
                            var in_time = new Date(value);
                            var minutes = in_time.getMinutes();
                            if(minutes < 10)  {
                                minutes = '0' + minutes;
                            }
                            return in_time.getHours() + ':' + minutes;
                        }
                    }
                },
                {dataIndex: 'cal_in', text: '출근', width: 70, align: 'center', sortable: false,
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {dataIndex: 'cal_va', text: '연차', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }/*,
                {dataIndex: 'cal_ex', text: '잔업', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if (value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }*/,
                {dataIndex: 'cal_la', text: '연장', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {dataIndex: 'cal_ni', text: '야잔', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }/*,
                {dataIndex: 'cal_si', text: '토/출', width: 70, align: 'center', sortable: false,
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }*/
                //토요일 출근은 특근으로 통합
                ,
                {dataIndex: 'cal_ov', text: '특근', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {dataIndex: 'cal_oe', text: '특연', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {dataIndex: 'cal_on', text: '특야', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                },
                {dataIndex: 'cal_lt', text: '지/조', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: true
                    },
                    renderer : function(value) {
                        if(value < 1) {
                            return '';
                        } else {
                            return value;
                        }
                    }
                }
            ],
            margin: '0 5 0 0',
            listeners: {
                afterrender : function(grid) {
                    var elments = Ext.select(".x-column-header",true);
                    elments.each(function(el) {
                    }, this);
                },
                cellclick: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {

                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx/2);
                    var type = idx%2 == 1 ? 'time' : 'human';
                    var name = type + (pos+1);
                    var val = e.record.get(name);

                    console.log(name, val);

                    var target_uid = gm.me().gridCalSalary.getSelectionModel().getSelection()[0].getId();
                    var uid_usrast = gm.me().gridCalSalary.getSelectionModel().getSelection()[0].get('uid_usrast');

                    var field_name = e.field;
                    var value = e.value;

                    var daily_pay = gm.me().summaryGrid.getSelectionModel().getSelection()[0].get('daily_pay');

                    if(daily_pay > 0) {
                        gm.editAjax('attend', field_name, value, 'unique_id', target_uid,  {type:''});

                        Ext.Ajax.request({
                            url: CONTEXT_PATH + '/account/attitude.do?method=updateCalculateSal',
                            params:{
                                field_name: field_name,
                                uid_usrast: uid_usrast,
                                year: gm.me().year.value,
                                month: gm.me().month.value,
                                target_uid: target_uid,
                                is_leftside: 'Y'
                            },
                            success : function(result, request) {
                                gm.me().storeLoad();
                                gm.me().attStatusStore.reload();
                                gm.me().attCalculateStore.reload();
                            },//endofsuccess

                        });
                    } else {
                        gm.me().showToast('셀수정 결과', '월급제는 우측 화면만 수정할 수 있습니다.');
                    }
                }
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            id: gu.id('user_name_left'),
                            xtype: 'label',
                            html: '',
                            style: 'color: white; margin: 5px;'
                        }
                    ]
                }
            ],
        });

        this.gridCalSalary2 = Ext.create('Ext.grid.Panel', {
            store: this.attStatusStore,
            plugins: [cellEditing_2],
            width : '40%',
            columns: [
                {dataIndex: 'deduct_yn', text: '구분', width: 70, align: 'center', sortable: false},
                {dataIndex: 'at_name', text: '코드명', width: 80, align: 'center', sortable: false},
                {dataIndex: 'allow_name', text: '금액명', width: 80, align: 'center', sortable: false},
                {dataIndex: 'day_count', text: '일수', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield'
                    },
                },
                {dataIndex: 'time_count', text: '시간', width: 70, align: 'center', sortable: false,
                    editor: {
                        xtype: 'numberfield'
                    },
                },
                {dataIndex: 'pay_ratio', text: '가중치', width: 70, align: 'center', sortable: false,
                    renderer : function(value) {
                        return Ext.util.Format.number(value, '0.0');
                    }
                },
                {dataIndex: 'daily_pay', text: '시급', width: 70, align: 'center', sortable: false,
                    renderer : function(value) {
                        return Ext.util.Format.number(value/8, '0,00');
                    }
                },
                {dataIndex: 'sal_price', text: '금액', width: 100, align: 'right', sortable: false,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false
                    },
                    renderer : function(value) {
                        return Ext.util.Format.number(value, '0,00');
                    }
                }
            ],
            margin: '0 0 0 5',
            multiSelect: true,
            listeners: {
                beforeedit: function(editor, e, eOpts) {
                    console_logs('e', e.record.data.at_code);

                    var colIdx = e.colIdx;

                    if(colIdx == 7) {
                        return true;
                    }

                    switch(e.record.get('at_code')) {
                        case '001':
                        case '002':
                        case '004':
                        case '005':
                            if(colIdx == 3) {
                                return true;
                            } else {
                                return false;
                            }
                        case '003':
                        case '006':
                        case '007':
                        case '008':
                        case '009':
                        case '010':
                            if(colIdx == 4) {
                                return true;
                            } else {
                                return false;
                            }
                        default:
                            return false;
                    }

                    return false;
                },
                afterrender : function(grid) {
                    var elments = Ext.select(".x-column-header",true);
                    elments.each(function(el) {
                    }, this);
                },
                cellclick: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {
                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx/2);
                    var type = idx%2 == 1 ? 'time' : 'human';
                    var name = type + (pos+1);
                    var val = e.record.get(name);
                    var field_name = e.field;

                    var calculate_value = 0;

                    switch(field_name) {
                        case 'day_count':
                            calculate_value = e.record.get('day_count') * e.record.get('pay_ratio') * e.record.get('daily_pay');
                            gm.editAjax('atcalc', 'day_count', e.record.get('day_count'), 'unique_id', e.record.get('unique_id'),  {type:''});
                            e.record.set('sal_price', calculate_value);
                            gm.editAjax('atcalc', 'sal_price', calculate_value, 'unique_id', e.record.get('unique_id'),  {type:''});
                            break;
                        case 'time_count':
                            calculate_value = e.record.get('time_count') * e.record.get('pay_ratio') * e.record.get('daily_pay');
                            gm.editAjax('atcalc', 'time_count', e.record.get('time_count'), 'unique_id', e.record.get('unique_id'),  {type:''});
                            e.record.set('sal_price', calculate_value);
                            gm.editAjax('atcalc', 'sal_price', calculate_value, 'unique_id', e.record.get('unique_id'),  {type:''});
                            break;
                    }

                    var target_uid = gm.me().summaryGrid.getSelectionModel().getSelection()[0].getId();

                    gm.editAjax('atcalc', 'sal_price', e.record.get('sal_price'), 'unique_id', e.record.get('unique_id'),  {type:''});

                    Ext.Ajax.request({
                        url: CONTEXT_PATH + '/account/attitude.do?method=updateCalculateSal',
                        params:{
                            field_name: field_name,
                            uid_usrast: uid_usrast,
                            year: gm.me().year.value,
                            month: gm.me().month.value,
                            target_uid: target_uid,
                            is_leftside: 'N'
                        },
                        success : function(result, request) {
                            gm.me().summaryGrid.getSelectionModel().getSelection()[0].set(target, e.record.get('sal_price'));
                            gm.me().storeLoad();
                            gm.me().attStatusStore.reload();
                            gm.me().attCalculateStore.reload();
                        },
                    });
                }
            },
            dockedItems: [
                {
                    dock: 'top',
                    xtype: 'toolbar',
                    cls: 'my-x-toolbar-default1',
                    items: [
                        {
                            id: gu.id('user_name_right'),
                            xtype: 'label',
                            html: '',
                            style: 'color: white; margin: 5px;'
                        }
                    ]
                }
            ],
        });

        this.calContainer = new Ext.container.Container({
            title: '급여산출',
            region: 'center',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [this.gridCalSalary, this.gridCalSalary2]
        });

        var paging = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
            emptyMsg: "표시할 항목이 없습니다."
            ,listeners: {
                beforechange: function (page, currentPage) {
                    this.getStore().getProxy().setExtraParam('start', (currentPage-1)*gMain.pageSize);
                    this.getStore().getProxy().setExtraParam('page', currentPage);
                    this.getStore().getProxy().setExtraParam('limit', gMain.pageSize);
                    gm.me().pageflag = true;
                },
                change: function() {

                    if(gm.me().pageflag == true) {
                        if(gm.me().link == 'SRO5_SUB' || gm.me().link == 'SRO5_SUB1' || gm.me().link == 'SRO5_SUB2') {
                            if(vCompanyReserved4 == 'DOOS01KR') {
                                store.load(function(records) {
                                    gm.me().storeLoadCallbackSub(records);
                                });
                            }
                        }
                    }
                    gm.me().pageflag = false;
                }
            }
        });

        Ext.each(this.columns, function(columnObj, index) {
            var dataIndex = columnObj["dataIndex"];
            console_logs('dataIndex', dataIndex);
            switch (dataIndex) {
                case 'basic_pay':
                case 'duty_pay':
                case 'total_pay':
                case 'extension_pay':
                case 'overtime_pay':
                case 'deduct_total':
                case 'allowance':
                case 'earned_tax':
                case 'resident_tax':
                case 'med_insurance':
                case 'pension':
                case 'emp_insurance':
                case 'sus_pay':
                case 'st_loans':
                case 'year_calculate':
                case 'condol_cost':
                case 'tel_charge':
                case 'annual_allowance':
                case 'etc_allowance':
                case 'med_calculate':
                case 'nurse_insurance':
                case 'nurse_calculate':
                    columnObj["summaryType"] = 'sum';
                    columnObj["summaryRenderer"] = function(value, summaryData, dataIndex) {
                        return Ext.util.Format.number(value, '0,00');
                    };
                    columnObj["editor"] = {
                        listeners: {
                            specialkey: function(f, e) {
                                // 다음 row의 cell editing
                                if (e.getKey() == Ext.EventObject.ENTER && gm.me().nextRow == true) {
                                    // var grid = gm.me().grid;
                                    var grid = gm.me().summaryGrid;
                                    var code = e.getCharCode();
                            
                                    var maxRows = grid.store.data.length;
                                    var maxColumns = grid.columns.length;
                                    var rowSelected = f.column.field.container.component.context.rowIdx;
                                    var colSelected = f.column.field.container.component.context.colIdx;
                                    // gm.me().nextRowCell(e.getKey(),f);
                                    console_logs('=rowSelected', rowSelected);
                                    console_logs('=colSelected', colSelected);
                                    console_logs('=code', code);
                                    console_logs('=grid', grid);
                                    if(maxRows > rowSelected) {
                                        grid.editingPlugin.startEditByPosition({row:rowSelected+1,column:colSelected});
                                        grid.selModel.doSelect(grid.store.data.items[rowSelected+1]);
                                        grid.editingPlugin.edit();
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
        });

        var cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit : 1
        });

        this.summaryGrid = Ext.create('Rfx.base.BaseGrid', {
            title: '급여지급대장',
            features: [{
                id: 'group',
                ftype: 'groupingsummary',
                groupHeaderTpl: '{name}',
                hideGroupedHeader: true,
                enableGroupingMenu: true,
            }, {
                ftype: 'summary',
                dock: 'bottom'
            }],
            lockedViewConfig: {
                scroll: 'horizontal'
            },
            selModel: Ext.create("Ext.selection.CheckboxModel"),
            columns: this.columns,
            store: this.store,
            plugins: [cellEditing],
            dockedItems: [this.buttonToolbar, this.searchToolbar],
            scrollable : true,
            bbar: paging,
            viewConfig: {
                markDirty:false,
                stripeRows: true,
                enableTextSelection: false,
                preserveScrollOnReload: true,
                getRowClass: function(record, index) {
                    var recv_flag = record.get('recv_flag');
                    switch(recv_flag) {
                        case 'EM' :
                            return 'yellow-row';
                            break;
                        case 'SE':
                            return 'red-row';
                            break;
                    }
                }
            },
            listeners: {
                afterrender : function(grid) {
                    var elments = Ext.select(".x-column-header",true);
                    elments.each(function(el) {
                    }, this);
                }
                ,
                cellclick: function(iView, iCellEl, iColIdx, iRecord, iRowEl, iRowIdx, iEvent) {
                    this.selColIdx = iColIdx;
                    console_logs('iColIdx', this.selColIdx);
                },
                edit: function (editor, e, eOpts) {
                    console_logs('record', e.record);
                    var idx = this.selColIdx;
                    var pos = Math.trunc(idx/2);
                    var type = idx%2 == 1 ? 'time' : 'human';
                    var name = type + (pos+1);
                    var val = e.record.get(name);
                    console.log(name, val);
                }
            }
        });

        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [this.summaryGrid, this.calContainer]
        });

        return this.center;
    },

    editRedord: function (field, rec) {

        var params = {};
        var at_code = '';

        switch (field) {
            case 'earned_tax':
                at_code = '501';
                break;
            case 'resident_tax':
                at_code = '502';
                break;
            case 'med_insurance':
                at_code = '503';
                break;
            case 'pension':
                at_code = '504';
                break;
            case 'emp_insurance':
                at_code = '505';
                break;
            case 'sus_pay':
                at_code = '506';
                break;
            case 'st_loans':
                at_code = '507';
                break;
            case 'year_calculate':
                at_code = '508';
                break;
            case 'condol_cost':
                at_code = '509';
                break;
        }

        switch (field) {
            case 'earned_tax':
            case 'resident_tax':
            case 'med_insurance':
            case 'pension':
            case 'emp_insurance':
            case 'sus_pay':
            case 'st_loans':
            case 'year_calculate':
            case 'condol_cost':
                params['uid_usrast'] = rec.get('uid_usrast');
                params['at_code'] = at_code;
                params['sal_price'] = rec.get(field);
                params['year_and_month'] = rec.get('year_and_month');
                gm.editRedord(field, rec);
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/account/attitude.do?method=updateAtcalcByPaysal',
                    params: params,
                    success: function(result, request) {
                        // gm.me().storeLoad();
                        gm.me().attStatusStore.reload();
                        gm.me().attCalculateStore.reload();
                    },
                    failure: extjsUtil.failureMessage
                });
                break;
            default:
                gm.editRedord(field, rec);
                break;
        }
    },
    nextRow: vCompanyReserved4 == 'KWLM01KR' ? true : false
});
