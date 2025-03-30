// ref: https://web.dev/async-clipboard/
//      https://stackoverflow.com/questions/21797299/convert-base64-string-to-arraybuffer

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function checkdomain(domain){
	return document.domain.indexOf(domain);
}

var canvas = null;
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
		if(request.message=="***capture***"){
			// Step 1: Get video element
			console.log("capt")
			a = document.getElementsByTagName('video'); 
			if(a.length == 0) { // not supported
				console.log('not supported domain:' + document.domain);
				return ;
			}
			a = a[0];
			sWidth = a.videoWidth;
			sHeight = a.videoHeight;
			dWidth = a.offsetWidth;
			dHeight = a.offsetHeight;
			
			// Step 2: Build Canvas and Context to draw Image and turn it to be DataURL (base64)
			if (!canvas) {
				canvas = document.createElement("canvas");
				canvas.style.display='none'
				document.body.appendChild(canvas);
			}
			canvas.width = dWidth;
			canvas.height = dHeight;
			var context = canvas.getContext("2d");
			context.drawImage(a,
				0, 0,
				sWidth, sHeight,
				0, 0,
				dWidth, dHeight
			);
			var DataUrl = canvas.toDataURL("image/png"); // e.g. 'data:image/png;base64,iVBORw0KG.......'
			
			// Step 3: Make Button to Trigger Clipboard Writing Process
			e = document.createElement('button');
			e.onclick = async () => {
				try {
				const pngImageBlob = new Blob([_base64ToArrayBuffer(DataUrl.substr(DataUrl.indexOf('base64')+7))], {type: 'image/png'});
				let data = [new ClipboardItem({'image/png': pngImageBlob })];
				await navigator.clipboard.write(data);
			  } catch(e) {
				console.log(e);
			  }
			};
			document.body.appendChild(e);
			
			// Step 4: Click Button!
			e.click()
			document.body.removeChild(e)
			console.log('copied!!')
		}
	}
)