Ext.define('Rfx2.view.company.daeji.criterionInfo.ME06', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'me06',
    initComponent: function () {

        this.initSearchField();

        let searchToolbar = this.createSearchToolbar();
        let buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx2.model.company.bioprotech.ProductVerMgmt', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            gMain.pageSize
            , {
                item_code_dash: 's.item_code',
                comment: 's.comment1'
            },
            ['srcahd']
        );
        this.store.getProxy().setExtraParam('sp_code','H');
        let arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        gm.setCenterLoading(false);
    }
});
