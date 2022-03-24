
Ext.define('Rfx.model.StockRackTask', {
    extend: 'Kanban.model.Task',

    states: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20'
    ],
    // Move tasks freely
    isValidTransition: function(state) {
        return true;
    }
})