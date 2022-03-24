Ext.define('Rfx.view.purStock.ListPurchaseVersionView', {
    extend: 'Rfx.base.BaseView',
    xtype: 'list-purchase-version-view',
    initComponent: function(){

        this.createStore('Rfx.model.VersionList', [{
	            property: 'po_no',
	            direction: 'ASC'
	        }],
            gMain.pageSize/*pageSize*/
            ,{}
        	, ['cartmap']
            );
            
            var buttonToolbar = Ext.create('widget.toolbar', {
                cls: 'my-x-toolbar-default2',
                items: [
                    
                ]
            });
    
            this.createGridCore([ buttonToolbar ], {
                width: '60%',
                title: '설계 변경'
            });

            this.setGridOnCallback(function(selections) {
                if (selections.length) {
                    rec = selections[0];
                } else {
    
                }
            });

            Ext.apply(this, {
                layout: 'border',
                items: [this.createCenter(), this.createEast()]
            });
		  
       


        this.callParent(arguments);

        //디폴트 로드
        this.store.getProxy().setExtraParam('route_type', 'P');
        gMain.setCenterLoading(false);
        this.store.load(function(records){});

        //grid를 선택했을 때 Callback
        this.setGridOnCallback(function(selections) {

            if (selections.length) {
                var rec = selections[0];
                gMain.selPanel.rec = rec;
                //console_logs('여기', rec);

                var rtgast_uid = rec.get("rtgast_uid");
                var status = rec.get("status");
                var cur_ver = rec.get("ver");
                gm.me().ver = cur_ver;

                this.cartLineStore.getProxy().setExtraParam('rtgastuid', rtgast_uid);
                this.cartLineStore.getProxy().setExtraParam('cur_ver', cur_ver);
                this.cartLineStore.getProxy().setExtraParam('status', status);

                this.cartLineGrid.getStore().load();

                //button grop Setting
                var status = rec.get(status);
                switch(status){
                    case "CR" :
                        // 주문작성 : CR
                        this.editAction.show(), 
                        this.delAction.hide(), 
                        this.cancleAction.show()
                        break;
                    // case "PO" :
                    //     // 주문서별현황

                    //     break;
                    default :
                        // 구매요청접수 : PR
                        this.editAction.show(), 
                        this.delAction.show(), 
                        this.cancleAction.hide()
                        break;
                }
                
           
                       
        }
    });

    },  //end of init

    createCenter: function() {
        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            width: '70%',
            items: [this.grid]
        });

        return this.center;

    },


    createEast: function() {


        this.cartLineStore = Ext.create('Rfx.store.CartVersionStore');

        //하위자재 버튼 그룹
        this.editAction = Ext.create('Ext.Action', {
            iconCls: 'af-edit',
            text: '변경',
            tooltip: '주문 수량 변경',
            handler: this.changeQuanHandler
        });

        this.delAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: gm.getMC('CMD_DELETE', '삭제'),
            tooltip: '아이템 삭제',
            handler: this.addMinPoHandler
        });

        this.cancleAction = Ext.create('Ext.Action', {
            iconCls: 'af-remove',
            text: '주문 취소',
            tooltip: '주문 취소',
            handler: this.addMinPoHandler
        });

        this.saveAction = Ext.create('Ext.Action', {
            iconCls: 'af-save',
            text: '저장',
            tooltip: '변경 사항 저장',
            handler: this.addMinPoHandler
        });

        
    

        var buttonGroup = [ this.editAction, this.delAction, this.cancleAction, '->' , this.saveAction];
        

        var subVersionItems = [
            {
                dock: 'top',
                xtype: 'toolbar',
                cls: 'my-x-toolbar-default2',
                items: buttonGroup
            }

    ];
        
        this.cartLineGrid =
            Ext.create('Rfx.view.grid.ListSubVersion', {
                id: this.link + '-listPurVersion',
                title: '하위자재', // cloud_product_class,
                border: true,
                resizable: true,
                scroll: true,
                collapsible: false,
                store: this.cartLineStore,
                selModel: {
                    checkOnly: false,
                    //injectCheckbox: 'last',
                    mode: 'SIMPLE'
                },
                selType: 'checkboxmodel',
                //renderTo: Ext.getBody(),
                multiSelect: true,
                layout: 'fit',
                forceFit: true,
                dockedItems: subVersionItems,
                viewConfig: { 
                    getRowClass: function(record, rowIndex, rowParams, store){ 
                        
                        
                         var change_type = record.get('change_type');
                         
                            switch(change_type){
                                case "U" :
                                    return 'yellow-row';
                                    break;
                                case "D" :
                                    return 'red-row';
                                    break;
                                default:
                                    return 'gray-row';
                                    break;
                            }
                       
                  } 
              },

            }); //cartLineGrid of End


        // this.cartLineGrid.getSelectionModel().on({
        //     selectionchange: function(sm, selections) {
        //         gUtil.enable(gm.me().addPartAction);
        //         gUtil.enable(gm.me().editAssyAction);
 	
        //         try {
        //             if (selections != null) {
                    	
        //                 var rec = selections[0];
        //                 console_logs('rec>>>>>>>>>>>>>', rec)
        //                 gm.me().classCode = rec.get('class_code');
        //                 gm.me().itemName = rec.get('item_name');
        //                 gm.me().itemCode = rec.get('item_code');
        //                 gm.me().modelNo = rec.get('model_no');
        //                 gm.me().description = rec.get('description');
        //                 gm.me().parent = rec.get('unique_id_long');
        //                 gm.me().parent_uid = rec.get('unique_uid');
        //                 gm.me().reserved_varchar1 = rec.get('item_code');

        //                 parent = rec.get('unique_id_long');
        //                 gm.me().store.getProxy().setExtraParam('parent', parent);
        //                 gm.me().store.getProxy().setExtraParam('parent_uid', -1);
        //                 gm.me().store.getProxy().setExtraParam('ac_uid', -1);
        //                 gm.me().store.getProxy().setExtraParam('orderBy', "pl_no");
        //                 gm.me().store.getProxy().setExtraParam('ascDesc', "ASC");
        //                 gm.me().store.getProxy().setExtraParam('bom_flag', "T");
        //                 gm.me().store.load();

        //             }
        //         } catch (e) {
        //             console_logs('e', e);
        //         }
        //     }
        // });

        this.east = Ext.widget('tabpanel', { //Ext.create('Ext.panel.Panel', {
            layout: 'border',
            border: true,
            region: 'east',
            width: '40%',
            layoutConfig: {
                columns: 2,
                rows: 1
            },

            items: [this.cartLineGrid ]
        });

        return this.east;
    },

    treatAction: function (btn) {
        var cell = btn.up();
            rec = cell.getRecord();

        //rec.set('verified', true);
        Ext.Msg.alert(rec);
    },
	
    items : [],
    poviewType: 'ALL',

    changeQuanHandler : function(btn){
        var cell = btn.up('grid').getSelectionModel().getSelection();
        console_logs("gm.me().ver", gm.me().ver);
        var paramUidQuan = new Array();
        if(cell.length == 0){
            Ext.MessageBox.alert('알림','파트를 선택해주세요.');
        }else{
            
            for(var i=0; i<cell.length;i++){
            
                var unit = new Object();
                var change_type = cell[i].get('change_type');
                var cart_uid = cell[i].get('id');
                var cart_quan = cell[i].get('bm_quan');
    
                if(change_type == "U"){
                    unit.uid = cart_uid;
                    unit.quan = cart_quan;
    
                    paramUidQuan.push(unit);
                }else{
                    Ext.Msg.alert('안내', '변경된 자재가 아닙니다.', function() {});
                }
            }

            Ext.Ajax.request({
                url: CONTEXT_PATH + '/purchase/request.do?method=changePartByVersion',
                params: {
                    version : gm.me().ver,
                    paramUidQuan: JSON.stringify(paramUidQuan)
                },
                success: function(result, request) {
                    Ext.Msg.alert('안내', '변경 완료', function() {});
                },
                failure: extjsUtil.failureMessage
            });


        }
        
        
    }

});


