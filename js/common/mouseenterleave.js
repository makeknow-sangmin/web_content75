
 var _debug = $_('debug');

window.onload = function()
{
	var test = document.getElementById("test");
	var timeout;
	
	var Dragndrop1 = document.getElementById("Dragndrop1");
	//var green = document.getElementById("green");
	var blue = document.getElementById("blue");
	blue.onmouseout = handler;
	blue.onmouseover = handler;
	//var gray = document.getElementById("gray");
	//gray.onmouseout = handler;
	//gray.onmouseover = handler;
	
	function handler(evt)
	{
		if(!timeout) test.innerHTML = "";
		
		evt = evt || event;
		
		test.innerHTML += "<b>"+evt.type+":</b><br>";
		try{
			var mbc = new MouseBoundaryCrossing(evt, Dragndrop1);
		}catch(e){
			test.innerHTML += e.name+": "+e.message;
			Dragndrop1.style.visibility = 'visible';
			return;
		}
		//var action = mbc.leftLandmark ? "left" : mbc.enteredLandmark ? "entered" : mbc.inLandmark ? 
		//	"remained inside of" : "remained outside of";
		//test.innerHTML += "Mouse has <span style=\"color:red;\">"+action+"</span> the red box.<br>";
		
		//mbc = new MouseBoundaryCrossing(evt, green);
		//action = mbc.leftLandmark ? "left" : mbc.enteredLandmark ? "entered" : mbc.inLandmark ? 
		//	"remained inside of" : "remained outside of";
		//test.innerHTML += "Mouse has <span style=\"color:green;\">"+action+"</span> the green box.<br>";
		
		mbc = new MouseBoundaryCrossing(evt, blue);
		action = mbc.leftLandmark ? "left" : mbc.enteredLandmark ? "entered" : mbc.inLandmark ? 
			"remained inside of" : "remained outside of";
		
		test.innerHTML = "Mouse has <span style=\"color:blue;\">"+action+"</span> the blue box.<br>";
		
		if(mbc.leftLandmark) {
			Dragndrop1.style.visibility = 'visible';
		} else {
			Dragndrop1.style.visibility = 'visible';
			//Dragndrop1.style.visibility = 'hidden';
		}
		
		//mbc = new MouseBoundaryCrossing(evt, gray);
		//action = mbc.leftLandmark ? "left" : mbc.enteredLandmark ? "entered" : mbc.inLandmark ? 
		//	"remained inside of" : "remained outside of";
		//test.innerHTML += "Mouse has <span style=\"color:dimgray;\">"+action+"</span> the gray box.<br><br>";
		
		test.scrollTop = (test.scrollHeight<test.clientHeight ? test.clientHeight : test.scrollHeight) - test.clientHeight;
		
		timeout = setTimeout(function(){ timeout = null; }, 1000);
	}
};


//since mouseenter & mouseleave are only supported in IE, this object helps to
// determine if the mouse is entering or leaving an element
//landmark: did the mouse enter or leave this "landmark" element? Was the event fired from within this element?
//usage:   var mbc = new MouseBoundaryCrossing(mouse_event, landmark);
function MouseBoundaryCrossing(evt, landmark)
{
	evt = evt || window.event;
	
	var eventType = evt.type;
	
	this.inLandmark = false;
	this.leftLandmark = false;
	this.enteredLandmark = false;
	
	if(eventType == "mouseout")
	{
		this.toElement = evt.relatedTarget || evt.toElement;
		this.fromElement = evt.target || evt.srcElement;
	}
	else if(eventType == "mouseover")
	{
		this.toElement = evt.target || evt.srcElement;
		this.fromElement = evt.relatedTarget || evt.fromElement;
	}
	else throw (new Error("Event type \""+eventType+"\" is irrelevant"));	//irrelevant event type
	
	//target is unknown
	//this seems to happen on the mouseover event when the mouse is already inside the element when the page loads and
	// the mouse is moved: fromElement is undefined
	if(!this.toElement || !this.fromElement) throw (new Error("Event target(s) undefined"));
	
	//determine whether from-element is inside or outside of landmark (i.e., does tmpFrom == the landmark or the document?)
	var tmpFrom = this.fromElement;
	while(tmpFrom.nodeType == 1)	//while tmpFrom is an element node
	{
		if(tmpFrom == landmark) break;
		tmpFrom = tmpFrom.parentNode;
	}
	
	//determine whether to-element is inside or outside of landmark (i.e., does tmpTo == the landmark or the document?)
	var tmpTo = this.toElement;
	while(tmpTo.nodeType == 1)	//while tmpTo is an element node
	{
		if(tmpTo == landmark) break;
		tmpTo = tmpTo.parentNode;
	}
	
	if(tmpFrom == landmark && tmpTo == landmark) this.inLandmark = true;	//mouse is inside landmark; didn't enter or leave
	else if(tmpFrom == landmark && tmpTo != landmark)	//mouse left landmark
	{
		this.leftLandmark = true;
		this.inLandmark = (eventType == "mouseout");	//mouseout: currently inside landmark, but leaving now
														//mouseover: currently outside of landmark; just left
	}
	else if(tmpFrom != landmark && tmpTo == landmark)	//mouse entered landmark
	{
		this.enteredLandmark = true;
		this.inLandmark = (eventType == "mouseover");	//mouseover: currently inside landmark; just entered
														//mouseout: currently outside of landmark, but entering now
	}
	//else	//mouse is outside of landmark; didn't enter or leave
}


function OnMouseDown(e)
{
    // IE is retarded and doesn't pass the event object
    if (e == null) 
        e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    
//    var _debug = $_('debug');

//    _debug.innerHTML = target.className == 'drag' 
//        ? 'draggable element clicked' 
//        : 'NON-draggable element clicked';

    // for IE, left click == 1
    // for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || 
        e.button == 0) && 
        target.className == 'drag')
    {
        // grab the mouse position
        _startX = e.clientX;
        _startY = e.clientY;
        
        // grab the clicked element's position
        _offsetX = ExtractNumber(target.style.left);
        _offsetY = ExtractNumber(target.style.top);
        
        // bring the clicked element to the front while it is being dragged
        _oldZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // we need to access the element in OnMouseMove
        _dragElement = target;

        // tell our code to start moving the element with the mouse
        document.onmousemove = OnMouseMove;
        
        // cancel out any text selections
        document.body.focus();

        // prevent text selection in IE
        document.onselectstart = function () { return false; };
        // prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        // prevent text selection (except IE)
        return false;
    }
}


function OnMouseMove(e)
{
    if (e == null) 
        var e = window.event; 

//    var _debug = $_('debug');
    
    // this is the actual "drag code"
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
    
//    _debug.innerHTML = '(' + _dragElement.style.left + ', ' + 
//        _dragElement.style.top + ')';   
}
 
function OnMouseUp(e)
{
//	var _debug = $_('debug');
	
    if (_dragElement != null)
    {
        _dragElement.style.zIndex = _oldZIndex;
        var dragX = document.getElementById('dragX');
        dragX.value = _dragElement.style.left;
        var dragY = document.getElementById('dragY');
        dragY.value =  _dragElement.style.top;

        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        _dragElement.ondragstart = null;

        // this is how we know we're not dragging      
        _dragElement = null;
        
//        _debug.innerHTML = 'mouse up';
    }
}

function ExtractNumber(value)
{
    var n = parseInt(value);
	
    return n == null || isNaN(n) ? 0 : n;
}

// this is simply a shortcut for the eyes and fingers
function $_(id)
{
    return document.getElementById(id);
}



function sleep(milliseconds) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
	    if ((new Date().getTime() - start) > milliseconds){
	      break;
	    }
	  }
	}

function InitDragDrop()
{
    document.onmousedown = OnMouseDown;
    document.onmouseup = OnMouseUp;
}