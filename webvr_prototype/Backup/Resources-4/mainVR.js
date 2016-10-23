 function loadJSON(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './Resources/settings.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4)  callback(xobj.responseText);
    };
    xobj.send(null);  
 }

loadJSON(function(response) { 
    loadGUI(JSON.parse(response || "{}"));
    init();
});

var scene, camera, renderer;
var player, model, plane, raycaster, gravitycaster;

// Lights
var a_light, h_light, d_light, s_light1, s_light2;

// Predeclared functions (called by GUI)
var setPlaneSettings, loadModel;

function init(){
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 1, 2500 );
    scene.fog.color.setHSL( 0.6, 0, 1 );

    camera = new THREE.PerspectiveCamera(player_c.fov, window.innerWidth/window.innerHeight, 1,player_c.view_distance);
    renderer = new THREE.WebGLRenderer();

    // Collision checking
    var ray_distance = player_c.collision_dist;
    var rc_height = player_c.height-2.5;
    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, ray_distance );
    gravitycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3(), 0, rc_height );

    // Statistics (FPS)
    var stats = new Stats();
    document.body.appendChild( stats.domElement );

    // Set renderer settings
    (function setRendererSettings(){
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor( toHex(sceneControls.skycolor) );	// Blue background
        renderer.shadowMap.enabled = true;
        renderer.shadowMapSoft = true;      // Smoothen shadows
        document.body.appendChild( renderer.domElement );
    }());
    
    (function addOverlay()
    {
        // Opus logo
        var img = document.createElement("IMG");
        img.style.position = 'absolute';
        img.style.top = 10 + 'px';
        img.style.left = document.body.clientWidth/2 + 'px';
        img.src = 'Resources/logo.PNG';
        document.body.appendChild(img);

        // Testing text
        /*var text = document.createElement('div')
        text.id = "txt_1";
        text.style.position = 'absolute';
        text.style.width = 500;
        text.style.height = 500;
        text.style.backgroundColor = "blue";
        text.innerHTML = "debug_text1";
        text.style.top = 100 + 'px';
        text.style.left = 100 + 'px';
        document.body.appendChild(text);

        var text2 = document.createElement('div');
        text2.id = "txt_2";
        text2.style.position = 'absolute';
        text2.style.width = 500;
        text2.style.height = 500;
        text2.style.backgroundColor = "red";
        text2.innerHTML = "debug_text2";
        text2.style.top = 150+ 'px';
        text2.style.left = 100 + 'px';
        document.body.appendChild(text2);*/

    }());
    

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
    };

    function setPlaneSettings(){
        plane = new THREE.Mesh(	// plane
            new THREE.BoxGeometry(500, 5,500),
            new THREE.MeshPhongMaterial( { color: toHex(planeControls.color) } )  
            //new THREE.MeshLambertMaterial( { color: toHex(planeControls.color) } ) // Performance 
        );
        plane.receiveShadow = true;
        plane.position.set(planeControls.pos_x,planeControls.pos_y,planeControls.pos_z);
        plane.scale.set( planeControls.scale, 1, planeControls.scale);
        if(planeControls.status) scene.add(plane);
        // Create walls
    }

    loadModel =  (name) => 
    {
        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;
        loader.load('Model/'+name, function ( collada ) {
                model = collada.scene;
                model.position.set(model_c.pos_x, model_c.pos_y, model_c.pos_z);
                model.rotation.set(model_c.rot_x, model_c.rot_y, model_c.rot_z);
                model.scale.set(model_c.scale_x,model_c.scale_y,model_c.scale_z);
                // Casting shadows for all children
                model.traverse(function(child) {	// or scene.traverse
                    child.castShadow = model_c.cast_shadow;
                    //child.receiveShadow = model_c.recieve_shadows;
                });
                scene.add(model);
                // Delayed function to fix gravity (fall through floor bug)
                setTimeout(() => player.isFlying = player_c.fly_mode, 2000);
            }, function ( xhr ) {console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );}
        );
    }

    (function initSceneObjects(){
        initLights();
        setPlaneSettings();
        if(model_c.name === '') setTimeout(() => player.isFlying = player_c.fly_mode, 2000);
        else loadModel(model_c.name);

        // Create cube - debugging
        var cube = new THREE.Mesh(
            new THREE.BoxGeometry(20,20,20),
            new THREE.MeshLambertMaterial()
        )
        cube.position.set(0, 50,-100);
        cube.castShadow = true;
        cube.receiveShadow = true;
        scene.add(cube);
    }());

    // PC mouse controls
    var controls = new THREE.PointerLockControls( camera );	// Web based PC controls
    var setPlayerControls = function(height){
        player = controls.getObject();
        player.position.set(player_c.pos_x,player_c.pos_y+height,player_c.pos_z);
        player.rotation.y = player_c.direction/180*Math.PI;
        player.isFlying = true;
        player.step = player_c.step_size;
        scene.add( player );

        lockMousePointer(controls);	
        addPCControls(); // 
    }
    setPlayerControls(50);

    // VR controls
    var effect = new THREE.VREffect(renderer);
    var manager = new WebVRManager(renderer, effect, { hideButton: false, isUndistorted: false });
    function setOrientationControls(e) 
    {
        if (!e.alpha) return;
        addMobileMovement();
        var controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect(); // */        
        player = controls.object;
        //player.isFlying = true;
        //player.rotation.onChange = () => {};
        //player.rotation.onChangeCallback = () => {};

        // Camera is child of player which rotates aswell
        // Cannot remove camera from player as it is part of scene
        // Need to implement probably without player
        
        /*controls = new THREE.VRControls(camera);
        controls.standing = true; // */
        setInterval(() => {
            var vector = camera.getWorldDirection();
            var theta = -Math.atan2(vector.x,-vector.z);    // Direction from camera
            //player.rotation.rotateOnAxis(new THREE.Vector3(0,1,0), theta);
            //player.rotation.y = theta;
            //document.getElementById("txt_1").innerHTML = toDegs(theta);
            //document.getElementById("txt_2").innerHTML = toDegs(camera.rotation.y);
            controls.update(); 
        }, 15);   // 60 FPS*/
        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    
    // Window fullscreen button/effect
    window.addEventListener('deviceorientation', setOrientationControls, true);
    window.addEventListener('vrdisplaypresentchange', onResize, true);
    window.addEventListener('resize', onResize, true);
    function onResize(e) {
        effect.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    
    function getGravityCollision(pos){
        if(player.isFlying) return false;
        var downward = new THREE.Vector3(0, -1, 0);
        gravitycaster.set( pos , downward);
        var intersectionsGravity = gravitycaster.intersectObjects( scene.children, true );
        return intersectionsGravity.length>0?player_c.height +  intersectionsGravity[0].point.y -2.5:0;
    }

    function getForwardCollision(pos){		// Project ray forward only
        if(player.isFlying) return false;
        var pos = player.position.clone();
        var direction = camera.getWorldDirection();
        var forward = new THREE.Vector3(direction.x, 0, direction.z);

        // Forward raycast
        raycaster.far = ray_distance;
        raycaster.set( pos , forward);
        var intersections = raycaster.intersectObjects( scene.children, true );
        if ( intersections.length > 0 ) return true;

        // Simple step size based ray caster - for slope/stair traversal
        pos.y -= (25-player.step);  // HARDCODED
        raycaster.set( pos , forward);
        var intersections_step = raycaster.intersectObjects( scene.children, true );
        if ( intersections_step.length > 0 ) return true; // */

        // Ray casting to climb
        /*var h_step = player_c.collision_dist;
        var v_step = player_c.step_size;        // v_step must be < height
        var h2_step = v_step * h_step/player_c.height;  // Similar triangles (small horizontal component)

        // Determine length of ray
        var small_triangle_length = Math.sqrt(Math.pow(v_step,2) + Math.pow(h2_step,2));
        var main_triangle_length = Math.sqrt(Math.pow(player_c.height,2) + Math.pow(h_step,2));
        var slope_y = -1+1/90 * toDegs(Math.atan(h_step/(player_c.height-v_step)));
        
        raycaster.far = main_triangle_length - small_triangle_length;
        raycaster.set( pos , new THREE.Vector3(direction.x, slope_y, direction.z));
        var intersectionsBot = raycaster.intersectObjects( scene.children, true );
        if(intersectionsBot.length > 0 ) return true;
        return false;*/
    }

    function setLoop(degrees){
        if (degrees>=180) return degrees-360;
        else if (degrees<=-180) return degrees+360;
        else return degrees;
    }

    function render() {
        renderPCMovement(player, getForwardCollision(player.position), getGravityCollision(player.position) );	// Deals with collisions
        player_c.pos_x = player.position.x;
        player_c.pos_y = player.position.y;
        player_c.pos_z = player.position.z;
        player_c.direction = setLoop(player.rotation.y/Math.PI*180);
    };

    /*requestAnimationFrame(animate);
    var lastRender = 0;
    function animate(timestamp) {
        var delta = Math.min(timestamp - lastRender, 500);
        lastRender = timestamp;

        render();
        stats.update(); 

        // Render the scene through the manager.
        manager.render(scene, camera, timestamp);
        requestAnimationFrame(animate);
    }*/   
    (function animate() {

        render();
        stats.update(); 
        // Render the scene through the manager.
        manager.render(scene, camera);
        requestAnimationFrame(animate);
    }());
}