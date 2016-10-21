

function cleanResources(){
	// Delete last script
	var deleteSetup = document.getElementById("setup");
	deleteSetup.parentNode.removeChild(deleteSetup);
	
	// Deleting previous script
	var previousScript = document.getElementById("jsExecute");
	previousScript.parentNode.removeChild(previousScript);
	
	// Delete rendering script
	//var deleteRenderer = document.getElementById("rendering");
	//deleteRenderer.parentNode.removeChild(deleteRenderer);
	
	// Clear canvas - optimal way
	/*var canvas = document.getElementsByTagName("canvas")[0];
	var gl = canvas.getContext("webgl");
	gl.getExtension('WEBGL_lose_context').loseContext(); */
	//document.getElementById('canvas').innerHTML = '';
	
}

function setupScene(){
	var setup = document.createElement('script');
	setup.id = "setup";
	setup.innerHTML =
	'var scene = new THREE.Scene();' + '\n'
	+ 'var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1, 5000);' + '\n'
	+ 'function onRender(){};' + '\n';
	document.body.appendChild( setup );
}

function createRenderer(){ // Oonly created once
	//var rendering = document.createElement('script');
	//rendering.id = 'rendering';
	var rendering = document.getElementById('rendering');
	rendering.innerHTML=
	'var stats = new Stats();' + '\n'
	+ 'document.getElementById("canvas").appendChild( stats.domElement );' + '\n'
	+ 'var renderer = new THREE.WebGLRenderer();' + '\n'
	+ 'renderer.setSize(window.innerWidth, window.innerHeight);' + '\n'
	+ 'document.getElementById("canvas").appendChild(renderer.domElement);' + '\n'

	+ '(function animate() {' + '\n'
	+ 'onRender();' + '\n'
	+ 'stats.update();' + '\n'
	// manager.render(scene, camera);
	+ 'renderer.render(scene, camera);' + '\n'
	+ 'requestAnimationFrame(animate);' + '\n'
	+ '}());';
	document.body.appendChild( rendering );
}

var c = 0;
function executeCode() {
// Function which allows code to be executed
	cleanResources();
	setupScene();
	var script = document.createElement("script");
	script.id = "jsExecute";
	script.innerHTML = js.innerText;
	document.body.appendChild(script);
	
	if(++c == 1) createRenderer();	/// Renderer created only once
	
}

document.onkeydown = function checkKey(e) {
	e = e || window.event;
	if (e.keyCode == '18'){	// Detect alt keypress
		if(document.getElementById('jseditor').style.display == 'none')
			document.getElementById('jseditor').style.display = 'block';
		else document.getElementById('jseditor').style.display = 'none';
	}
	
	if (e.keyCode == '17'){	// Detect alt keypress
		if(document.getElementById('loadmenu').style.display == 'none')
			document.getElementById('loadmenu').style.display = 'block';
		else document.getElementById('loadmenu').style.display = 'none';
	}
	
	if(e.keyCode == '9') {	// Tab
		document.execCommand('styleWithCSS', true, null);
		document.execCommand('indent', true, null);
		if(e.preventDefault){
			e.preventDefault()
		}
	}
	
	if(e.keyCode == '113') {	// Enter
		executeCode();
	}
}