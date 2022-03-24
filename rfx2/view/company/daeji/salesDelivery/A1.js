Ext.define('Rfx2.view.company.daeji.salesDelivery.A1', {
    extend: 'Rfx2.base.BaseViewV2',
    xtype: 'a1',
    initComponent: function () {

        this.initSearchField();

        let searchToolbar = this.createSearchToolbar();
        let buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.Board',
            [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize
            ,{}
            , ['board']
        );

        this.createGrid([buttonToolbar, searchToolbar]);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        gm.setCenterLoading(false);
    }
});
