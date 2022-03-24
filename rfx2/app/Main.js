Ext.define('Rfx2.app.Main', {
    extend: 'Rfx2.app.AbsMainBase',
    name: 'MagicMES',
    northHeight: (vExtVersion > 5) ? 48 : 84,
    bodyPadding: (vExtVersion > 5) ? 5 : 10,
    constructor: function (config) {

        this.defToken = config['defToken'];

        this.setDefalultEnv(config);

        this.carTypeStore = Ext.create('Mplm.store.CarTypeStore', {});

        switch(vSYSTEM_TYPE_SUB) {
            case 'HEAVY4':
            case 'RESERVED_SUB03':
                break;
            default:
                this.carTypeStore.load();
        }

        this.callParent(arguments);
        this.name = 'MagicMES8';
    },
    lastMenu: {
        'equip-tate': 'EMC1',
        'sales-delivery': 'calendar',
        'design-plan': 'DDW6',
        'produce-mgmt': 'EPC5',
        'pur-stock': 'PPR3',
        'criterion-info': 'CBB1'
    },
    lastMenuHeavy: {
        'equip-state': 'EMC1',
        'sales-delivery': 'SDL2',
        'delivery': 'SPS1_MES',
        'design-plan': (vCompanyReserved4 == 'KWLM01KR') ? 'DBM7_PLM' : 'DBM7',
        'produce-mgmt': 'EPC5',
        'pur-stock': 'PPR3',
        'criterion-info': 'AMY2'
    },
    hashTo: function (link) {
        console_logs('<Rfx2Main> ############## hashTo link : ', link);
        var pre = link.substring(0, 1);
        if (pre == '#') {
            link = link.substring(1);
        }

        Ext.Ajax.request({
            url: CONTEXT_PATH
            + '/userMgmt/user.do?method=log',
            params: {
                link: link
            },
            success: function (result, request) {
                console_logs('<Rfx2Main> hashTo log inserted', link);
            }
        });

//		if (link == 'project-total'/* || link=='produce-state' */) {
//			Ext.getBody().mask('그래프를 생성중입니다.');
//		}

        //메뉴하일라이트
        var menu = 'menu-' + link;
        var menuOn = menu + 'on';
        try {
            $('.' + menu).removeClass(menu).addClass(menuOn);
        } catch (e) {
            console_logs('<Rfx2Main> 메뉴하일라이트', '오류');
            console.info(e);
        }

        // 디포트 서브메뉴만들기
        var arr = link.split(':');

        if (arr.length == 1) {
            var subMenu = null;

            if (vSYSTEM_TYPE_SUB == "HEAVY4") {
                subMenu = this.lastMenuHeavy[arr[0]];
            } else {
                subMenu = this.lastMenu[arr[0]];
            }

            if (subMenu != undefined && subMenu != null) {
                link = arr[0] + ':' + subMenu;
            }
        } else {
            // console_logs('<Rfx2Main> ############' + arr[0], arr[1]);
            if (vSYSTEM_TYPE_SUB == "HEAVY4") {
                this.lastMenuHeavy[arr[0]] = arr[1];
            } else {
                this.lastMenu[arr[0]] = arr[1];
            }

            // console_logs('<Rfx2Main> this.lastMenu', this.lastMenu);
        }

        // this.setEnv(/*"MY_ENV", JSON.stringify(myEnv)*/);
        this.setEnv('link', link);

        if (this.getSaveAutoRefresh() == false) {
            var url = CONTEXT_PATH + '/index/main.do' + '#'
                + link;
            window.location = url;
            // window.location.reload();

            return;
        }

        window.location.hash = '#' + link;

        try {
            if (mm != null) {
                mm.redrawAll();
            }
        } catch (e) {
            console_logs('<Rfx2Main> mm.redrawAll(); e', e);
        }
    },
    // 사용자가 소메뉴 선택시 발생하는 이벤트
    selChangeMenu: function (rec) {

        //console_logs('<Rfx2Main> ======>>>>>>>>> selChangeMenu', rec);
        this.selectedMenuRecord = rec;
        this.selMainPanelCenter = this.selMainPanel.center;
        this.setSelNode(rec);

        var id = rec.get('id');
        var name = rec.get('name');
        var link = rec.get('link');
        this.selLink = link;
        var className = rec.get('className');
        var classId = rec.get('classId');
        var obj = Ext.getCmp(this.selectedMenuId);

        this.menuPermFn();

        this.selMainPanelName = name;
        if (vExtVersion > 5) {

        } else {
            this.refreshToolbarPath();
        }

        this.setCenterLoading(true);

        var refreshForcefully = false;

        if (gMain.useRefreshOnlyCenterPanel()) {
            if (!this.getSaveAutoRefresh()) refreshForcefully = true;
        }

        if (obj == undefined || obj == 'undefined' || obj == null || refreshForcefully) {

            isRefreshed = true;

            if (refreshForcefully) {
                this.selMainPanelCenter.items.each(function (c) {

                    if (!c.id.includes('panel-')) {

                        if (c.id === gMain.selectedMenuId) {
                            if (gMain.selPanel.crudTab !== null) {
                                gMain.selPanel.crudTab.destroy();
                            }
                            c.destroy();
                        }
                    }
                });
            }

            var myLink = '';
            console.log('테스트 데이터 :',link);
            if (this.getMulti_grid(link) == 'N') {
                myLink = link;
            } else {
                myLink = link + '#%';
            }

            switch(vCompanyReserved4) {
                case 'BIOT01KR':
                    this.customBtnPermStoreLoad(myLink);
                    break;
                default:
                    this.extFieldColumnStoreLoad(myLink);
            }

        } else { // endofif
            this.selPanel = obj;
            try {
                this.selMainPanelCenter.setActiveItem((vEDIT_MODE == true) ? this.selectedMenuId + '-editMode' : this.selectedMenuId);
            } catch (error) {
                this.selMainPanelCenter.setActiveItem(this.selectedMenuId);
            }
            this.setCenterLoading(false);

            try {
                this.selPanel.callbackLoadCenterPanel(this, obj, this.selectedMenuId);
            } catch (e) {
                console_log('this.callbackLoadCenterPanel callDefLoad', e);
            }
        }
    },
    customBtnPermStoreLoad: function(myLink) {

        this.customBtnPermStore.load({
            params: {
                system_code: myLink + '%'
            },
            callback: function (child_records, operation, success) {
                gm.extFieldColumnStoreLoad(myLink);
            }
        });
    },
    extFieldColumnStoreLoad: function(myLink) {

        //console_logs('<Rfx2Main> myLink', myLink);

        var link = myLink.replace('%', '').replace('#', '');

        this.extFieldColumnStore.load({
            params: {
                menuCode: myLink
            },
            callback: function (in_records, operation, success) {

                //console_logs('<Rfx2Main> extFieldColumnStore.load in_records', in_records);
                this.leftTreeMenu.getSelectionModel().setLocked(false);

                var records = [];
                var records_map = {};
                if (in_records != null && in_records.length > 0) {

                    for (var i = 0; i < in_records.length; i++) {
                        var o = in_records[i];

                        var menu_code = o.get('menu_code');
                        if (menu_code == link) {
                            records.push(o);
                        }
                        var arr = menu_code.split('#');
                        if (arr.length > 0) {
                            var key = arr[1];
                            if (key != undefined) {
                                records_map[arr[1]] = [];
                            }

                        }

                    }
                    for (var i = 0; i < in_records.length; i++) {
                        var o = in_records[i];
                        //console_logs('<Rfx2Main> in_records o ', o);
                        var menu_code = o.get('menu_code');
                        var arr = menu_code.split('#');
                        if (arr.length > 0) {
                            var key = arr[1];
                            if (key != undefined) {
                                records_map[key].push(o);
                            }

                        }

                    }
                    //console_logs('<Rfx2Main> records_map', records_map);
                }

                if (success == true) {
                    console_logs('<Rfx2Main> selChangeMenu ', link);
                    switch (link) {
                        case 'SRO4':
                        case 'SRO4_PNL':
                        case 'SRO4_DDG': // 대동 삼성
                        case 'SRO4_DD1': // 대동 현대
                        case 'SRO4_SEW':
                        case 'SRO4_DS' : // 두성 삼성
                        case 'SRO4_DS1': // 두성 BOM
                        case 'SRO4_HSG':
                        case 'SRO4_HSG2':
                        case 'SRO4_HSG3':
                        case 'SRO4_HSG4':
                        case 'SRO4_KM':
                        case 'SRO4_KM3':
                        case 'QQL4_PNL':
                        case 'SRO4_CHNG':	//청룡(기타)
                        case 'SRO4_CHNS':	//청룡(삼성)
                        case 'EPC5_SUB':
                        case 'SRO4_HAEW1':	//해원-SPOOL
                        case 'SRO4_HAEW2':	//해원-철의장
                        case 'SRO4_DAEH':	//대흥
                        case 'QQL4_CUT':	//대흥-컷팅플랜

                            Ext.Ajax.request({
                                url: CONTEXT_PATH
                                + '/sales/excelRecvPo.do?method=readBufferPo',
                                params: {
                                    onlyFirst: 'true',
                                    parentCode: link,
                                    group_uid: vCUR_USER_UID
                                    + 1000
                                    * gMain.selNode.id
                                },
                                success: function (result, request) {
                                    var s = result.responseText;
                                    var jsonData = Ext.JSON.decode(s);
                                    var firstRec = jsonData.datas[0];
                                    var parentCode = jsonData.parentCode;
                                    if (firstRec != undefined) {
                                        for (var i = 0; i < records.length; i++) {
                                            var column = records[i];
                                            var fieldText = gUtil.trim(column.get('text'));
                                            column.set(
                                                'text',
                                                fieldText);
                                            var dataIndex = column.get('dataIndex');
                                            var rcdText = gUtil.trim(firstRec[dataIndex]);
                                            firstRec[dataIndex] = rcdText;

                                            if (fieldText == '사전검증') {
                                                var color = '#C1DDF1';
                                                var color1 = 'custom-column-cyan';
                                                column.set('style', 'background-color:' + color + ';text-align:center');
                                                column.set('tdCls', color1);
                                                column.set("renderer", function (value, meta) {
                                                    meta.css = 'custom-column';
                                                    return value;
                                                });
                                            } else if (fieldText == undefined || rcdText == undefined || (fieldText != rcdText)) {
                                                console_logs('<Rfx2Main> 필드불일치 ', rcdText + ':' + fieldText);
                                                var color = '#0271BC';
                                                var color1 = 'custom-column-orange';
                                                if (fieldText != undefined
                                                    && rcdText != undefined) {
                                                    fieldText1 = gUtil.removeSpace(fieldText);
                                                    rcdText1 = gUtil.removeSpace(rcdText);

                                                    if (fieldText1 == rcdText1) {
                                                        color1 = 'custom-column-yellow';
                                                    }
                                                }

                                                column.set('style', 'background-color:' + color + ';text-align:center');
                                                column.set('tdCls', color1);
                                                column.set("renderer", function (value, meta) {
                                                    meta.css = 'custom-column';
                                                    return value;
                                                });
                                            }
                                        }
                                    }
                                    gMain.addToCenterTab(records, records_map);
                                }
                            });

                            break;
                        default:
                            gm.addToCenterTab(records, records_map);
                    }

                } else {// endof if(success..
                    Ext.MessageBox.show({
                        title: '연결 종료',
                        msg: '연결중에 오류가 발생하였습니다. 접속상태를 확인하세요.',
                        buttons: Ext.MessageBox.OK,
                        scope: this,
                        icon: Ext.MessageBox['ERROR'],
                        fn: function () {
                        }
                    });
                }
                this.setCenterLoading(false);
            },// callback
            scope: this
        });
    }
});