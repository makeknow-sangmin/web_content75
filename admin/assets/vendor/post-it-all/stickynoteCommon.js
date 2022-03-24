var count = 0;
$.MemoManager = {
	messageQty: 0, //생성된 메세지 숫자.
	// Debug
	debugging : true, // or true
	USE_CONSOLE_LOGS: false,
	buffer : {},
	allUserlist: [],
	curUserId : -1,
	curUserName: '',
	message_server: '',
	wa_code: '',
	memoObjectList : [],
	waHdeml: function() {
		var subUrl = '/HDEL/'+ this.wa_code + '-';
		//console.log('waHdeml', subUrl);
		return subUrl;
	},
	waZrem: function() {
		var subUrl = '/ZREM/'+ this.wa_code + '-';
		//console.log('waZrem', subUrl);
		return subUrl;
	},
	waHgetall: function() {
		var subUrl = '/HGETALL/'+ this.wa_code + '-';
		//console.log('waHgetall', subUrl);
		return subUrl;
	},
	waHset: function() {
		var subUrl = '/HMSET/'+ this.wa_code + '-';
		//console.log('waHset', subUrl);
		return subUrl;
	},
	waZadd: function() {
		var subUrl = '/ZADD/'+ this.wa_code + '-';
		//console.log('waZadd', subUrl);
		return subUrl;
	},
	waZrangebyscore: function() {
		var subUrl = '/ZRANGEBYSCORE/'+ this.wa_code + '-';
		//console.log('waZrangebyscore', subUrl);
		return subUrl;
	},

	console_log: function(val) {	try {console.log(val);	} catch(e) {}},

	console_logs: function(tag, val) {
		if(USE_CONSOLE_LOGS==true) {	try { console.log(tag + '(' + typeof(val) + ')', val);	} catch(e) {}	}},
	console_logs_dummy:	function (tag, val) { },

	view_type: (myenv.memoviewType == null) ? 'menuItem_cur_only' : myenv.memoviewType ,

	//메모뷰타입
	getMemoviewType: function() {
		return (this.view_type==null) ? 'menuItem_cur_only' : this.view_type;
	},
	setMemoviewType : function(val) {
		this.view_type = val;
	},
	getMemoviewTypename: function() {
		var type = this.getMemoviewType();
		//console_logs('memoviewType', type);
		switch(type) {
			case 'menuItem_view_all':
				return '모두 보기';
			case 'menuItem_cur_only':
				return '현재 메모';
			case 'menuItem_hide_all':
				return '모두 끄기';
			default:
				return '----';
		}
	},
	init: function(message_server, curUserId, curUserName, wa_code) {
		this.view_type = (myenv.memoviewType == null) ? 'menuItem_cur_only' : myenv.memoviewType ;
		this.message_server = message_server;
		this.curUserId = curUserId;
		this.curUserName = curUserName;
		this.wa_code = wa_code;
		console.log('this.curUserName', this.curUserName);
		if (typeof console === "undefined") {
			console = {
				log: function () { return undefined; }
			};
		} else if (!this.debugging || console.log === undefined) {
			console.log = function () { return undefined; };
		}
		//console.log('start setInterval', count);
		this.touch();
		mouseMoveFlag = true;
		// setInterval( function () {
		// 	//console.log('count', count);
		// 	//mouse가 움직일때만
		// 	if(mouseMoveFlag == true) {
		// 		//새로운 메세지 검색
		// 		mm.readMymessage(mm.curUserId);
		// 		//보낸메세지 리프레시
		// 		mm.refreshMessageAll();
		// 		mouseMoveFlag = false;
		// 	}
		// 	count++;
        //
		// }, 1000);
	},
	getBrowserName : function () {
		var agt = navigator.userAgent.toLowerCase();
		if (agt.indexOf("chrome") != -1) return 'Chrome';
		if (agt.indexOf("opera") != -1) return 'Opera';
		if (agt.indexOf("staroffice") != -1) return 'Star Office';
		if (agt.indexOf("webtv") != -1) return 'WebTV';
		if (agt.indexOf("beonex") != -1) return 'Beonex';
		if (agt.indexOf("chimera") != -1) return 'Chimera';
		if (agt.indexOf("netpositive") != -1) return 'NetPositive';
		if (agt.indexOf("phoenix") != -1) return 'Phoenix';
		if (agt.indexOf("firefox") != -1) return 'Firefox';
		if (agt.indexOf("safari") != -1) return 'Safari';
		if (agt.indexOf("skipstone") != -1) return 'SkipStone';
		if (agt.indexOf("msie") != -1) return 'Internet Explorer';
		if (agt.indexOf("netscape") != -1) return 'Netscape';
		if (agt.indexOf("mozilla/5.0") != -1) return 'Mozilla';
	},

	getInternetExplorerVersion : function () {
		/*console_logs*/mm.console_logs('navigator', navigator);
		var rv = -1; // Return value assumes failure.
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return rv;
	},

	getObjectByid: function(id) {
		console.log('getObjectByid id', id);
		for(var i=0; i<this.memoObjectList.length; i++) {
			var o = this.memoObjectList[i];
			console.log('getObjectByid o', o);
			if(o.options.id == id) {
				return o;
			}
		}

		return null;
	},

	refreshMessageAll: function() {
		for(var i=0; i<this.memoObjectList.length; i++) {
			var o = this.memoObjectList[i];

			//console.log('getObjectByid o id', o.options.id);

		}
	},


	//Function to convert hex format to a rgb color
	rgb2hex: function(rgb){
		rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
		return (rgb && rgb.length === 4) ? "#" +
		("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
		("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	},

	colorToHex : function (color) {
		console.log('color', color);
		if (color.substr(0, 1) === '#') {
			return color;
		}
		var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

		var c = '';
		if(digits==null) {
			c = this.rgb2hex(color);
		} else {
			var red = parseInt(digits[2]);
			var green = parseInt(digits[3]);
			var blue = parseInt(digits[4]);

			var rgb = blue | (green << 8) | (red << 16);
			c = digits[1] + '#' + rgb.toString(16);
		}
		console.log('c', c);
		return c;
	},



	addZero : function (i) {
		if (i < 10) {
			i = "0" + i;
		}
		return i;
	},

	getActualFullDate : function () {
		var d = new Date();
		var day = this.addZero(d.getDate());
		var month = this.addZero(d.getMonth() + 1);
		var year = this.addZero(d.getFullYear());
		var h = this.addZero(d.getHours());
		var m = this.addZero(d.getMinutes());
		var s = this.addZero(d.getSeconds());
		return year + '-' + month + '-' + day + " " + h + ":" + m + ":" + s;
	},


	//메세지 삭제
	delete_message : function(id) {
		var url = this.message_server + this.waHdeml() + 'SIMPLEMSG:' + id + '/message';
		console.log('delete_message', url);
		$.getJSON(url, function(data){
			/*console_logs*/mm.console_logs('메세지 데이타가 삭제되었습니다.', data);
		});
	},

	//아이디 삭제
	delete_id : function(key, id) {
		var url = this.message_server + this.waZrem() + '' + key + '/' + id;
		console.log('delete_id', url);
		$.getJSON(url, function(data){
			/*console_logs*/mm.console_logs('아이디 삭제 ' + key + ' : ', id);
			/*console_logs*/mm.console_logs('아이디가 삭제되었습니다.', data);
		});
	},

	readSetMsg : function (id, callback) {
		var url = this.message_server + this.waHgetall() + 'SIMPLEMSG:' + id;
		console.log('readSetMsg', url);
		var curId = id;
		$.getJSON(url, function (data, success, obj) {

			var vo = null;
			var message = data.HGETALL.message;
			if(message!=null) {
				try {
					var vo = jQuery.parseJSON(message);
				} catch(e) {
					/*console_logs*/mm.console_logs('vo parse error data', data);
					/*console_logs*/mm.console_logs('vo parse error', message);
				}

				if(vo.id==null) {
					vo.id = curId;
					vo.isNull = true;
				}

			} else {
				vo = {id : curId, isNull: true};
			}
			callback(vo);
		});
	},


	deleteObject : function (id, perment) {
		/*console_logs*/mm.console_logs('deleteObject id', id);
		/*console_logs*/mm.console_logs('deleteObject perment', perment);


		//영구 삭제
		if(perment == true) {
		} else { //DB에 저장


			this.readSetMsg(id, function (vo) {

				/*console_logs*/mm.console_logs('REDIS vo', vo);

				var url = CONTEXT_PATH + '/collab/simpleMsg.do?method=addNewMsg';

				vo.invisible_flag = 'Y';

				$.ajax({
					url: url,
					type: "post",
					data: vo,
					dataType: 'json',
					success: function (id) {
						/*console_logs*/mm.console_logs('db saved id', id);

					},
					error: function (error) {
						/*console_logs*/mm.console_logs('error', error);

					}
				});

			});

		}

		//메세지 삭제
		this.delete_message(id);
		//아이디 삭제
		this.delete_id('USER_UID_M_' + this.curUserId, id);

		//ObjectList 삭제
		this.memoObjectList = $.grep(this.memoObjectList, function(value) {
			return value.id != id;
		  });
	},

	checkRead : function (id) {

		console.log('checkRead id', id);
		this.readSetMsg(id, function (inVo) {
			//이미 읽음 체크했는지 확인.
			console.log('inVo', inVo);
			console.log('inVo.title', inVo.title);
			var index = inVo.title.search("(읽음)");
			if(index == -1) {
				inVo.title = inVo.from_name + '(읽음)';
				inVo.message = inVo.message + '<br><u><i>읽은시간: ' + mm.getActualFullDate() +'</i></u>';

				mm.saveSetMsg(id, inVo, function (hmset) {
					/*console_logs*/mm.console_logs('updateState hmset', hmset);
				});
			}
		});

	},

	checkBlock : function (id, b) {

		/*console_logs*/mm.console_logs('checkBlock unique_id', id);
		/*console_logs*/mm.console_logs('checkBlock b', b);
		if(b==false) {
			var o = mm.getObjectByid(id);
			console.log('checkBlock o', o);
			checkRead(o.options.parent_uid);
		}
	},

	updateColorMsg : function(rawId, message) {
			//	/*console_logs*/mm.console_logs("onRelease key", id);
			$('#the_notes').children('div').each(function (i) {
				//	/*console_logs*/mm.console_logs("onRelease each id", $(this)[0].id);
				var o = $(this)[0];
				if ('#' + o.id == rawId) {
					var background = o.style.backgroundColor;
					var color = o.style.color;
					/*console_logs*/mm.console_logs('background', background);
					/*console_logs*/mm.console_logs('color', color);

					var unique_id = rawId.substring($.fn.postitall.globals.prefix.length);



					mm.readSetMsg(unique_id, function (inVo) {
						inVo['background'] = background;
						inVo['color'] = color;
						inVo['message'] = message;
						mm.saveSetMsg(unique_id, inVo, function (hmset) {
							/*console_logs*/mm.console_logs('updateColorMsg hmset', hmset);
						});
					});



				}
			});
	},

	createMsg : function (vo) {

		/*console_logs*/mm.console_logs('createMsg title', vo.title);
		/*console_logs*/mm.console_logs('createMsg vo', vo);
		/*console_logs*/mm.console_logs('createMsg blocked', vo.blocked);
		/*console_logs*/mm.console_logs('createMsg fixed', vo.fixed);

		var o = $.PostItAll.new({
			id: vo.id,
			title: vo.title,
			files: (vo.files==null)? '' : vo.files,
			from_name: vo.from_name,
			content: vo.message,
			msg_type: vo.msg_type,
			receiver_uid: vo.receiver_uid,
			owner_uid: vo.owner_uid,
			parent_uid: vo.parent_uid,
			space: vo.space,
			spaceTitle: vo.spaceTitle, //document.title,
			link: vo.link,
			width: (vo.left==null || vo.left <0) ? 300 : vo.width,
			height: (vo.height==null || vo.height <0) ? 200 : vo.height,
			posX: (vo.left==null || vo.left <0) ? 50*this.messageQty : vo.left,
			posY: (vo.top==null || vo.top <0) ? 50*this.messageQty : vo.top,

			flags: {
				blocked: vo.blocked,
				expand: vo.expnd,
				fixed: vo.fixed,
				hidden: vo.hidden,
				highlight: vo.highlight,
				minimized: vo.minimized
			},
			style: {
				backgroundcolor: vo.background,
				textcolor: vo.color
			},
			//Event 처리
			onCreated: function (rawId, options, obj) {
				var o = $(obj)[0];
				var unique_id = rawId.substring($.fn.postitall.globals.prefix.length);
				mm.updateObject(rawId, o, null);
			},
			onChange: function (rawId, tag) {
				/*console_logs*/mm.console_logs("onChange", tag);
				var unique_id = rawId.substring($.fn.postitall.globals.prefix.length);

				var message = $("#pia_editable_" + unique_id).html();
				/*console_logs*/mm.console_logs('onChange message', message);

				//Message Buffering
				mm.buffer[rawId] = message;

				//update Color;
				mm.updateColorMsg(rawId, message);


			},
			onSelect: function (id) {
				//   /*console_logs*/mm.console_logs("onSelect id", id);
			},

			onBlock: function (id, b) {
				/*console_logs*/mm.console_logs("onBlock id", id);
				/*console_logs*/mm.console_logs("onBlock b", b);
				if(b==false) {
					var o = mm.getObjectByid(id);
					console.log('checkBlock o', o);
					mm.checkRead(o.options.parent_uid);
				}
				mm.updateState(id, 'blocked', b);
			},
			onMinimized: function (id, b) {
				/*console_logs*/mm.console_logs("onMinimized id", id);
				/*console_logs*/mm.console_logs("onMinimized b", b);
				mm.updateState(id, 'minimized', b);
			},
			onFixed: function (id, b) {
				/*console_logs*/mm.console_logs("onFixed id", id);
				/*console_logs*/mm.console_logs("onFixed b", b);
				mm.updateState(id, 'fixed', b);
			},
			onExpand: function (id, b) {
				/*console_logs*/mm.console_logs("onExpand id", id);
				/*console_logs*/mm.console_logs("onExpand b", b);
				mm.updateState(id, 'expand', b);
			},

			onDblClick: function (id) {
				//  /*console_logs*/mm.console_logs("onDblClick id", id);
			},
			onRelease: function (rawId) {
				///*console_logs*/mm.console_logs("onRelease id", id);

				var unique_id = rawId.substring($.fn.postitall.globals.prefix.length);
				if (mm.buffer[rawId] != undefined) {
					var message = mm.buffer[rawId];
					$("#pia_editable_" + unique_id).html(message);

				}
				var message = $("#pia_editable_" + unique_id).html();

				//	/*console_logs*/mm.console_logs("onRelease key", id);
				$('#the_notes').children('div').each(function (i) {
					//	/*console_logs*/mm.console_logs("onRelease each id", $(this)[0].id);
					var o = $(this)[0];
					if ('#' + o.id == rawId) {
						mm.updateObject(rawId, o, message);
					}
				});
			},
			onDelete: function (id) {
				///*console_logs*/mm.console_logs("onDelete");
			}
		});

		//o.refreashFiles(vo.id, vo.files);
		this.memoObjectList.push(o);
		console.log('memoObjectList push o', o);
		this.messageQty++;
		console.log('memoObjectList push messageQty', this.messageQty);

	},

	updateState : function(id, key, value) {
		this.readSetMsg(id, function (inVo) {
			inVo[key] = value;
			mm.saveSetMsg(id, inVo, function (hmset) {
				/*console_logs*/mm.console_logs('updateState hmset', hmset);
			});
		});
	},

	updateSetMsg : function (id, vo, callback) {

		this.readSetMsg(id, function (inVo) {

			for (key in vo) {
				inVo[key] = vo[key];
			}
			mm.saveSetMsg(id, inVo, function (hmset) {
				///*console_logs*/mm.console_logs('updateSetMsg hmset', hmset);
			});
			callback(inVo);
		});
	},

	saveSetMsg : function (id, vo, callback) {

		vo.change_date = this.getActualFullDate();
		var sendMsg = JSON.stringify(vo);
		sendMsg = encodeURIComponent(sendMsg);

		var url = this.message_server + this.waHset() + 'SIMPLEMSG:' + id
			+ '/message/' + sendMsg
			;
		;
		console.log('saveSetMsg', url);

		$.getJSON(url, function (data) {
			///*console_logs*/mm.console_logs('urlSaveMessage', urlSaveMessage);
			///*console_logs*/mm.console_logs('saveSetMsg data', data);
			// readSetMsg(id, function (vo) {
			// 	/*console_logs*/mm.console_logs('검증결과 저장 내용 vo', vo);
			// });
			callback(data.HMSET);
		});

	},


	updateObject : function (id, o, message) {

		// /*console_logs*/mm.console_logs('updateObject o', o)
		// /*console_logs*/mm.console_logs( 'target style', o.style);
		var backgroundColor = o.style.backgroundColor;
		var color = o.style.color;
		var height = o.style.height.replace("px", "");
		var left = o.style.left.replace("px", "");
		var top = o.style.top.replace("px", "");
		var width = o.style.width.replace("px", "");

		var unique_id = id.substring($.fn.postitall.globals.prefix.length);

		// var message = $( "#pia_editable_" + unique_id ).html();
		// /*console_logs*/mm.console_logs('message', message);
		// /*console_logs*/mm.console_logs('unique_id', unique_id);
		// /*console_logs*/mm.console_logs('message', message);
		/*console_logs*/mm.console_logs('background', backgroundColor);
		/*console_logs*/mm.console_logs('color', color);
		// /*console_logs*/mm.console_logs('height', parseInt(height));
		// /*console_logs*/mm.console_logs('left', parseInt(left));
		// /*console_logs*/mm.console_logs('top', parseInt(top));
		// /*console_logs*/mm.console_logs('width', parseInt(width));
		var data = {
			unique_id: unique_id,
			background: backgroundColor,
			color: color,
			height: parseInt(height),
			left: parseInt(left),
			top: parseInt(top),
			width: parseInt(width)
		};
		if (message != null) {
			var message = message.replace(/<table border="0"/gi, '<table border="1"  style="border-color:' + color + '" ');
			$("#pia_editable_" + unique_id).html(message);
			data['message'] = message;
		}

		this.updateSetMsg(unique_id, data, function (vo) {
			/*console_logs*/mm.console_logs('updateObject updateSetMsg', vo);
		});

	},

	getLastId : function(callback) {

		var url = this.message_server + '/INCR/seq_simplemsg';
		console.log('getLastId', url);

		$.getJSON(url, function (data) {
			var lastUid = data.INCR;
			callback(lastUid);
		});
	},

	putUniqueId : function (lastUid, owner_uid, type/*S,M*/) {

		var owserString = type + '_' + owner_uid;
		var url = this.message_server + this.waZadd() + 'USER_UID_' + owserString + '/0/' + lastUid;
		console.log('putUniqueId', url);
		$.getJSON(url, function (result) {
			/*console_logs*/mm.console_logs('putUniqueId', result);
		});
	},

	makeMessage:  function (lastUid, from_name, title, receiver_uid, owner_uid, parent_uid, message, msg_type, space, link, top, left, width, height, index, files) {

			/*console_logs*/mm.console_logs('lastUid', lastUid);
			var vo = {
				id: lastUid,
				title:title,
				from_name: from_name,
				to_name: title,
				receiver_uid: receiver_uid,
				owner_uid: owner_uid,
				parent_uid: parent_uid,
				message: message,
				msg_type: msg_type,
				space: space,
				link: link,
				top: top,
				left: left,
				width: width,
				height: height,
				create_date: mm.getActualFullDate(),
				change_date: mm.getActualFullDate(),
				index: -1,
				blocked: false,
				expand: false,
				fixed: false,
				hidden: false,
				highlight: false,
				minimized: false,
				spaceTitle: document.title,
				files: files
			};

			//Message 저장
			mm.saveSetMsg(lastUid, vo, function (result) {	})

			//Title 조정
			if (receiver_uid > -1) {
				vo.title = 'To:&nbsp;' + title;
			}
			mm.createMsg(vo);

			//LastUid 입력
			mm.putUniqueId(lastUid, owner_uid, 'M');
	},

	postSimpleMsg : function (from_name, title, receiver_uid, owner_uid, parent_uid, message, msg_type, space, link, top, left, width, height, index) {

		this.getLastId(function(lastUid) {
			var uid = lastUid;
			mm.makeMessage(uid, from_name, title, receiver_uid, owner_uid, parent_uid, message, msg_type, space, link, top, left, width, height, index, '');

		});

	},

	sendSimpleMsg : function (id, receiver_uid, to_name, owner_uid) {

		/*console_logs*/mm.console_logs('sendSimpleMsg unique_id', id);
		/*console_logs*/mm.console_logs('sendSimpleMsg receiver_uid', receiver_uid);
		/*console_logs*/mm.console_logs('sendSimpleMsg to_name', to_name);

		var new_title = to_name + '(전송)';
		$("#title_" + id).html(new_title);

		var new_message = $("#pia_editable_" + id).html() + '<br>----------------<br><u><i>전송시간: ' + mm.getActualFullDate() +'</i></u>';
		$("#pia_editable_" + id).html(new_message);

		this.getLastId(function(lastUid) {
			/*console_logs*/mm.console_logs('lastUid', lastUid);

			mm.readSetMsg(id, function (vo) {

				//message backup
				var old_message = vo.message;

				//title 변경. timestamp
				vo.title = new_title;
				vo.message = new_message;
				mm.saveSetMsg(id, vo, function (result) {	/*console_logs*/mm.console_logs('title update vo', vo)});

				/*console_logs*/mm.console_logs('REDIS vo', vo);
				vo.receiver_uid = receiver_uid;
				vo.owner_uid = mm.curUserId;
				vo.title = 'From: ' + mm.curUserName;
				//vo.message = old_message;
				vo.to_name = to_name;
				vo.parent_uid = vo.id;
				vo.id = lastUid;
				vo.create_date = mm.getActualFullDate();
				vo.change_date = mm.getActualFullDate();
				vo.blocked = true;
				vo.expand = false;
				vo.fixed = true;
				vo.hidden = false;
				vo.highlight = false;
				vo.minimized = false;
				vo.msg_type = 'S';

				mm.saveSetMsg(lastUid, vo, function (result) {	/*console_logs*/mm.console_logs('sended vo', vo)});
				mm.putUniqueId(lastUid, receiver_uid, 'S');
			});
		});

	},

	getMessageIds : function(key, callback) {
		// var url = this.message_server + this.waZrangebyscore() + '' + key + '/0/1000';
		// //console.log('getMessageIds', url);
		// $.getJSON(url, function(data) {
		// 	ids = data.ZRANGEBYSCORE;
		// 	callback(ids);
		// });
	},

	readMymeno : function(owner_uid) {

		//메모읽기
		var key = 'USER_UID_M_' + owner_uid;
		this.getMessageIds(key, function(ids) {
			if(ids!=null) {
				for(var i=0; i<ids.length; i++) {
					var curId =  ids[i];

					console.log('readMymeno data ids[' + i + ']', curId);;
					mm.readSetMsg(curId, function (vo) {

						if(vo.isNull==true) {
							/*console_logs*/mm.console_logs('vo is null', vo.id);
							mm.delete_id(key, vo.id);
						} else if(vo.id==null){
							/*console_logs*/mm.console_logs('vo id is null', vo);
						} else {
							// /*console_logs*/mm.console_logs('location', (window.location.hash).replace('#', ''));
							// /*console_logs*/mm.console_logs('vCUR_MENU_CODE', vCUR_MENU_CODE);
							console.log('readMymeno readSetMsg vo', vo);
							vo.hidden= true;
							switch(mm.view_type) {
								case 'menuItem_view_all':
									vo.hidden= false;
									break;
								case 'menuItem_cur_only':
									if(vCUR_MENU_CODE == vo.space ||
										(window.location.hash).replace('#', '') == vo.space
									) {
										vo.hidden= false;
									}
									break;
								case 'menuItem_hide_all':
									break;
							}
							mm.createMsg(vo);

						}
					});
				}
			}
		});
	},

	readMymessage : function(owner_uid) {

		//메모읽기
		var key = 'USER_UID_S_' + owner_uid;
		this.getMessageIds(key, function(ids) {
			if(ids!=null) {
				for(var i=0; i<ids.length; i++) {
					var curId =  ids[i];

					console.log('readMymessage data ids[' + i + ']', curId);
					mm.readSetMsg(curId, function (vo) {
						console.log('readMymessage readSetMsg vo', vo);
						if(vo.isNull==true) {
							/*console_logs*/mm.console_logs('vo is null', vo.id);
							mm.delete_id(key, vo.id);
						} else if(vo.id==null){
							/*console_logs*/mm.console_logs('vo id is null', vo);
						} else {
							console.log('readMymessage vo', vo);
							vo.msg_type = 'S';
							mm.createMsg(vo);
						}
					});
				}
			}
		});
	},
	closeAll: function() {

		for(var i=0; i<this.memoObjectList.length; i++) {
			var o = this.memoObjectList[i];
			console.log('closeAll o', o);
			o.destroy();
			console.log('closeAll o', 'destroyed');
		}

		this.memoObjectList = [];
		console.log('closeAll memoObjectList', 'reset');

	},
	redrawAll: function() {
		this.closeAll();
		console.log('closeAll', 'OK');
		this.touch();
		console.log('touch', 'OK');
	},
	touch : function () {
		this.messageQty = 0
		//내 메모 읽기
		this.readMymeno(this.curUserId);
		//내 메세지 읽기
		this.readMymessage(this.curUserId);
	}
};

var mm = $.MemoManager;

mm.init(vMESSAGE_SERVER, vCUR_USER_UID, vCUR_USER_NAME + ' ' + vCUR_POSITION, vCompanyReserved4);
