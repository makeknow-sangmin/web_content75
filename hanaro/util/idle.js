var timerId = null;
var timer = function(callback, delay) {
  window.clearTimeout(timerId);
  timerId = window.setTimeout(callback, delay);
};
var idle = function() {
  timer(function() {
      //console.log(new Date());
      Ext.Ajax.request({
          scope : this,
          url : CONTEXT_PATH	+ '/simple.do?method=touch',
          failure:  function() {
              window.clearTimeout(timerId);
              Ext.MessageBox.show({
                  title: '세션 종료',
                  msg: '세션이 종료되었습니다.<br> 종료시간 : ' + gu.yyyymmdd(new Date(), '-') + ' ' + gu.hhmmss(new Date()),
                  buttons: Ext.MessageBox.OK,
                  icon: Ext.MessageBox.WARNING,
                  fn: function(btn){
                      document.GeneralBaseForm1.action=CONTEXT_PATH + '/index/main.do';
                      document.GeneralBaseForm1.submit();
                  }
              });
          }
      });
      idle();
  }, 10000);
};
idle();