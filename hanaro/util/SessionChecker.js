Ext.define('Hanaro.util.SessionChecker', {
    alternateClassName: 'SessionChecker',
    singleton : true,
   
    // 세션종료 경고메시지 및 제목
    SESSION_EXPIRE_WARN_MSG         : '세션이 종료되기 1분전입니다. 세션을 유지하시려면 "YES"를 클릭하세요.',
    SESSION_EXPIRE_WARN_TITLE       : '세션이 종료됩니다.',
   
    //세선종료 메시지밎 제목
    SESSION_KILL_TITLE              : '세션이 종료되었습니다.',
    SESSION_KILL_MSG                : '세션이 종료되어 로그인페이지로 이동됩니다.',
   
    //세션 유지 URL 및 종료 URL
    SESSION_KILL_URL                : 'kill.html' ,
    SESSION_REMAIN_URL              : 'remain.html',
   
    //파라미터로 넘어온 세션 유지시간 바탕으로 유지시간, 경고메시지시간, 종료시간 설정.
    init: function(sessionExpireMin){
           var me = SessionChecker;
           me.SESSION_EXPIRE_MIN = sessionExpireMin;
           me.SESSION_EXPIRE_INTERVAL_MIN = me.SESSION_EXPIRE_MIN-1;
           me.SESSION_EXPIRE_BEFORE_MIN = me.SESSION_EXPIRE_MIN - me.SESSION_EXPIRE_INTERVAL_MIN;
           console.log('init');
           console.log('init - 세션 유지시간                 : '+me.SESSION_EXPIRE_MIN+'분');
           console.log('init - 세션유지 Confirm 출력시간     : '+me.SESSION_EXPIRE_INTERVAL_MIN+'분');
           console.log('init - 세션종료 메시지 출력시간      : '+me.SESSION_EXPIRE_BEFORE_MIN+'분');
    },
   
    //Ajax Request가 완료되면 이벤트로 인한 세션체크 시작
    start : function(url){
           var me = SessionChecker;
           console.log('start');
           console.log('start - 요청URL : '+url);
          
           if(url != me.SESSION_KILL_URL){
                   //Ajax Request의 URL이 세션종료 URL이 아니라면
                   //세션종료 경고메시지 테스크 시작
                   console.log('start - 세션유지 URL true');
                   me.sessionCheckConfirmTask.delay(me.toMilliseconds(me.SESSION_EXPIRE_INTERVAL_MIN));

                   //진행중이던 세션종료 테스크는 종료
                   console.log('start - 진행중이던 sessionKillTask 종료');
                   me.sessionKillTask.cancel();
           }else{
                   //Ajax Request의 URL이 세션종료 URL이라면
                   console.log('start - 세션유지 URL false');
                  
                   //세션종료 알림띄우고 로그인페이지로 이동.
                   Ext.Msg.alert(me.SESSION_KILL_TITLE, me.SESSION_KILL_MSG,function(btn){
                          if(btn == 'ok'){
                                  console.log('로그인페이지로 이동.');
                          }
                   });
           }
    },
   
    //세션종료 경고메시지 테스크
    sessionCheckConfirmTask : new Ext.util.DelayedTask(function(){
           var me = SessionChecker;
           Ext.Msg.confirm(me.SESSION_EXPIRE_WARN_TITLE,
                 me.SESSION_EXPIRE_WARN_MSG,
                 function(btn) {
                         if(btn == 'yes'){
                                 //세션유지에 동의할경우
                                 console.log('sessionCheckConfirmTask - 세션유지 true');
                                 me.remainSession();
                         }else{
                                 //세션유지에 동의하지 않을경우
                                 console.log('sessionCheckConfirmTask - 세션유지 false');
                                 me.killSession();
                         }
                 });
                 console.log('sessionCheckConfirmTask -       sessionKillTask 시작');
                  me.sessionKillTask.delay(me.toMilliseconds(me.SESSION_EXPIRE_BEFORE_MIN));
           }),
   
    //세션종료 테스크
    sessionKillTask : new Ext.util.DelayedTask(function(){
                   var me = SessionChecker;
                   me.killSession();
           }),
   
    //밀리세컨드 환산 메소드
    toMilliseconds : function(minute){
           return minute * 1000 * 60;
    },
   
    //세션을 종료 URL호출 Ajax
    killSession : function(){
           console.log('killSession - 세션종료');
           var me = SessionChecker;
           Ext.Ajax.request({
                   url : me.SESSION_KILL_URL,
                   success : Ext.emptyFn,
                   failure : Ext.emptyFn
           });
    },
   
    //세션을 유지 URL호출 Ajax
    remainSession : function(){
           var me = SessionChecker;
           Ext.Ajax.request({
                   url : me.SESSION_REMAIN_URL,
                   success : Ext.emptyFn,
                   failure : Ext.emptyFn
           });
    }
   
});