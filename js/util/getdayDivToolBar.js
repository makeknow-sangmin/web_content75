console_log('loading getdayDivToolBar in util....');
function getdayDivToolBar() {
	var arrDayDivToolBar = [];
	
	arrDayDivToolBar.push(
			{
//				id :'DayDiv',
            	xtype:          'combo',
                mode:           'local',
//                value:          'Day',
                emptyText:		vmf5_choice,
                triggerAction:  'all',
                width:			60,
                forceSelection: true,
                editable:       false,
                fieldStyle: 'background-color: #FBF8E6; background-image: none;',
                name:           'dayDiv',
                displayField:   'name',
                valueField:     'value',
                queryMode: 'local',
                store:          Ext.create('Ext.data.Store', {
                    fields : ['name', 'value'],
                    data   : [
                        {name : dayText,   value: 'Day'}//월
                        ,{name : weekText,   value: 'Week'}//주
                    ]
                }),
                listeners: {
                	select: function (combo, record) {
                		if(vCUR_MENU_CODE == 'VMF5' || vCUR_MENU_CODE == 'VMF6' || vCUR_MENU_CODE == 'VMF7'){
                			dayDiv = record[0].get('value');
                			seLinkAll(selectedTab);
                		}
                	}
                }
			}
	);
	return arrDayDivToolBar;
}