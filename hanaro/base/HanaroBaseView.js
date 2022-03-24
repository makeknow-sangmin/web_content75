Ext.define('Hanaro.base.HanaroBaseView', {
    extend: 'Rfx2.base.AbsBaseView',
    initComponent: function() {
        
        Ext.QuickTips.init();

        Ext.override(Ext.data.proxy.Ajax, { timeout:60000 });

        if(gMain.checkPcHeight() && gMain.checkPcWidth()) {

            if(gMain.checkPcHeight() && gMain.checkPcWidth()) {

            }


            new Ext.form.Hidden({
                id: gu.id('sortCond-multisort'),
                value: ''
            });
            

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
    redrawSortCond: function(tab_code) {

        var curTab = (tab_code==null)?this.selected_tab:tab_code;
        if(curTab==undefined || curTab==null) {
            curTab = 'default';
        }
        console_logs('<HanaroNaseView> redrawSortCond: ', curTab);

        var property = this.sort_cond[curTab].property;
        var direction = this.sort_cond[curTab].direction;
        console_logs('property', property);
        console_logs('direction', direction);

        var fields = curTab=='default' ? this.fields : this.fields_map[curTab];
        if(fields!=null) {
            for(var i=0; i<fields.length; i++) {
                var o = fields[i];
                var name = o['name'];
                var text = o['text'];
                //console_logs('name', name);
                if(name==property) {
                    try {
    
                        var oSplitbutton = this.getCommandWidget('splitbutton' + this.link);
                        if(oSplitbutton!=null) {
                            oSplitbutton.setText(text);
                        } else {
                            //console_logs('redrawSortCond', 'oSplitbutton를 찾을 수 없습니다.');
                        }
                        var oOrderby = this.getCommandWidget(this + '-'+ 'orderBy');
                        if(oOrderby!=null) {
                            oOrderby.setValue(name);
                        } else {
                            //console_logs('redrawSortCond', 'oOrderby를 찾을 수 없습니다.');
                        }

                        var oAscdesc = this.getCommandWidget(this + '-'+ 'ascDesc');
                        if(oAscdesc!=null) {
                            oAscdesc.setValue(direction);
                        } else {
                            //console_logs('redrawSortCond', 'oAscdesc를 찾을 수 없습니다.');
                        }
                        

                        if(direction.toLowerCase() == 'desc') {
                            //this(this + '-'+ 'direction-desc').toggle(true);
                        } else {
                           // this(this + '-'+ 'direction-asc').toggle(true);
                        }
                    } catch(e) {
                        console_logs('redrawSortCond e', e);
                    }


                    break;
                }
            }
        }

    },
});