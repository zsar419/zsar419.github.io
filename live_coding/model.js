var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight, 1,10000);
var renderer = new THREE.WebGLRenderer();
//var container = document.createElement( 'div' );
var container = document.getElementById('canvas');


renderer.setSize(window.innerWidth, window.innerHeight);
//document.body.appendChild( stats.domElement );
//document.body.appendChild( container );
container.appendChild(renderer.domElement);

var setMaterial = function(node, material) {
	node.material = material;
	if (node.children) {
		for (var i = 0; i < node.children.length; i++) {
			setMaterial(node.children[i], material);
		}
	  }
} // */
// instantiate a loader
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('sketchup-demo.dae', function ( collada ) {
		var dae = collada.scene;
		setMaterial(dae, new THREE.MeshBasicMaterial({color: 0xff0000}));
		dae.position.x = -500;
		dae.scale.set(0.5,0.5,0.5);
		dae.updateMatrix();
		///dae.scale.x = 30;
		//collada.scene.scale.y = 30;
		//collada.scene.material.color.setRGB(1,0,0);
		scene.add(dae);
	},
	// Function called when download progresses
	function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );}
);
//*/

/*var loader = new THREE.ObjectLoader();
loader.load("untitled2.json", function ( object ) {
	object.scale.x = 10;
	object.scale.y = 10;
	//object.scale.z = 10;
	obj = object;
	scene.add( obj );
});*/

var obj2;
var loader3 = new THREE.ObjectLoader();
loader3.load( "model.json", function( object2 ) {
	obj2 = object2;
	obj2.scale.set(30,30,30);
	scene.add(obj2);
} );

var box = new THREE.Mesh(
	new THREE.BoxGeometry(100,100,100),
	new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true})
)
scene.add(box);

camera.position.z = 500;
function render() {
	requestAnimationFrame(render);
	box.rotation.x += 0.01;
	box.rotation.y += 0.01;
	
	//obj2.rotation.x += 0.01;
	//obj2.rotation.y+=0.01;
	renderer.render(scene, camera);	
};
render();