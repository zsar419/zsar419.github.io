var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(playerControls.fov, window.innerWidth/window.innerHeight, 1,5000);
var renderer = new THREE.WebGLRenderer({ antialias: true });

scene.fog = new THREE.Fog( 0xffffff, 1, 2500 );
scene.fog.color.setHSL( 0.6, 0, 1 );

// First Person Camera Controls (PC based)
lockMousePointer();	
addPCControls(); // */
var controls = new THREE.PointerLockControls( camera );	// Web based controls
controls.getObject().position.set(playerControls.pos_x,playerControls.pos_y,playerControls.pos_z);
controls.getObject().rotation.y = playerControls.direction/180*Math.PI;
scene.add( controls.getObject() );

// Collision checking
var ray_distance = 15;
var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, ray_distance );
// 2nd Raycaster can make it computationally intensive - find better alternative
var raycasterBot = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, ray_distance );

var stats = new Stats();
document.body.appendChild( stats.domElement );

// Set renderer settings
renderer.setClearColor( scene.fog.color );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x1e90ff );	// Blue background
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;      // Smoothen shadows
renderer.shadowMap.renderReverseSided = false;
document.body.appendChild( renderer.domElement );



var a_light, hemiLight, d_light, s_light1, s_light2;
function initLights(){
    a_light = new THREE.AmbientLight(toHex(ambientLight.color), ambientLight.intensity);
    if(ambientLight.status) scene.add(a_light);

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.position.set( 0, 5000, 0 );
    scene.add( hemiLight );

    d_light = new THREE.DirectionalLight(toHex(directionalLight.color), directionalLight.intensity);
    d_light.position.set(directionalLight.pos_x, directionalLight.pos_y, directionalLight.pos_z);
    d_light.color.setHSL( 0.1, 1, 0.95 );
    d_light.castShadow = true;
    if(directionalLight.status) scene.add(d_light);

    s_light1 = new THREE.SpotLight(toHex(spotLight1.color), spotLight1.intensity);
    s_light1.position.set(spotLight1.pos_x, spotLight1.pos_y, spotLight1.pos_z);
    s_light1.castShadow = true;
    if(spotLight1.status) scene.add(s_light1);

    s_light2 = new THREE.SpotLight(toHex(spotLight2.color), spotLight2.intensity);
    s_light2.position.set(spotLight2.pos_x, spotLight2.pos_y, spotLight2.pos_z);
    s_light2.castShadow = true;
    if(spotLight2.status) scene.add(s_light2);
}
initLights();

var model, plane;
function initObjects(){
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
                //child.receiveShadow = true;
            });
            scene.add(model);
        }, function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );}
    ); // */


    // GROUND
    var groundMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x050505 } );
    groundMat.color.setHSL( 0.095, 1, 0.75 );
    var ground = new THREE.Mesh(new THREE.PlaneBufferGeometry( 5000, 5000 ), groundMat);
    ground.rotation.x = -Math.PI/2;
    ground.position.set(0,-5,0);
    ground.receiveShadow = true;
    //scene.add( ground );

    var plane = new THREE.Mesh(	// plane
        new THREE.BoxGeometry(5000,5,5000),
        new THREE.MeshPhongMaterial( { color: 0xcccccc } )
    );
    plane.receiveShadow = true;
    plane.position.set(0,-5,0);
    scene.add(plane);

    var cube = new THREE.Mesh(
        new THREE.BoxGeometry(40,40,40),
        new THREE.MeshLambertMaterial()
    )
    cube.position.set(0, 50,-100);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    
}
initObjects();

// Window resize function - PC
window.addEventListener( 'resize', function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    }, false
);

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
    
    playerControls.pos_x = controls.getObject().position.x;
    playerControls.pos_y = controls.getObject().position.y;
    playerControls.pos_z = controls.getObject().position.z;
    playerControls.direction = setLoop(controls.getObject().rotation.y/Math.PI*180);
    
};

function animate(){
    requestAnimationFrame(animate);
    render();
    stats.update();     
    renderer.render(scene, camera);
}
animate();