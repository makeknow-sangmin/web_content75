Ext.define('Rfx2.base.BaseView', {
    extend: 'Rfx2.base.AbsBaseView',
    initComponent: function() {

        Ext.QuickTips.init();

        Ext.override(Ext.data.proxy.Ajax, { timeout:60000 });

        if(gMain.checkPcHeight() && gMain.checkPcWidth()) {

            if(gMain.checkPcHeight() && gMain.checkPcWidth()) {

            }

            var data1=[]; //, data2=[], data3=[];
            var clipColumns = [];
            Ext.each(this.columns, function(o, index) { //Editable

                //console_logs('o', o);
                var name = o['text'];
                var code = o['dataIndex'];
                //console_logs('name', name);
                //console_logs('code', code);

                data1.push({
                    name: name,
                    code: code
                });

                clipColumns.push({
                    text:o['text'],
                    dataIndex:o['dataIndex'],
                    handler: function(r,l) {
                        //console_logs('r.text',r.text);
                        //console_logs('r.dataIndex',r.dataIndex);
                        var o = gu.getCmp('clipboard');
                        //console_logs('o', o);
                        //o.setText(r.text + ' 값복사');
                        o.value = r.dataIndex;
                        gm.me().popupClip(r.dataIndex, r.text, 300, 500);
                    }
                });
            });

            var datas =[];

            for(var i=0; i<3; i++) {
                var store = Ext.create('Ext.data.Store', {
                    fields: [
                        { name: 'code', type: 'string' },
                        { name: 'name', type: 'string' }
                    ],
                    proxy: {
                        type: 'memory',
                        data: data1,
                        reader: {
                            type: 'json'
                        }
                    },
                    sorters: [{
                        property: 'name',
                        direction: 'ASC'
                    }]
                });

                if(i>0) {
                    datas.push({  xtype: 'tbspacer', hidden: this.multiSortHidden });
                    datas.push({  xtype: 'component', hidden: this.multiSortHidden, html: '<font color="#5E9BD0">|</font>' });
                    datas.push({  xtype: 'tbspacer', hidden: this.multiSortHidden});
                }

                datas.push({
                    xtype: 'combobox',
                    store: store,
                    id: gu.id('multisort' + (i+1) + 'combo'),
                    hidden: this.multiSortHidden,
                    width: 100,
                    emptyText: '정렬기준 ' + (i+1),
                    displayField:  'name',
                    valueField:    'code',
                    forceSelection: false,
                    editable:true,
                    triggerAction: 'all',
                    enableKeyEvents: true,
                    autoLoad: true,
                    autoSync: true,
                    listConfig : {
                        getInnerTpl : function() {
                            return '<div data-qtip="{code}"><small>{name}</small></div>';
                        }
                    },
                    listeners: {
                        select: function (combo, records) {
//	   	                    	//console_logs('combo', combo);
//	   	                    	//console_logs('records', records);

                            gm.me().setMultisortCond();
                        }
                    }
                });

                datas.push(new Ext.form.Hidden({
                    id: gu.id('multisort' + (i+1) + 'ascdesc'),
                    value: ''
                }) );

                datas.push({  xtype: 'tbspacer', hidden: this.multiSortHidden });
                datas.push({
                    xtype: 'button',
                    iconCls: 'fa-sort-alpha-asc',
                    tooltip: '오름차순',
                    hidden: this.multiSortHidden,
                    index: i,
                    value: 'asc',
                    style: {
                        background: '#EAEAEA'
                    },
                    listeners: {
                        click: function(){
                            var v = this.value;
                            var index = this.index;

                            this.value = (v=='asc') ? 'desc' : 'asc';
                            if ( this.value=='asc') {
                                this.setIconCls('fa-sort-alpha-asc');
                                this.setTooltip('오름차순');
                            } else {
                                this.setIconCls('font-awesome_4-7-0_sort-alpha-desc_14_0_f39c12_none');
                                this.setTooltip('내림차순');
                            }


                            gu.getCmp('multisort' + (index+1) + 'ascdesc').setValue(this.value);

                            gm.me().setMultisortCond();
                        }
                    }

                });



            }

            datas.push({  xtype: 'tbspacer', hidden: this.multiSortHidden });
            datas.push({  xtype: 'component', hidden: this.multiSortHidden, html: '<font color="#5E9BD0">|</font>' });
            datas.push({  xtype: 'tbspacer', hidden: this.multiSortHidden });
            datas.push({
                id: gu.id('clipboard'), // + this.link+sub_key,
                xtype: 'splitbutton',
                text: '값복사',
                value: null,
                hidden: this.multiSortHidden,
                tooltip: '값복사 필드 선택',
//	                style: {
//	                    background: '#EAEAEA',
//	                    'font-color': '#000'
//	                },
                handler: function(o, o1) {
                    //console_logs('o', o);
                    //console_logs('o1', o1);
                    //console_logs('value', this.value);
                    var dataIndex = this.value;
                    //if(dataIndex==null) {
                    //	Ext.Msg.alert('안내', '먼저 값복사 할 필드를 선택하세요.', function() {});
                    //} else {
                    gm.me().popupClip(null, null, 1000, 600);
                    //}


                }, // handle a click on the button itself
                menu: new Ext.menu.Menu({
                    items: clipColumns
                })
            });

            datas.push({  xtype: 'tbspacer' });
            datas.push({  xtype: 'tbspacer' });
            datas.push({  xtype: 'tbspacer' });


            switch(vCompanyReserved4) {
                case 'KYNL01KR':
                case 'KWLM01KR':
                case 'MKEE01KR':
                    /*
						우측상단 정렬기준을 설정하지 않고 unique_id desc로
						설정할 경우 스토어에 orderBy 옵션을 주어도 unique_id로만 정렬한다.
						 */
                    datas.push(
                        new Ext.form.Hidden({
                            id: gu.id('sortCond-multisort'),
                            value: ''
                        }));
                    break;
                default:
                    datas.push(
                        new Ext.form.Hidden({
                            id: gu.id('sortCond-multisort'),
                            value: 'unique_id desc'
                        }));

            }
            this.header= {
                items: datas
            };

            this.tools = [
                //{
                // xtype: 'tool',
                // type: 'gear',
                // handler: function(e, target, header, tool){
                //     var portlet = header.ownerCt;
                //     portlet.setLoading('Loading...');
                //     Ext.defer(function() {
                //         portlet.setLoading(false);
                //     }, 2000);
                // }
                //},
                {
                    xtype: 'tool',
                    type: 'refresh',
                    qtip: "다시그리기",
                    scope: this,
                    // width:70,
                    text: '다시그리기',
                    handler: function(e, target, header, tool) {
                        var ownerCt = header.ownerCt;
                        ownerCt.redrawStore();
                    }
                },
                {
                    type: 'mytool',
                    width:50,
                    bind: {
                        html: '<div class="x-tool-mytool" title="다운로드"><img src="{srcDownload}" align="{align}" />{excel}</div>'
                    },
                    handler: this.printExcelHandler /*function(e, target, header, tool){
				  	Ext.Msg.alert('안내', '엑셀 다운로드: 준비중인 기능입니다.', function() {});
				  }*/
                }

//				,{
//				// xtype: 'tool',
//				// type: 'save',
//				// handler: function(e, target, header, tool){
//				// 	Ext.Msg.alert('안내', '저장기능: 준비중인 기능입니다.', function() {});
//				//     var portlet = header.ownerCt;
//				//     portlet.setLoading('Loading...');
//				//     Ext.defer(function() {
//				//         portlet.setLoading(false);
//				//     }, 2000);
//				// }
//				//},{
//				 xtype: 'tool',
//				 type: 'help',
//				 //width:70,
//				 handler: function(e, target, header, tool){
//				 	Ext.Msg.alert('안내', '도움말: 준비중인 기능입니다.', function() {});
//				//     var portlet = header.ownerCt;
//				//     portlet.setLoading('Loading...');
//				//     Ext.defer(function() {
//				//         portlet.setLoading(false);
//				//     }, 2000);
//				 }
//				}


                /*,{
				 xtype: 'tool',
				 type: 'print',
				 handler: function(e, target, header, tool){
				 	Ext.Msg.alert('안내', '인쇄: 준비중인 기능입니다.', function() {});
				//     var portlet = header.ownerCt;
				//     portlet.setLoading('Loading...');
				//     Ext.defer(function() {
				//         portlet.setLoading(false);
				//     }, 2000);
				 }
				}*/];
        }


        this.callParent(arguments);
        if(gMain.checkPcWidth()==false) {
            gMain.closeMenu();
        }
    },

    insertDategangeField: function(srchToolbar, field_id, fieldObj) {

        var srchId = gMain.getSearchField(field_id);
        var srchId_link = this.link + '-'+ srchId;

        var valSdate = fieldObj['sdate'];
        var valEdate = fieldObj['edate'];

        switch(vCompanyReserved4) {
            case 'KWLM01KR':
            valSdate = Ext.Date.getFirstDateOfMonth(new Date());
            valEdate = Ext.Date.getLastDateOfMonth(new Date());
            break;
        }

        var labelWidth = fieldObj['labelWidth']==undefined ? 48:fieldObj['labelWidth'];

        var yyyymmdd = gUtil.yyyymmdd(valSdate) + ':' + gUtil.yyyymmdd(valEdate);

        srchToolbar.push(new Ext.form.Hidden({ cmpId: srchId_link, name: srchId, value: yyyymmdd}));

        var s_date = srchId_link + '-s';
        var e_date = srchId_link + '-e';

        srchToolbar.push({
            xtype:'label',
            width:labelWidth,
            text: fieldObj['text'],
            style: 'color:white;'

        });

        var disabled = fieldObj['disabled']==null?false:fieldObj['disabled'];
        var editable = fieldObj['editable']==null?true:fieldObj['editable'];

        srchToolbar.push({
            cmpId: s_date,
            name: s_date,
            id: s_date,
            format: 'Y-m-d',
            disabled: disabled,
            editable: editable,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            xtype: 'datefield',
            value: valSdate,
            width: 102,
            listeners: {
                select: {
                    fn:function(a,b,c){
                        if(a.focusTask != undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function(field, newVal, oldVal) {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey : function(fieldObj, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {
                        gm.me().redrawStore(true);
                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                    }
                }
            }

        });

        srchToolbar.push({
            xtype:'label',
            text: "~",
            style: 'color:white;'
        });

        srchToolbar.push({
            cmpId: e_date,
            name: e_date,
            id: e_date,
            format: 'Y-m-d',
            disabled: disabled,
            editable: editable,
            fieldStyle: 'background-color: #FBF8E6; background-image: none;',
            submitFormat: 'Y-m-d',// 'Y-m-d H:i:s',
            dateFormat: 'Y-m-d',// 'Y-m-d H:i:s'
            allowBlank: true,
            xtype: 'datefield',
            value: valEdate,
            width: 102,
            listeners: {
                select: {
                    fn:function(a,b,c){
                        if(a.focusTask != undefined) {
                            gMain.changeDatespan(this['cmpId']);
                        }
                    }
                },
                change: function(field, newVal, oldVal) {
                    gMain.changeDatespan(this['cmpId']);
                },
                specialkey : function(fieldObj, e) {
                    if (e.getKey() == Ext.EventObject.ENTER) {

                        gm.me().redrawStore(true);
                        //srchSingleHandler (store, srchId, fieldObj, isWild);
                    }
                }
            }
        });

        switch(vCompanyReserved4) {
            case 'RFXS01KR':
            case 'KBTC01KR':
            case 'HJSV01KR': 
                srchToolbar.push({
                    xtype:'button',
                    iconCls: 'af-arrow-left',
                    // text: "<",
                    style: 'color:white;',
                    listeners: {
                        click: function() {
                            console_logs('>>s_date', s_date);
                            var s = Ext.getCmp(s_date).getValue();
                            var e = Ext.getCmp(e_date).getValue();
                            var s_value = Ext.Date.add(s, Ext.Date.MONTH, -1);
                            var e_value = Ext.Date.add(e, Ext.Date.MONTH, -1);
                            valSdate = Ext.Date.getFirstDateOfMonth(s_value);
                            valEdate = Ext.Date.getLastDateOfMonth(e_value);
                            Ext.getCmp(s_date).setValue(Ext.Date.format(valSdate, 'Y-m-d'));
                            Ext.getCmp(e_date).setValue(Ext.Date.format(valEdate, 'Y-m-d'));
                        },
                    }
                });

                srchToolbar.push({
                    xtype:'button',
                     iconCls: 'af-arrow-right',
                    style: 'color:white;',
                    listeners: {
                        click: function() {
                            var s = Ext.getCmp(s_date).getValue();
                            var e = Ext.getCmp(e_date).getValue();
                            var s_value = Ext.Date.add(s, Ext.Date.MONTH, 1);
                            var e_value = Ext.Date.add(e, Ext.Date.MONTH, 1);
                            valSdate = Ext.Date.getFirstDateOfMonth(s_value);
                            valEdate = Ext.Date.getLastDateOfMonth(e_value);
                            Ext.getCmp(s_date).setValue(Ext.Date.format(valSdate, 'Y-m-d'));
                            Ext.getCmp(e_date).setValue(Ext.Date.format(valEdate, 'Y-m-d'));
                        },
                    }
                });
            break;
        }

    },

    getMC: function(variableCode, falseMsg) {
        try {
            return eval(variableCode);
        } catch (e) {
            return falseMsg;
        }
    }

});