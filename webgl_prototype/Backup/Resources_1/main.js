var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(playerControls.fov, window.innerWidth/window.innerHeight, 1,10000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

// First Person Camera Controls (PC based)
lockMousePointer();	
var controls = new THREE.PointerLockControls( camera );	// Web based controls
controls.getObject().position.set(playerControls.player_x,playerControls.player_y,playerControls.player_z);
controls.getObject().rotation.y = playerControls.direction/180*Math.PI;

// Collision checking
var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 15 );
// 2nd Raycaster can make it computationally intensive - find better alternative
var raycasterBot = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, 15 );

scene.add( controls.getObject() );
var stats = new Stats();
document.body.appendChild( stats.domElement );

// Set renderer settings
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x1e90ff );	// Blue background
renderer.shadowMapEnabled = true;
renderer.shadowMapSoft = true;
document.body.appendChild( renderer.domElement );

var a_light = new THREE.AmbientLight(toHex(ambientLight.color), ambientLight.intensity);
if(ambientLight.status) scene.add(a_light);

var d_light = new THREE.DirectionalLight(toHex(directionalLight.color), directionalLight.intensity);
d_light.position.set(directionalLight.pos_x, directionalLight.pos_y, directionalLight.pos_z);
//d_light.castShadow = true;
//d_light.shadowDarkness = 0.1;
//d_light.shadowCameraVisible = true;
if(directionalLight.status) scene.add(d_light);

var s_light1 = new THREE.SpotLight(toHex(spotLight1.color), spotLight1.intensity);
s_light1.position.set(spotLight1.pos_x, spotLight1.pos_y, spotLight1.pos_z);
s_light1.castShadow = true;
s_light1.shadowDarkness = 0.5;
//s_light1.shadowCameraVisible = true;
if(spotLight1.status) scene.add(s_light1);

var s_light2 = new THREE.SpotLight(toHex(spotLight2.color), spotLight2.intensity);
s_light2.position.set(spotLight2.pos_x, spotLight2.pos_y, spotLight2.pos_z);
s_light2.castShadow = true;
s_light2.shadowDarkness = 0.5;
//s_light2.shadowCameraVisible = true;
if(spotLight2.status) scene.add(s_light2);

var model;
var loader = new THREE.ColladaLoader();
loader.options.convertUpAxis = true;
loader.load('Model/sketchup-demo.dae', function ( collada ) {
    model = collada.scene;
    model.position.set(modelControls.pos_x, modelControls.pos_y, modelControls.pos_z);
    model.rotation.set(modelControls.rot_x, modelControls.rot_y, modelControls.rot_z);
    model.scale.set(modelControls.scale_x,modelControls.scale_y,modelControls.scale_z);
    // Casting shadows for all children
    model.traverse(function(child) {	// or scene.traverse
        child.castShadow = true;
        child.receiveShadow = true;
    });
    //d_light.target = model;
    scene.add(model);
    
    // Set PC controls and load location data
    addPCControls(model);
    //loadLocation();
},function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );}
);// */



var box = new THREE.Mesh(	// plane
new THREE.BoxGeometry(5000,5,5000), new THREE.MeshPhongMaterial());
box.castShadow = true;
box.receiveShadow = true;
box.position.set(0,-5,0);
scene.add(box);

var box2 = new THREE.Mesh(
new THREE.BoxGeometry(40,40,40),
new THREE.MeshPhongMaterial()
)
box2.position.set(0, 50,-100);
box2.castShadow = true;
box2.receiveShadow = true;
scene.add(box2);
addPCControls(box); // */

// Window resize function - PC

function getForwardCollision(){		// Project ray forward only
    var pos = controls.getObject().position;
    var direction = camera.getWorldDirection();
    var forward = new THREE.Vector3(direction.x, 0, direction.z);

    raycaster.set( pos , forward);
    var intersections = raycaster.intersectObjects( scene.children, true );
    if ( intersections.length > 0 === true) return true;

    // ray casting from bottom
    raycasterBot.set( new THREE.Vector3(pos.x, pos.y-24, pos.z) , forward);
    var intersectionsBot = raycasterBot.intersectObjects( scene.children, true );
    if(intersectionsBot.length > 0 === true) return true;
    return false;
}

function setLoop(degrees){
    if (degrees>=180) return degrees-360;
    else if (degrees<=-180) return degrees+360;
    else return degrees;
}

function render() {
    renderPCMovement();	// Deals with collisions
    
    playerControls.player_x = controls.getObject().position.x;
    playerControls.player_y = controls.getObject().position.y;
    playerControls.player_z = controls.getObject().position.z;
    playerControls.direction = setLoop(controls.getObject().rotation.y/Math.PI*180);
    
};

function animate(){
    requestAnimationFrame(animate);
    render();
    stats.update();     
    renderer.render(scene, camera);
}
animate();