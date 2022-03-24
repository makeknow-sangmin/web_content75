Ext.define('Rfx2.view.company.scon.produceMgmt.PrepareMtrlMgmtView', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'prepare-mtrl-mgmt-view',
    initComponent: function() {

        //모델을 통한 스토어 생성
        this.createStore('Rfx2.model.company.kbtech.PrepareMtrlMgmt', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gMain.pageSize,/*pageSize*/
            null, ['rtgast']

        );

        //검색툴바 필드 초기화
        this.initSearchField();
        //검색툴바 추가

        //검색툴바 생성
        var searchToolbar =  this.createSearchToolbar();
        //명령툴바 생성
        var buttonToolbar = this.createCommandToolbar({
            REMOVE_BUTTONS : ['REGIST', 'EDIT', 'COPY', 'REMOVE']
        });

        buttonToolbar.insert(1, this.removeAction);

        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        //grid 생성.
        this.createGrid(arr);

        //입력/상세 창 생성.
        this.createCrudTab();

        this.cartmapStore = Ext.create('Rfx2.store.company.kbtech.CartLineWithTrStore', {});

        this.gridViewTable = Ext.create('Ext.grid.Panel', {
            cls : 'rfx-panel',
            store: this.cartmapStore,
            multiSelect: false,
            region: 'center',
            autoScroll : true,
            autoHeight: true,
            border: true,
            padding: '0 0 0 0',
            flex: 1,
            layout:'fit',
            forceFit: false,
            columns: [
                {
                    text: '상태',
                    width: 90,
                    dataIndex: 'status_purchase_k',
                    renderer : function(value, meta) {
                        switch(value) {
                            case '구매요청':
                                meta.style = "background-color:#2c3e50;color:#ffffff;text-align:center";
                                break;
                            case '구매요청완료':
                                meta.style = "background-color:#7f8c8d;color:#ffffff;text-align:center";
                                break;
                            case '주문작성':
                                meta.style = "background-color:#d35400;color:#ffffff;text-align:center";
                                break;
                            case '입고중':
                                meta.style = "background-color:#f39c12;color:#ffffff;text-align:center";
                                break;
                            case '불출요청':
                                meta.style = "background-color:#9b59b6;color:#ffffff;text-align:center";
                                break;
                            case '불출중':
                                meta.style = "background-color:#27ae60;color:#ffffff;text-align:center";
                                break;
                            case '불출완료':
                                meta.style = "background-color:#2980b9;color:#ffffff;text-align:center";
                                break;
                        }

                        return value;
                    }
                },
                {
                    text: '품번',
                    width: 110,
                    dataIndex: 'item_code'
                },
                {
                    text: '품명',
                    width: 220,
                    dataIndex: 'item_name'
                },
                {
                    text: '규격',
                    width: 240,
                    dataIndex: 'specification'
                },
                {
                    text: '제조사',
                    width: 100,
                    dataIndex: 'maker_name'
                },
                {
                    text: '공급사',
                    width: 100,
                    dataIndex: 'seller_name'
                },
                {
                    text: '단위수량',
                    width: 100,
                    dataIndex: 'quan'
                },
                {
                    text: '요청수량',
                    width: 100,
                    dataIndex: 'pr_quan'
                },
                {
                    text: '불출수량',
                    width: 100,
                    dataIndex: 'outbound_qty'
                },
                {
                    text: '구매수량',
                    width: 100,
                    dataIndex: 'purchase_qty'
                },
                {
                    text: '입고수량',
                    width: 100,
                    dataIndex: 'gr_qty'
                },
                {
                    text: '입고예정일',
                    width: 100,
                    dataIndex: 'req_delivery_date',
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                },
                {
                    text: '입고일',
                    width: 100,
                    dataIndex: 'gr_date',
                    renderer : Ext.util.Format.dateRenderer('Y-m-d')
                }
            ]
        });


        this.grid.forceFit = true;

        Ext.apply(this, {
            layout: 'border',
            items: [{
                //title: '제품 및 템플릿 선택',
                collapsible: false,
                frame: false,
                region: 'west',
                layout: {
                    type: 'hbox',
                    pack: 'start',
                    align: 'stretch'
                },
                margin: '5 0 0 0',
                width: '30%',
                items: [{
                    region: 'west',
                    layout: 'fit',
                    margin: '0 0 0 0',
                    width: '100%',
                    items: [this.grid]
                }]
            }, this.gridViewTable]
        });

        this.callParent(arguments);

        //디폴트 로드
        gm.setCenterLoading(false);

        this.storeLoad();

        this.grid.getSelectionModel().on({
            selectionchange: function(sm, selections) {
               if(selections.length == 1) {
                   var selection = selections[0];
                   gm.me().cartmapStore.getProxy().setExtraParam('rtgastuid', selection.get('unique_id_long'));
                   gm.me().cartmapStore.getProxy().setExtraParam('use_tr_uid', 'Y');
                   gm.me().cartmapStore.load();
               }
            }
        });
    }
});