Ext.define('Rfx2.view.company.daeji.criterionInfo.ME12', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'me12',
    initComponent: function () {

        this.initSearchField();
        // this.addSearchField('unique_id');
        this.addSearchField('user_id');
        this.addSearchField('user_name');
        this.addSearchField('email');

        let searchToolbar = this.createSearchToolbar();
        let buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.UsrAst', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
            10000/*pageSize*/
            , {}
            , ['usrast']
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
