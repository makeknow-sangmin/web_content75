Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Mplm': 		CONTENT_FULL_PATH + '/class/mplm/',
        'Rfx.base': 	CONTENT_FULL_PATH + '/class/rfx/base/',
        'Rfx.model': 	CONTENT_FULL_PATH + '/class/rfx/model/',
        'Rfx.store': 	CONTENT_FULL_PATH + '/class/rfx/store/',
        'Rfx.view':		CONTENT_FULL_PATH + '/class/rfx/view',
        'Rfx.app':		CONTENT_FULL_PATH + '/class/rfx2/app',
        'Rfx.util':		CONTENT_FULL_PATH + '/class/rfx/util',
        'Ext.ux': 		CONTENT_FULL_PATH + '/common/module/ux',
        'Ext.xdview': 	CONTENT_FULL_PATH + '/common/module/xdview',
        'Hanaro':		CONTENT_FULL_PATH +  '/hanaro'
    }
});

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.Action',
    'Ext.tab.*',
    'Ext.button.*',
    'Ext.form.*',
    'Ext.tree.*',
    'Ext.layout.container.Card',
    'Ext.layout.container.Border',
    'Ext.ux.ajax.SimManager',
    'Ext.ux.PreviewPlugin',
    'Ext.window.MessageBox',
    'Ext.util.History'
]);	
Ext.onReady(function(){
    Ext.getBody().unmask();
    Ext.create('Hanaro.view.setup.SetupPanel', {
        id: 'setupForm',
            renderTo: 'login_template_div'// Ext.getBody()
    });
    
    onWindowSize();
    window.addEventListener('resize', onWindowSize);

}); //Ext.onReady(function(){
function onWindowSize() {
        
      if (typeof (window.innerWidth) == 'number') {
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
      } else {
        if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
          myWidth = document.documentElement.clientWidth;
          myHeight = document.documentElement.clientHeight;
        } else {
          if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
          }
        }
      }
      var loginForm = document.getElementById('login_template_div');

      var setupForm = Ext.getCmp('setupForm');
      console_logs('setupForm width', setupForm.width);
      console_logs('setupForm height', setupForm.height);

      loginForm.style.left = (myWidth- setupForm.width)/2+'px';
      loginForm.style.top  = (myHeight- setupForm.height)/2+'px';
      
     
}
function lfn_gotoMain() {
var url = CONTEXT_PATH + '/index/main.do' + window.location.hash;
    try {
        this.location.href=url;
    } catch(e) {}
    
}