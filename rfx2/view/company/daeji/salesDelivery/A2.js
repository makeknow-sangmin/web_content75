Ext.define('Rfx2.view.company.daeji.salesDelivery.A2', {
    extend: 'Rfx2.base.BaseView',
    xtype: 'a2',
    initComponent: function () {

        this.initSearchField();

        let searchToolbar = this.createSearchToolbar();
        let buttonToolbar = this.createCommandToolbar();

        this.createStore('Rfx.model.BuyerList', [{
            property: 'unique_id',
            direction: 'DESC'
        }],
        gMain.pageSize/*pageSize*/,{}
        ,['combst']
        );

        // (buttonToolbar.items).each(function (item, index, length) {
        //     if (index == 1 || index == 2 || index == 3 || index == 4 || index == 5) {
        //         buttonToolbar.items.remove(item);
        //     }
        // });

        // const createAction/*this.registAction*/ = Ext.create('Ext.Action', {
        //     iconCls: 'af-plus-circle',
        //     text: '등록',
        //     tooltip: '신규 등록하기',
        //     hidden: gu.setBtnHiddenProp(2),
        //     //toggleGroup: 'toolbarcmd',
        //     handler: function () {
        //         gm.me().grid.getSelectionModel().deselectAll();
        //         gm.me().setActiveCrudPanel('CREATE');
        //         // gm.me().crudTab.expand();
        //         switch (gm.me().link) {
        //             case 'EMC1_DS':
        //             case 'EMC1_DS2':
        //                 gMain.loadFileAttach(vCUR_USER_UID + 1000 * gMain.selNode.id, gMain.selectedMenuId + 'designFileAttach');
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // });
        // const editAction/*this.editAction*/ = Ext.create('Ext.Action', {
        //     iconCls: 'af-edit',
        //     text: '수정',
        //     tooltip: '수정하기',
        //     hidden: gu.setBtnHiddenProp(2),
        //     toggleGroup: 'toolbarcmd',
        //     disabled: true,
        //     handler: function () {
        //         gm.me().setActiveCrudPanel('EDIT');
        //         gm.me().toggleSelectedUidForm();
        //         switch (gm.me().link) {
        //             case 'SRO3_CLD':
        //                 switch (vCompanyReserved4) {
        //                     case 'MKEE01KR':
        //                         gm.me().setMkeRecvPoAdditionalInfo();
        //                         break;
        //                 }
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // });
        // const copyAction/*this.copyAction*/ = Ext.create('Ext.Action', {
        //     iconCls: 'af-copy',
        //     text: '복사등록',
        //     tooltip: '복사하여 등록하기',
        //     hidden: gu.setBtnHiddenProp(2),
        //     toggleGroup: 'toolbarcmd',
        //     disabled: true,
        //     handler: function () {
        //         gm.me().setActiveCrudPanel('COPY');
        //         gm.me().toggleSelectedUidForm();
        //         gm.me().copyCallback();
        //         switch (gm.me().link) {
        //             case 'EMC1_DS':
        //             case 'EMC1_DS2':
        //                 gMain.loadFileAttach(vCUR_USER_UID + 1000 * gMain.selNode.id, gMain.selectedMenuId + 'designFileAttach');
        //                 break;
        //             case 'SRO3_CLD':
        //                 switch (vCompanyReserved4) {
        //                     case 'MKEE01KR':
        //                         gm.me().setMkeRecvPoAdditionalInfo();
        //                         break;
        //                 }
        //                 break;
        //             default:
        //                 break;
        //         }
        //     }
        // });
        // const removeAction/*this.removeAction*/ = Ext.create('Ext.Action', {
        //     iconCls: 'af-remove',
        //     text: CMD_DELETE,
        //     tooltip: CMD_DELETE,
        //     hidden: gu.setBtnHiddenProp(4),
        //     disabled: true,
        //     handler: function (widget, event) {
        //         Ext.MessageBox.show({
        //             title: CMD_DELETE,
        //             msg: gm.me().getMC('vst1_delete', '선택한 항목을 삭제하시겠습니까?'),
        //             //msg: '선택한 항목을 삭제하시겠습니까?',
        //             buttons: Ext.MessageBox.YESNO,
        //             fn: gm.me().deleteConfirm,
        //             icon: Ext.MessageBox.QUESTION
        //         });
        //     }
        // });

        // buttonToolbar.insert(1, createAction);
        // buttonToolbar.insert(2, editAction);
        // buttonToolbar.insert(3, copyAction);
        // buttonToolbar.insert(4, removeAction);

        const createSidePanel = () => {
            let formPanel = this.createFormPane('REGIST');


            let sidePanel = Ext.create('Ext.panel.Panel', {
                title: '상세정보',
                width: '100%',
                layout: 'fit',
                items: [
                    formPanel
                ]
            })
            return sidePanel;
        }


        let arr = [];

        arr.push(buttonToolbar);
        arr.push(searchToolbar);

        this.createGrid(arr);

        this.createCrudTab();

        Ext.apply(this, {
            layout: 'border',
            items: [
                {
                    layout: 'fit',
                    region: 'west',
                    width: '70%',
                    // height: '100%',
                    items: [this.grid]
                },
                // this.grid, 
                // this.crudTab, 
                {
                    layout: 'fit',
                    region: 'east',
                    width: '30%',
                    items: [createSidePanel()]
                },
            ]
        });

        this.callParent(arguments);
        this.store.load();
        gm.setCenterLoading(false);
    },
});
