// Object Illumination
function code_illuminate(){
	js = document.getElementById('jseditor');
	js.innerHTML= '// Setup scene, camera, renderer' + '\n' + '\n'
	+ "var box = new THREE.Mesh(" + '\n'
	+ '		new THREE.BoxGeometry(100,100,100),' + '\n'
	+ '		new THREE.MeshPhongMaterial()' + '\n'
	+ ')' + '\n'
	+ 'scene.add(box);' + '\n';
	
	js.innerHTML+= '\n'+
	'var light = new THREE.PointLight(0x00ff00)' + '\n'
	+ 'light.position.set(0,0,800);' + '\n'
	+ 'scene.add(light)' + '\n' + '\n'
	+ "camera.position.z = 500;" + '\n'
	+ 'var onRender = function(){' + '\n'
	+ '		box.rotation.x += 0.01;' + '\n'
	+ '		box.rotation.y += 0.01;' + '\n'
	+ '}' + '\n';
}

// Loading Collada model
function code_loadModel(){
	js = document.getElementById('jseditor');
	js.innerHTML= '// Setup scene, camera, renderer' + '\n' + '\n'
	+ "var loader = new THREE.ColladaLoader();" + '\n'
	+ 'loader.options.convertUpAxis = true;' + '\n'
	+ 'loader.load("Models/sketchup-demo.dae", function ( collada ) {' + '\n'
	+ '		var model = collada.scene;' + '\n'
	+ '		model.position.set(-500,0,0);' + '\n'
	+ '		model.scale.set(0.5,0.5,0.5);' + '\n'
	+ '		model.traverse(function(child) {' + '\n'
    + '     	child.castShadow = true;' + '\n'
    + '		});' + '\n'
	+ '		scene.add(model);' + '\n'
	+ '},' + '\n'
	+ 'function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + "% loaded" );}' + '\n'
	+ ');' + '\n' + '\n'
	+ 'var light = new THREE.DirectionalLight(0xffffff);' + '\n'
	+ 'light.position.set(0, 0, 800);' + '\n'
	+ 'scene.add(light);' + '\n' + '\n';
}

// Loading model, lights and renderer
function loadModel(){
	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load("Models/sketchup-demo.dae", function ( collada ) {
			var model = collada.scene;
			model.position.set(-500,0,0);
			model.scale.set(0.5,0.5,0.5);
			model.traverse(function(child) {
			child.castShadow = true;
			});
			scene.add(model);
	},
	function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + "% loaded" );}
	);
}
function initLightsAndSkyColour(){
	if(typeof renderer !== 'undefined') renderer.setClearColor(0x1E90FF);	// Setting background
	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(0, 0, 800);
	scene.add(light);
}
function addMouseControls(){
	var controls = new THREE.PointerLockControls( camera );
	function lockMousePointer(controls) {
		document.addEventListener( 'pointerlockchange', (()=>{controls .enabled = document.pointerLockElement === document.body?true:false}), false );
		document.body.addEventListener( 'click', (()=> {document.body.requestPointerLock()}), false );
	}
}

function code_setup(){
	js = document.getElementById('jseditor');
	js.innerHTML= '// Setup scene, camera, renderer' + '\n' + '\n'
	+ 'loadModel();' + '\n'
	+ 'initLightsAndSkyColour();' + '\n'; 
}
// -----

function code_pointerlock_controls(){
	code_setup();
	js = document.getElementById('jseditor');
	js.innerHTML += '// Setup scene, camera, renderer' + '\n' + '\n'
	+ "var controls = new THREE.PointerLockControls( camera );" + '\n'

	+ "function lockMousePointer(controls) {" + '\n'
	+ "		document.addEventListener( 'pointerlockchange', (()=>{controls.enabled = document.pointerLockElement === document.body?true:false}), false );" + '\n'
	+ "		document.body.addEventListener( 'click', (()=> {document.body.requestPointerLock()}), false );" + '\n'
	+ '}';

}
