/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
Ext.define('Kanban.locale.Ko', {
    extend      : 'Sch.locale.Locale',

    singleton : true,

    constructor : function (config) {

        Ext.apply(this , {
            l10n        : {
                'Kanban.menu.TaskMenuItems' : {
                    copy    : '복사',
                    remove  : '삭제',
                    edit    : '수정',
                    states  : '이동',
                    users   : '배차'
                }
            },

            NotStarted : '대기',
            InProgress : '진행중',
            Test       : '검사',
            Done       : '완료'
        });

        this.callParent(arguments);
    }
});
