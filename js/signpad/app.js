var wrapper = document.getElementById("signature-pad"),
    clearButton = wrapper.querySelector("[data-action=clear]"),
    saveButton = wrapper.querySelector("[data-action=save]"),
    canvas = wrapper.querySelector("canvas"),
    signaturePad;

// Adjust canvas coordinate space taking into account pixel ratio,
// to make it look crisp on mobile devices.
// This also causes canvas to be cleared.
function resizeCanvas() {
    // When zoomed out to less than 100%, for some very strange reason,
    // some browsers report devicePixelRatio as less than 1
    // and only part of the canvas is cleared then.
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext("2d").scale(ratio, ratio);
}

window.onresize = resizeCanvas;
resizeCanvas();

signaturePad = new SignaturePad(canvas);

clearButton.addEventListener("click", function (event) {
    signaturePad.clear();
});

saveButton.addEventListener("click", function (event) {
    if (signaturePad.isEmpty()) {
        alert("먼저 본인의 이름을 입력하세요.");
    } else {
        //window.open(signaturePad.toDataURL());
        var dataURL = signaturePad.toDataURL("image/png"); 
        var image = document.createElement("img"); 
        image.src = dataURL; 
		//console.log(dataURL);
		var ajax = new XMLHttpRequest();
    	ajax.open("POST","/design/upload.do?method=uploadImage&signIamgename=" + signIamgename,false);
		ajax.setRequestHeader("Content-Type", "application/upload");
		ajax.send(dataURL);
		try {
			opener.signpad_callback(ajax.responseText);
		} catch(e) {
			
		}
    }
});
