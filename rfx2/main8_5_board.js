function fPERM_DISABLING() {
    if (vCUR_MENU_PERM == 2) {
        return false;
    } else {
        return true;
    }
}
/*
 Logout 호출
 */
function logout() {
    var action_para = vCONTEXT_PATH + "/login.do?method=logout";// + window.location.hash;
    document.GeneralBaseForm1.action = action_para;
    document.GeneralBaseForm1.submit();
}

function lfn_gotoPublic() {
    var url = vCONTEXT_PATH + '/index/main.do?viewRange=public&selectedLanguage=' + vLANG;
    this.location.href = url;
}

function lfn_gotoPublicExchange() {
    var url = vCONTEXT_PATH + '/index/main.do?publicType=exchange&viewRange=public&selectedLanguage=' + vLANG;
    this.location.href = url;
}


function goHome() {
    var url = vCONTEXT_PATH + '/index/main.do?publicType=home&viewRange=public&selectedLanguage=' + vLANG;
    this.location.href = url;
}
function goRfxB2B() {
    var url = vCONTEXT_PATH + '/index/main.do?publicType=exchange&viewRange=public&selectedLanguage=' + vLANG;
    this.location.href = url;
}

function lfn_gotoGantt() {
    window.open(vCONTEXT_PATH + '/statistics/task.do?method=ganttMain&pj_combo=true&selectedLanguage=' + "ko", '_blank');
}

function getCenterPanelHeight() {
    return Ext.getCmp('mainview-content-panel').getEl().getHeight();
}
function getCenterPanelWidth() {
    return Ext.getCmp('mainview-content-panel').getEl().getWidth();
}


function getWestPanelHeight() {
    return Ext.getCmp('mainview-west-panel').getEl().getHeight();
}
function getWestPanelWidth() {
    return Ext.getCmp('mainview-west-panel').getEl().getWidth();
}

function getCenterTapPanelHeight() {
    var Cheight = Ext.getCmp('mainview-content-panel').getEl().getHeight();
    var Hheight = Ext.getCmp('mainview-head-panel').getEl().getHeight();
    var Theight = (Cheight - Hheight) - 6;
    return Theight;
}

function getPageSize() {
    return 300;
}
function viewRealtimeStatus() {

}

function getMenuTitle() {
    return /*GLOBAL*/vCUR_MENU_NAME + '<small><font color=#D46B25 style="font-weight:normal;"> ' + /*GLOBAL*/vCUR_MENU_CODE + '</font></small>'; // +':'+/*GLOBAL*/vCUR_GROUP_NAME+']</small>';
}


function viewCalendar() {
    //console.log('calendar called');
}


function lfn_viewDashboardSales() {

    var winName = "popupDashboard";
    var url = CONTEXT_PATH + "/popup.do?method=dashboard";
    var style = "scrollbars=no,resizable=yes, width=900,height=800";
    popupInfoWnd(url, winName, style);
}

function lfn_gotoHome() {

    var action_para = CONTEXT_PATH + "/index/main.do" + window.location.hash;
    document.GeneralBaseForm1.action = action_para;
    document.GeneralBaseForm1.submit();

}

function lfn_gotoCeoView() {

    var url = vCONTEXT_PATH + '/view/extjs501/portfolio/index.do?method=ceoview';

    this.location.href = url;
}
function lfn_gotoMenu(menu_code, service, menu_name, link_path, perm) {
    document.GeneralBaseForm1.selectedMenuId.value = menu_code;
    document.GeneralBaseForm1.selectedMenuName.value = menu_name;
    document.GeneralBaseForm1.selectedGroupId.value = service;
    document.GeneralBaseForm1.selectedLinkPath.value = link_path;
    document.GeneralBaseForm1.selectedMenuPerm.value = '' + perm;

    var action_para = CONTEXT_PATH + "/index/main.do" + '?viewRange=private';
    document.GeneralBaseForm1.action = action_para;

    document.GeneralBaseForm1.submit();
}


function lfn_viewDashboardProcess() {

    var winName = "popupDashboard";
    var url = CONTEXT_PATH + "/scheduler/examples/machine";
    var style = "scrollbars=no,resizable=yes, width=900,height=800";
    popupInfoWnd(url, winName, style);
}

function lfn_viewInputProcess(MachWorker) {
    var winName = "ProcessWork" + MachWorker;
    var url = CONTEXT_PATH + "/popup.do?method=";

    if (MachWorker == 'Machine') {
        url = url + "ProcessInput00Machine";
    } else {
        url = url + "ProcessInput00Worker";
    }

    //location.href = url;
    var style = "scrollbars=no,resizable=yes,width=1024,height=768";
    popupInfoWnd(url, winName, style);
}

function fAlert(title, content) {
    Ext.MessageBox.alert(title, content);
}

Ext.define('ModalWindow', {
    extend: 'Ext.window.Window',
    title: 'Modal Window',
    layout: {
        type: 'border',
        padding: 0
    },
    modal: true,
    plain: true
});


//Chart 다시그리기
function redrawTotalChartAll() {
    gu.redrawTotalChartAll();
}

function callGroupMenu(gLink, sLink) {

    for (var i = 0; i < gUtil.menuStruct.length; i++) {
        var o = gUtil.menuStruct[i];

        var menu_key = o['menu_key'];
        var service_name = o['service_name'];
        var display_name = o['display_name'];
        var flag1 = o['flag1'];
        var flag2 = o['flag2'];
        var flag3 = o['flag3'];
        var flag4 = o['flag4'];
        var flag5 = o['flag5'];

        if (gLink == menu_key) {
            gMain.changeProject(service_name, menu_key, display_name, sLink, flag1, flag2, flag3, flag4, flag5);
        } else {

        }
    }

}

/*
 Logout 호출
 */
function logout() {

    Ext.create("Ext.Window", {
        title: "확인",
        bodyStyle: "padding:20px;",
        width: 220,
        height: 150,
        html: '로그아웃 하시겠습니까?',
        buttons: [
            {
                text: "예", handler: function () {

                Ext.getBody().mask('종료중입니다.');
                this.up('window').close();

                var action_para = vCONTEXT_PATH + "/index/login.do?method=logout";

                document.GeneralBaseForm1.action = action_para;
                document.GeneralBaseForm1.submit();

            }
            },
            {
                text: "아니오", handler: function () {
                this.up('window').close();
            }
            }
        ]
    }).show();


}


Ext.onReady(function () {

    //console.log('include post', 'document ready');
    $("body").mousemove(function (e) {
        absoluteMousePosX = e.pageX;
        absoluteMousePosY = e.pageY;
        mouseMoveFlag = true;

        //console.log('mouse pos', absoluteMousePosX + ',' + absoluteMousePosY);
    });

    gUtil = Ext.create('Rfx.app.Util', {});
    gu = gUtil;

    if (strMcList != '') {
        var machineList = Ext.JSON.decode(strMcList);
        //console.log('machineList', machineList);
        gUtil.mc_list = machineList['datas'];
        gUtil.mchnStore = Ext.create('Mplm.store.MachineStore', {});
    }

    if (rackDivision != '') {
        var arr = Ext.JSON.decode(rackDivision);
        //console.log('rackDivision', arr);
        gUtil.rack_list0 = arr['datas0'];
        gUtil.rack_list1 = arr['datas1'];
        gUtil.rack_list2 = arr['datas2'];
        gUtil.rack_list3 = arr['datas3'];
    }
    //TopMenu

    if (jsonMenuStruct != '') {
        var menuStruct = Ext.JSON.decode(jsonMenuStruct);

        gu.menuStruct = menuStruct.datas;
        gu.roleCodes = menuStruct.roleCodes;

        if (vExtVersion > 5) {

            var authoItems = [];

            gu.propGrid = Ext.create('Ext.grid.PropertyGrid', {
                title: '속성',
                // padding: '0 0 0 0',
                // margin: '0 0 0 0',
                source: {
                    "(unique_id)": '-1'
                },
                listeners: {
                    propertychange: function (source, recordId, value, oldValue) {
                        //console.log('Property Changed', Ext.String.format('From: [{0}], To: [{1}]', oldValue.toString(), value.toString()));
                        var saveBtn = Ext.getCmp('authSaveBtn');
                        if (saveBtn != null) {
                            saveBtn.enable();
                        }

                    }
                }
            });

            for (var i = 0; i < gu.roleCodes.length; i++) {
                var o = gu.roleCodes[i];
                // //console.log('authoItems  o', o);
                authoItems.push({
                    boxLabel: o.role_name + ' (' + o.role_code + ')',
                    name: 'checkset',
                    inputValue: o.role_code
                });
            }

            gu.authFormpanel = Ext.create('Ext.form.Panel', {
                title: '권한',
                margin: '10 0 10',
                autoScroll: true,
                items: [
                    {
                        xtype: 'fieldset',
                        layout: 'anchor',
                        collapsible: false,
                        defaults: {
                            anchor: '100%'
                        },
                        items: [{
                            xtype: 'radiogroup',
                            id: 'authTypeRadio',
                            labelWidth: 60,
                            fieldLabel: '권한부여 방식',
                            //cls: 'x-check-group-alt',
                            name: 'rb-auto',
                            items: [
                                {boxLabel: '선택한 그룹 만', name: 'authType', inputValue: 0},
                                {boxLabel: '모두에게 권한주기', name: 'authType', inputValue: 1}

                            ],
                            listeners: {
                                change: function (el, newValue, oldValue) {
                                    //console.log('new value is ', newValue);
                                    var checkSet = Ext.getCmp('authSelectFieldset');
                                    (newValue.authType == 0) ? checkSet.enable() : checkSet.disable();

                                    var saveBtn = Ext.getCmp('authSaveBtn');
                                    if (saveBtn != null) {
                                        saveBtn.enable();
                                    }

                                }
                            }
                        }]
                    },
                    {
                        xtype: 'fieldset',
                        layout: 'anchor',
                        id: 'authSelectFieldset',
                        collapsible: false,
                        defaults: {
                            anchor: '100%'
                        },
                        items: [{
                            // Use the default, automatic layout to distribute the controls evenly
                            // across a single row
                            id: 'authCheckboxgroup',
                            xtype: 'checkboxgroup',
                            fieldLabel: '그룹선택',
                            //cls: 'x-check-group-alt',
                            columns: 2,
                            labelWidth: 60,
                            items: authoItems,
                            listeners: {
                                change: function () {
                                    var saveBtn = Ext.getCmp('authSaveBtn');
                                    if (saveBtn != null) {
                                        saveBtn.enable();
                                    }


                                }
                            }
                        }]
                    }
                ]
            });
        }


        //console.log('jsonMenuStruct o', gUtil.menuStruct);
    }
    //console.log('==============================>', gUtil.menuStruct);

    if (gUtil.menuStruct == undefined || gUtil.menuStruct == null) {
        Ext.MessageBox.alert('알림', '시스템 사용에 필요한 권한을 확인할 수 없습니다. <br>관리자에게 문의하세요.', function () {
            var action_para = vCONTEXT_PATH + '/index/login.do?method=logout';// + window.location.hash;
            document.GeneralBaseForm1.action = action_para;
            document.GeneralBaseForm1.submit();
        });
        return;
    }

    createTopMenu();

    if (jsonLeftMenuStruct != '') {
        var lmenuStruct = Ext.JSON.decode(jsonLeftMenuStruct);
        gu.lmenuStruct = lmenuStruct['datas'];
        gu.lMenuStructKV = new Map();

        for (var i = 0; i < gu.lmenuStruct.length; i++) {
            var menuObj = gu.lmenuStruct[i];
            var link = menuObj.menu_key;
            gu.lMenuStructKV.set(link, menuObj);
        }

    }


    var mesProductCategory = vMesProductCategory;
    if (mesProductCategory != '') {
        var o = Ext.JSON.decode(mesProductCategory);
        // //console.log('mesProductCategory o', o);
        gUtil.mesProductCategory = o['datas'];
    }

    var mesUsePcstpl = vMesUsePcstpl;
    gUtil.mesUsePcstpl = mesUsePcstpl;

    var mesStdProcess = vMesStdProcess;
    if (vCompanyReserved4 == 'DABP01KR') {
        mesStdProcess = vMesTplProcessBig;
    }
    if (mesStdProcess != '') {
        var o = Ext.JSON.decode(mesStdProcess);
        // //console.log('mesStdProcess o', o);
        gUtil.mesStdProcess = o['datas'];
    }

    var mesTplProcessAll = vMesTplProcessAll;
    if (mesTplProcessAll != '') {
        var o = Ext.JSON.decode(mesTplProcessAll);
        // //console.log('mesTplProcessAll o', o);
        gUtil.mesTplProcessAll = o;
    }
    // //console.log('gUtil.mesTplProcessAll', gUtil.mesTplProcessAll);


    if (mesTplProcessAll == '{"result": "no-data"}') { //std process로 만들기
        gUtil.makeProcessAllFromStd();
    }

    var mesTplProcessBig = vMesTplProcessBig;
    //console.log('mesTplProcessBig', mesTplProcessBig);
    if (mesTplProcessBig != '') {
        var o = Ext.JSON.decode(mesTplProcessBig);
        //console.log('mesTplProcessBig', mesTplProcessBig);
        //console.log('mesTplProcessBig o', o);
        gUtil.mesTplProcessBig = o['datas'];
    }

    if (vDivisionAll != '') {
        // //console.log('vDivisionAll', vDivisionAll);
        var o = Ext.JSON.decode(vDivisionAll);
        // //console.log('vDivisionAll o', o);
        gUtil.divisions = o['datas'];
    }


    gMain = Ext.create('Rfx2.app.Main', myenv);
    //Tab메뉴 선택 기능
    gMain.redrawForce = false;
    gMain.launch();
    gm = gMain;//Alias

    //gm.printEchart();

    //설비목록 리드로우. tab만들어진 이훼 한다.
    //gUtil.redrawMcList();

    window.addEventListener('resize', onWindowSize);

    Ext.History.init();
    //Handle this change event in order to restore the UI to the appropriate history state
    Ext.History.on('change', function (token) {

        if (token) {
            //console.log('==============> history token', token);
            var arr = token.split(':');
            var sLink, sGroup;
            //console.log('history arr', arr);

            if (arr.length > 1 && arr[0] == 'undefined') {
                sLink = arr[1];
                sGroup = arr[1];
            } else {
                sGroup = arr[0];
                sLink = arr.length > 1 ? arr[1] : null;
            }


            //console.log('sGroup', sGroup);
            //console.log('sLink', sLink);
            callGroupMenu(sGroup, sLink);

            if (typeof mm !== 'undefined') {
                mm.redrawAll();
            }
        } else {
            //console.log('history token', 'no token');
        }
    });

    if (vUse_workspace == false && userInfoMsg != '') {
        Ext.MessageBox.alert('알림', userInfoMsg, function () {
            Ext.Ajax.request({
                url: CONTEXT_PATH + '/index/generalData.do?method=sessionValue',
                params: {
                    key: 'userInfoMsg',
                    value: ''
                },
                success: function (result, request) {
                },
                failure: extjsUtil.failureMessage
            });
        });
    }

    if (vCUR_USER_ID == 'demo') {
        gMain.viewport.resizeRegion('north', 8);
        gUtil.demo();
    }
    //console.log('create Main', 'end');
}); //Ext.onReady(function(){


//TOP 메뉴를 받아오는 처리
function createTopMenu() {

    if (vUse_workspace == true) {

        getMemoList();

        var createNewnote = function (a, b, c) {
            var message = '';

            if (gm.me() != null) {
                // var columns = gm.me().columns;
                // var selections = gm.me().grid.getSelectionModel().getSelection();
                // if (selections != null && selections.length > 0 && columns != null && columns.length > 0) {
                //     message = '<table border="1" style="border-color:rgb(17, 17, 17)" cellpadding="0" cellspacing="0" width="100%" class="table_grid">';
                //     message = message + '<tr>';
                //     Ext.each(columns, function (o, index) {
                //         var dataIndex = o['dataIndex'];
                //         var canEdit = o['canEdit'];
                //         var useYn = o['useYn'];
                //         var dataType = o['dataType'];
                //         var important = o['important'];
                //         var width = o['width'];
                //         var name = o['text'];
                //         if (useYn == true) {
                //             message = message + '<th>' + name + '</th>';
                //         }

                //     });
                //     message = message + '</tr><tbody>';

                //     for (var i = 0; i < selections.length; i++) {
                //         var rec = selections[i];
                //         message = message + '<tr>';
                //         Ext.each(columns, function (o, index) {
                //             var useYn = o['useYn'];
                //             var dataIndex = o['dataIndex'];
                //             if (useYn == true) {
                //                 var data = rec.get(dataIndex);
                //                 if (data == null) {
                //                     data = '';
                //                 }
                //                 message = message + '<td>' + data + '</td>';
                //             }

                //         });
                //         message = message + '</tr>';
                //     }
                //     message = message + '</tbody></table>';
                // }

            }//endof gm.me()


            //console.log('getBrowserName', mm.getBrowserName());
            //console.log('getInternetExplorerVersion', mm.getInternetExplorerVersion());

            if (mm.getBrowserName() == 'Mozilla') {
                alert('IE에서는 사용할 수 없는 기능입니다. 브라우저가 오동작할 수 있습니다.');

            }


            var link = vCUR_LINK_URL + window.location.hash;
            if (vCUR_LINK_PARAM != '') {
                link = link + '?' + vCUR_LINK_PARAM;
            }

            var from_name = vCUR_USER_NAME + ' ' + vCUR_POSITION;
            var to_name = '<label>' + mm.getActualFullDate() + '</label>';
            var receiver_uid = -1;
            var owner_uid = vCUR_USER_UID;
            var parent_uid = -1;
            var msg_type = 'M';
            var space = (window.location.hash).replace('#', '');
            var link = link;
            var top = absoluteMousePosY + 120;
            var left = absoluteMousePosX - 100;
            var width = 300;
            var height = 250;
            var index = 1;

            //console.log('selMainPanelName', gm.selMainPanelName);

            mm.postSimpleMsg(from_name, to_name, receiver_uid, owner_uid, parent_uid, message, msg_type, space, link, top, left, width, height, index);

        }; //endof createNewnote

        var setViewNote = function (menuItem) {

            if (this.id == mm.getMemoviewType()) {
                return;
            }

            Ext.getCmp('memo_split_button').setText(this.text);
            mm.setMemoviewType(this.id);
            gm.setMemoviewType(this.id);
            mm.redrawAll();
        };


        if (typeof mm !== 'undefined') {
            mm.view_type = (myenv.memoviewType == undefined) ? 'menuItem_cur_only' : myenv.memoviewType;
        }

        // Ext.create('Ext.button.Segmented', {
        //     renderTo: 'stickynote',
        //     allowMultiple: true,
        //     vertical: false,
        //     items: [{
        //         icon: null,
        //         glyph: 'xf249@FontAwesome',
        //         cls: 'yellow-color',
        //         iconAlign: 'left',
        //         handler: createNewnote, // handle a click on the button itself
        //         text: '&nbsp;&nbsp;새&nbsp;&nbsp;메모'
        //     }, {
        //         icon: null,
        //         glyph: 'xf030@FontAwesome',
        //         cls: 'yellow-color',
        //         iconAlign: 'left',
        //         text: '화면 캡쳐',
        //         handler: function () {
        //             html2canvas(document.getElementById("ext-element-1"), {
        //                 onrendered: function (canvas) {

        //                     mm.getLastId(function (lastUid) {

        //                         document.body.appendChild(canvas);
        //                         //var space= (window.location.hash).replace('#', '');

        //                         var context = canvas.getContext("2d");
        //                         var imageDataURL = canvas.toDataURL('image/png');
        //                         var ajax = new XMLHttpRequest();


        //                         var curId = lastUid;


        //                         var uri = CONTEXT_PATH + '/uploader.do?method=multicapture'
        //                             + '&file_name=' + document.title
        //                             + '&group_code=' + curId
        //                         ;
        //                         ajax.open("POST", encodeURI(uri), false);
        //                         ajax.setRequestHeader("Content-Type", "application/upload");

        //                         var curId = lastUid;
        //                         ajax.onreadystatechange = function () {
        //                             if (ajax.readyState === XMLHttpRequest.DONE && ajax.status === 200) {
        //                                 //console.log('ajax.responseText', ajax.responseText);
        //                                 //console.log('curId', curId);

        //                                 var outData = $.parseJSON(ajax.responseText);
        //                                 //console.log('outData', outData);
        //                                 var datas = outData.datas;
        //                                 var rec = datas[0];
        //                                 //console.log('rec', rec);

        //                                 var s = rec.object_name;
        //                                 var files = s + ' (' + Ext.util.Format.fileSize(rec.file_size) + ')';
        //                                 files = files + "<hr />";

        //                                 //console.log('getBrowserName', mm.getBrowserName());
        //                                 //console.log('getInternetExplorerVersion', mm.getInternetExplorerVersion());

        //                                 if (mm.getBrowserName() == 'Mozilla') {
        //                                     alert('IE에서는 사용할 수 없는 기능입니다. 브라우저가 오동작할 수 있습니다.');

        //                                 }


        //                                 var link = vCUR_LINK_URL + window.location.hash;
        //                                 if (vCUR_LINK_PARAM != '') {
        //                                     link = link + '?' + vCUR_LINK_PARAM;
        //                                 }

        //                                 var from_name = vCUR_USER_NAME + ' ' + vCUR_POSITION;
        //                                 var to_name = '<label>' + mm.getActualFullDate() + '</label>';
        //                                 var receiver_uid = -1;
        //                                 var owner_uid = vCUR_USER_UID;
        //                                 var parent_uid = -1;
        //                                 var msg_type = 'M';
        //                                 var space = (window.location.hash).replace('#', '');
        //                                 var link = link;
        //                                 var top = absoluteMousePosY + 120;
        //                                 var left = absoluteMousePosX - 100;
        //                                 var width = 300;
        //                                 var height = 250;
        //                                 var index = 1;

        //                                 //console.log('file html', html);

        //                                 mm.makeMessage(curId, from_name, to_name, receiver_uid, owner_uid, parent_uid, '', msg_type, space, link, top, left, width, height, index, files);

        //                             }
        //                         };
        //                         ajax.send(imageDataURL);


        //                     });//getLastid
        //                 }//onrendered

        //             });//html2canvas
        //         }//endofhandler
        //     }]
        // });


        //display a dropdown menu:
        Ext.create('Ext.button.Segmented', {
            renderTo: 'stickynote2',
            allowMultiple: true,
            vertical: false,
            items: [{
                scale: 'small',
                glyph: 'xf2bd@FontAwesome',
                iconAlign: 'left',
                text: '마이스페이스',
                handler: function () {
                    var action_para = vCONTEXT_PATH + "/myspace/main.do";// + window.location.hash;
                    document.GeneralBaseForm1.action = action_para;
                    document.GeneralBaseForm1.submit();
                }
            }, 
            // {
            //     xtype: 'splitbutton',
            //     id: 'memo_split_button',
            //     text: mm.getMemoviewTypename(),
            //     menu: [
            //         {id: 'menuItem_cur_only', text: '메모 보기', handler: setViewNote},
            //         // {id: 'menuItem_view_all', text: '모두 보기', handler: setViewNote},
            //         {id: 'menuItem_hide_all', text: '메모 끄기', handler: setViewNote}
            //     ]
            // }
        ]
        });

    } //endof vUse_workspace

}; //endof createTopmenu


//property file 한글처리
function LoadJsMessage() {
    Ext.Ajax.request({
        url: CONTEXT_PATH + '/dispField.do?method=loadJsScript&lang=' + vLANG,
        success: function (result, request) {

            eval(result.responseText);
        },
        failure: extjsUtil.failureMessage
    });
}
LoadJsMessage();


var originalFormat = Ext.util.Format.date;
Ext.override(Ext.util.Format, {
    date: function (v, format) {
        if (Ext.isIE && !Ext.isDate(v)) {
            if (v && v.indexOf('T') > -1) {
                // assume ISO format
                v = Ext.Date.parse(v, 'Y-m-dTH:i:s.u');
            }
        }
        return originalFormat(v, format);
    }
});
