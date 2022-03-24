Ext.define('Rfx2.view.company.daeji.warehouseMgmt.G2', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'g2',
    initComponent: function () {

        this.initSearchField();

        let searchToolbar = this.createSearchToolbar();
        let buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.Board', [{
                property: 'create_date',
                direction: 'DESC'
            }],
            gm.pageSize
            ,{}
            , ['board']
        );

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
