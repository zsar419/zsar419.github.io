var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1,10000);
var renderer = new THREE.WebGLRenderer();
var container = document.getElementById('canvas');

renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// instantiate a loader
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('sketchup-demo.dae', function ( collada ) {
		var dae = collada.scene;
		dae.position.set(-500,0,0);
		dae.scale.set(0.5,0.5,0.5);
		scene.add(dae);
	},
	// Function called when download progresses
	function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );}
);

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(0, 0, 800);
scene.add(light);

camera.position.z = 500;
function render() {
	requestAnimationFrame(render);
	//box.rotation.x += 0.01;
	//box.rotation.y += 0.01;
	renderer.render(scene, camera);	
};
render();