/*

Kanban TaskBoard 2.0.9
Copyright(c) 2009-2016 Bryntum AB
http://bryntum.com/contact
http://bryntum.com/license

*/
//http://www.sencha.com/forum/showthread.php?295892-Ext-JS-5.1-Post-GA-Patches&p=1080371&viewfull=1#post1080371
Ext.define('Sch.patches.View', {
    extend : 'Sch.util.Patch',

    requires   : ['Ext.view.View'],
    target     : 'Ext.view.View',
    minVersion : '5.1.0',

    overrides : {
        handleEvent: function(e) {
            var me = this,
                isKeyEvent = me.keyEventRe.test(e.type),
                nm = me.getNavigationModel();

            e.view = me;

            if (isKeyEvent) {
                e.item = nm.getItem();
                e.record = nm.getRecord();
            }

            // If the key event was fired programatically, it will not have triggered the focus
            // so the NavigationModel will not have this information.
            if (!e.item) {
                e.item = e.getTarget(me.itemSelector);
            }
            if (e.item && !e.record) {
                e.record = me.getRecord(e.item);
            }

            if (me.processUIEvent(e) !== false) {
                me.processSpecialEvent(e);
            }

            // We need to prevent default action on navigation keys
            // that can cause View element scroll unless the event is from an input field.
            // We MUST prevent browser's default action on SPACE which is to focus the event's target element.
            // Focusing causes the browser to attempt to scroll the element into view.

            if (isKeyEvent && !Ext.fly(e.target).isInputField()) {
                if (e.getKey() === e.SPACE || e.isNavKeyPress(true)) {
                    e.preventDefault();
                }
            }
        }
    }
});
