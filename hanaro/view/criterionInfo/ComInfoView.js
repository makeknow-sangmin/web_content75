Ext.define('Hanaro.view.criterionInfo.ComInfoView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'company-view',
    initComponent: function(){
        
        this.initSearchField();
        this.addSearchField('var_name');
        this.addSearchField('description');
        var searchToolbar =  this.createSearchToolbar();

        // 메뉴그리드 초기화
        this.resetMenugrid = Ext.create('Ext.Action', {
            iconCls: 'af-plus-circle',
            text: '메뉴그리드 초기화',
            tooltip: '메뉴그리드 초기화합니다.',
            disabled: false,
            handler: function () {
                Ext.Ajax.request({
                    url: CONTEXT_PATH + '/admin/menu.do?method=resetMenuUser',
                    params:{
                    },
                    success : function(response, request) {
                        Ext.Msg.alert('안내', '메뉴그리드 초기화 완료', function() {
                        });
                    },
                    failure: function(val, action){
                        alert('메뉴그리드 초기화 실패');
                    }
                })  // end of ajax
            }
        });

        var buttonToolbar = this.createCommandToolbar();
        buttonToolbar.insert(6, this.resetMenugrid);
        buttonToolbar.insert(6, '-');

        var loadUrl = CONTEXT_PATH + '/DynaHanaro/view/criterionInfo/ComInfoView.do';
        
        this.store = new Ext.data.Store({
            pageSize: 100,
            fields: this.fields,
            proxy: {
                type: 'ajax',
                url: loadUrl,
                reader : {
    				type : 'json',
    				root : 'datas',
    				successProperty : 'success'
    			},
                autoLoad: false
            }
            
        });
        
        //grid 생성.
        this.createGrid([buttonToolbar, searchToolbar]);
        
        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid,  this.crudTab]
        });
        this.callParent(arguments);

        gMain.setCenterLoading(false);
        this.store.load(function(records){

        });
    }
});