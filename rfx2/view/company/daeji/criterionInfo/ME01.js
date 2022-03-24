Ext.define('Rfx2.view.company.daeji.criterionInfo.ME01', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'me01',
    initComponent: function () {

        this.initSearchField();

        let buttonToolbar = this.createCommandToolbar();
        var loadUrl = CONTEXT_PATH + '/userMgmt/combst.do?method=read';
        console_logs('loadUrl', loadUrl);



        // remove the items
        (buttonToolbar.items).each(function (item, index, length) {
            if (index == 0 || index == 1 || index == 3 || index == 4 || index == 5) {
                buttonToolbar.items.remove(item);
            }
        });

        this.store = new Ext.data.Store({
            pageSize: 100,
            fields: this.fields,
            proxy: {
                type: 'ajax',
                url: loadUrl,
                reader: {
                    type: 'json',
                    root: 'datas',
                    successProperty: 'success'
                },
                autoLoad: false
            }

        }); 

        this.createGrid(buttonToolbar);

        this.createCrudTab('company-view');

        Ext.apply(this, {
            layout: 'border',
            items: [this.grid, this.crudTab]
        });

        this.callParent(arguments);

        gm.setCenterLoading(false);
        this.store.load();
    }
});
