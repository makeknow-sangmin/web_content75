//이클래스는 시스템에서 자동생성된 클래스 입니다. 수정하지 마세요
//this class is automatically created. DO NOT Edit!!!

Ext.define('Hanaro.view.cloudZone.rpims.RpimsIssueView', {
    extend: 'Hanaro.base.HanaroBaseView',
    xtype: 'rpims-issue-view',
    initComponent: function(){
        
        this.initSearchField();
        this.addSearchField('var_name');
        this.addSearchField('description');
        var searchToolbar =  this.createSearchToolbar();
        var buttonToolbar = this.createCommandToolbar();

        this.model = Ext.create('Hanaro.view.cloudZone.rpims.RpimsIssueViewModel', {
            fields: this.fields
        });
        this.createStoreCore(gMain.pageSize);

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