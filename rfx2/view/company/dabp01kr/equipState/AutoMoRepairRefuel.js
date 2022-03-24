Ext.define('Rfx2.view.company.dabp01kr.equipState.AutoMoRepairRefuel', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'car-repair-refuel-view',
    btnToolbar: null,
    initComponent: function(){
    	

		//검색툴바 필드 초기화
    	this.initSearchField();
    	//검색툴바 추가

		//검색툴바 생성
		var searchToolbar =  this.createSearchToolbar();
		//명령툴바 생성
        var buttonToolbar = this.createCommandToolbar();

        //모델을 통한 스토어 생성
        switch(this.link) {
            case 'CAR2':
                this.createStore('Rfx.model.AutoMoRefuel', [{
                        property: 'user_name',
                        direction: 'ASC'
                    }],
                    gMain.pageSize
                    ,{}
                    , ['refuel']
                );
                break;
            case 'CAR4':
                this.createStore('Rfx.model.AutoMoRepair', [{
                        property: 'user_name',
                        direction: 'ASC'
                    }],
                    gMain.pageSize
                    ,{}
                    , ['refuel']
                );
                break;
        }


        //그리드 생성
        var arr=[];
        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.btnToolbar = arr;

        //grid 생성.
        this.createGrid(arr);
        
        //입력/상세 창 생성.
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);
        
        //디폴트 로드
        gm.setCenterLoading(false);

		this.storeLoad();
    },

    createCenter: function() {

        var cellEditing = new Ext.grid.plugin.CellEditing({ clicksToEdit: 1 });

        var autoMoRepairStore = Ext.create('Mplm.store.AutoMoRefuelStore');

        var paging = Ext.create('Ext.PagingToolbar', {
            store: autoMoRepairStore,
            displayInfo: true,
            displayMsg: '범위: {0} - {1} [ 전체:{2} ]',
            emptyMsg: "표시할 항목이 없습니다."
            ,listeners: {
                beforechange: function (page, currentPage) {
                    this.getStore().getProxy().setExtraParam('start', (currentPage-1)*gMain.pageSize);
                    this.getStore().getProxy().setExtraParam('page', currentPage);
                    this.getStore().getProxy().setExtraParam('limit', gMain.pageSize);
                }
            }
        });


        this.removeAction.enable();
        this.editAction.enable();
        this.copyAction.enable();

        this.gridRefuel = Ext.create('Ext.grid.Panel', {
            store: autoMoRepairStore,
            plugins: [cellEditing],
            selModel: Ext.create("Ext.selection.CheckboxModel"),
            title: '주유정보',
            width : '60%',
            columns: this.columns_map['RFL'],
            margin: '0 5 0 0',
            bbar: paging,
            listeners: {

            },
            dockedItems: [
                this.createCommandToolbar(),
                this.createSearchToolbar()
            ]
        });

        this.grid.title = '수리정보';

        this.center = Ext.widget('tabpanel', {
            layout: 'border',
            border: true,
            region: 'center',
            tabPosition: 'top',
            items: [this.grid, this.gridRefuel],
            listeners: {
                beforetabchange: function(tabs, newTab, oldTab) {
                    switch(newTab.title) {
                        case '주유정보':
                            gm.me().store = autoMoRepairStore;
                            gm.me().storeLoad();
                            break;
                        default:
                            gm.me().store = gm.me().grid.getStore();
                            gm.me().storeLoad();
                            break;
                    }
                }
            }
        });

        return this.center;
    }
});
