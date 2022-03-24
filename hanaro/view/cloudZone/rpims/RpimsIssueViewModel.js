Ext.define('Hanaro.view.cloudZone.rpims.RpimsIssueViewModel', {
    extend: 'Rfx.model.Base',
    proxy: {
            type: 'ajax',
            api: {
                read: CONTEXT_PATH + '/DynaHanaro/view/cloudZone/rpims/RpimsIssueView.do'
            },
            reader: {
                type: 'json',
                root: 'datas'
            }
        }
});