// Create object
function createCube(){
	js = document.getElementById('jseditor');
	js.innerHTML= '// Setup scene, camera, renderer' + '\n' + '\n'
	+ "var box = new THREE.Mesh(" + '\n'
	+ '		new THREE.BoxGeometry(100,100,100),' + '\n'
	+ '		new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true})' + '\n'
	+ ')' + '\n'
	+ 'scene.add(box);' + '\n';
}

// Object Animation
function animateCube(){
	createCube();
	js = document.getElementById('jseditor');
	js.innerHTML+= '\n'+
	"camera.position.z = 500;" + '\n'
	+ 'var onRender = function(){' + '\n'
	+ '		box.rotation.x += 0.01;' + '\n'
	+ '		box.rotation.y += 0.01;' + '\n'
	+ '}' + '\n';
}

// Object Illumination
function illuminate(){
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
function loadModel(){
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
	+ 'scene.add(light);' + '\n' + '\n'
}