 function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', './Resources/settings.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4) callback(xobj.responseText);
    };
    xobj.send(null);  
 }

var settings;
loadJSON(function(response) { 
    settings = JSON.parse(response || "{}"); 
    loadGUI();
    init();
});


var scene, camera, renderer;
var player, model, plane;
// playerSpeed defined in controls

// Lights
var a_light, h_light, d_light, s_light1, s_light2;

// Predeclared functions (called by GUI)
var setPlaneSettings, loadModel;

function init(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(playerControls.fov, window.innerWidth/window.innerHeight, 1,5000);
    renderer = new THREE.WebGLRenderer({ antialias: true });

    scene.fog = new THREE.Fog( 0xffffff, 1, 2500 );
    scene.fog.color.setHSL( 0.6, 0, 1 );

    // First Person Camera Controls (PC based)


    var controls = new THREE.PointerLockControls( camera );	// Web based controls
    player = controls.getObject();
    player.position.set(playerControls.pos_x,playerControls.pos_y,playerControls.pos_z);
    player.rotation.y = playerControls.direction/180*Math.PI;
    scene.add( player );

    lockMousePointer(controls);	
    addPCControls(); // */

    // Collision checking
    var ray_distance = 15;
    var raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, ray_distance );
    // 2nd Raycaster can make it computationally intensive - find better alternative
    var raycasterBot = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, ray_distance );

    var stats = new Stats();
    document.body.appendChild( stats.domElement );

    // Set renderer settings
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor( toHex(sceneControls.skycolor) );	// Blue background
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;      // Smoothen shadows
    renderer.shadowMap.renderReverseSided = false;
    document.body.appendChild( renderer.domElement );

    function initLights(){
        a_light = new THREE.AmbientLight(toHex(ambientLight.color), ambientLight.intensity);
        a_light.color.setHSL( 0.6, 1, 0.6 );
        if(ambientLight.status) scene.add(a_light);

        h_light = new THREE.HemisphereLight( toHex(hemisphereLight.skycolor), toHex(hemisphereLight.groundcolor), hemisphereLight.intensity);
        h_light.color.setHSL( hemisphereLight.hue, hemisphereLight.saturation, hemisphereLight.lightness );
        if(hemisphereLight.status) scene.add( h_light );

        d_light = new THREE.DirectionalLight(toHex(directionalLight.color), directionalLight.intensity);
        d_light.position.set(directionalLight.pos_x, directionalLight.pos_y, directionalLight.pos_z);
        d_light.castShadow = true;
        d_light.follow = directionalLight.follow_player;
        if(directionalLight.status) scene.add(d_light);

        s_light1 = new THREE.SpotLight(toHex(spotLight1.color), spotLight1.intensity);
        s_light1.position.set(spotLight1.pos_x, spotLight1.pos_y, spotLight1.pos_z);
        s_light1.castShadow = true;
        s_light1.follow = spotLight1.follow_player;
        if(spotLight1.status) scene.add(s_light1);

        s_light2 = new THREE.SpotLight(toHex(spotLight2.color), spotLight2.intensity);
        s_light2.position.set(spotLight2.pos_x, spotLight2.pos_y, spotLight2.pos_z);
        s_light2.castShadow = true;
        s_light2.follow = spotLight2.follow_player;
        if(spotLight2.status) scene.add(s_light2);
    }
    initLights();

    
    setPlaneSettings = function(){
        plane = new THREE.Mesh(	// plane
            new THREE.BoxGeometry(1000*planeControls.scale, 5,1000*planeControls.scale),
            new THREE.MeshPhongMaterial( { color: toHex(planeControls.color) } )
        );
        plane.receiveShadow = true;
        plane.position.set(planeControls.pos_x,planeControls.pos_y,planeControls.pos_z);
        if(planeControls.status) scene.add(plane);
    }
    loadModel = function(name){
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('Model/'+name, function ( collada ) {
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
        );
    }
    function initObjects(){
        loadModel(modelControls.name);
        setPlaneSettings();

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

    function getForwardCollision(flying){		// Project ray forward only
        if(flying) return false;
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

    function lightFollow(lightsource){
        if(lightsource.follow){
            lightsource.position.x = controls.getObject().position.x;;
            //lightsource.pos_y = playerControls.pos_y;
            lightsource.position.z = controls.getObject().position.z;
        }
    }

    function render() {
        renderPCMovement(player, getForwardCollision(playerControls.fly_mode));	// Deals with collisions
        
        playerControls.pos_x = player.position.x;
        playerControls.pos_y = player.position.y;
        playerControls.pos_z = player.position.z;
        playerControls.direction = setLoop(player.rotation.y/Math.PI*180);

        lightFollow(d_light);
        lightFollow(s_light1);
        lightFollow(s_light2);
        
    };

    function animate(){
        requestAnimationFrame(animate);
        render();
        stats.update();     
        renderer.render(scene, camera);
    }
    animate();
}