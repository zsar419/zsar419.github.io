
/*adds controls to scene*/
//var gui = new dat.GUI();
var gui;
function loadGUI(){
    gui = new dat.GUI({
        load: settings,
        preset: 'Default'
    });

    gui.remember(player_c);
    gui.remember(model_c);
    gui.remember(ambientLight);
    gui.remember(hemisphereLight);
    gui.remember(directionalLight);
    gui.remember(spotLight1);
    gui.remember(spotLight2);
    gui.remember(sceneControls);
    gui.remember(planeControls);

    addPlayerControls();
    addModelControls();
    addLightControls();
    addSceneControls();
}

function addPlayerControls(){
    var playerGui = gui.addFolder('Player');
    playerGui.add( player_c, 'pos_x',-2000,2000).listen().onChange(function(){
        player.position.x = player_c.pos_x;        
    });
    playerGui.add( player_c, 'pos_y',-2000,2000).listen().onChange(function(){
        player.position.y = player_c.pos_y;
    });
    playerGui.add( player_c, 'pos_z',-2000,2000).listen().onChange(function(){
        player.position.z = player_c.pos_z;
    });

    playerGui.add( player_c, 'height', 1,200).listen().onChange(function(){
        player.position.y = player_c.height;
        gravitycaster.far = player_c.height;
    });

    playerGui.add( player_c, 'jump_velocity', 0,500);

    playerGui.add( player_c, 'collision_dist', 5,100).onChange(function(){
        raycaster.far = player_c.collision_dist;
    });
    playerGui.add( player_c, 'step_size', 1,50).onChange(function(){
        player.step = player_c.step_size;
    });

    playerGui.add( player_c, 'direction', -180,180).listen().onChange(function(){
        player.rotation.y = toRads(player_c.direction);
    });

    playerGui.add( player_c, 'fov', 10,120).onChange(function(){
        camera.fov = player_c.fov;
        camera.updateProjectionMatrix();
    });
    playerGui.add( player_c, 'speed', 1,14).onChange(function(){
        playerSpeed = player_c.speed;
    });
    playerGui.add( player_c, 'fly_mode').onChange(function(){
        player.isFlying = player_c.fly_mode;
    });

    
}

function addModelControls(){
    var modelGui = gui.addFolder('Model');
    modelGui.add( model_c, 'name');
    modelGui.add( model_c, 'load_model').onChange(function(){
        scene.remove(model);
        loadModel(model_c.name);
    });
    modelGui.add( model_c, 'load_time', 0, 10);

    modelGui.add( model_c, "pos_x",-1000,1000).onChange(function(){
        model.position.x = model_c.pos_x;
    });
    modelGui.add( model_c, "pos_y",-1000,1000).onChange(function(){
        model.position.y = model_c.pos_y;
    });
    modelGui.add( model_c, "pos_z",-1000,1000).onChange(function(){
        model.position.z = model_c.pos_z;
    });

    modelGui.add( model_c, "rot_x", 0,360).onChange(function(){
        model.rotation.x = toRads(model_c.rot_x);
    });
    modelGui.add( model_c, "rot_y",0,360).onChange(function(){
        model.rotation.y = toRads(model_c.rot_y);
    });
    modelGui.add( model_c, "rot_z",0,360).onChange(function(){
        model.rotation.z = toRads(model_c.rot_z);
    });

    modelGui.add( model_c, "synchronize_scaling").onChange(function(){
    });

    function synchronize_scale(value){
        model.scale.x = model.scale.y = model.scale.z = value;
        model_c.scale_x = model_c.scale_y = model_c.scale_z = value;
    }
    modelGui.add( model_c, "scale_x", 0.1,5).listen().onChange(function(){
        if(model_c.synchronize_scaling)
            synchronize_scale(model_c.scale_x);
        else model.scale.x = model_c.scale_x;
    });
    modelGui.add( model_c, "scale_y", 0.1,5).listen().onChange(function(){
        if(model_c.synchronize_scaling)
            synchronize_scale(model_c.scale_y);
        else model.scale.y = model_c.scale_y;
    });
    modelGui.add( model_c, "scale_z", 0.1,5).listen().onChange(function(){
        if(model_c.synchronize_scaling)
            synchronize_scale(model_c.scale_z);
        else model.scale.z = model_c.scale_z;
    });
    
}

function addLightControls(){
    var lightGui = gui.addFolder('Lights');
    var aLight = lightGui.addFolder('Ambient_Light');
    var hLight = lightGui.addFolder('Hemisphere_Light');
    var dLight = lightGui.addFolder('Directional_Light');
    var sLight = lightGui.addFolder('Spot_Light');
    var sLight2 = lightGui.addFolder('Spot_Light2');

    // Ambient light
    aLight.add(ambientLight, "status").onChange(function(){
        if(ambientLight.status) scene.add(a_light);
        else scene.remove(a_light);
    });
    aLight.add( ambientLight, "intensity",0,1).onChange(function(){
        a_light.intensity = ambientLight.intensity;
    });
    aLight.addColor(ambientLight, "color").onChange(function(){
        a_light.color.setHex(toHex(ambientLight.color));
    });
    
    // Hemisphere light
    hLight.add(hemisphereLight, "status").onChange(function(){
        if(hemisphereLight.status) scene.add(h_light);
        else scene.remove(h_light);
    });
    hLight.add( hemisphereLight, "intensity",0,1).onChange(function(){
        h_light.intensity = hemisphereLight.intensity;
    });
    hLight.add( hemisphereLight, "hue", 0,1).onChange(function(){
        h_light.color.setHSL(hemisphereLight.hue, hemisphereLight.saturation, hemisphereLight.lightness);
    });
    hLight.add( hemisphereLight, "saturation",0,1).onChange(function(){
        h_light.color.setHSL(hemisphereLight.hue, hemisphereLight.saturation, hemisphereLight.lightness);
    });
    hLight.add( hemisphereLight, "lightness",0,1).onChange(function(){
        h_light.color.setHSL(hemisphereLight.hue, hemisphereLight.saturation, hemisphereLight.lightness);
    });

    // Directional light
    dLight.add(directionalLight, "status").onChange(function(){
        if(directionalLight.status) scene.add(d_light);
        else scene.remove(d_light);
    });
    dLight.addColor(directionalLight, "color").onChange(function(){
        d_light.color.setHex(toHex(directionalLight.color));
    });
    dLight.add( directionalLight, "intensity",0,2).onChange(function(){
        d_light.intensity = directionalLight.intensity;
    });
    dLight.add( directionalLight, "pos_x",-2000,2000).onChange(function(){
        d_light.position.x = directionalLight.pos_x;
    });
    dLight.add( directionalLight, "pos_y",-2000,2000).onChange(function(){
        d_light.position.y = directionalLight.pos_y;
    });
    dLight.add( directionalLight, "pos_z",-2000,2000).onChange(function(){
        d_light.position.z = directionalLight.pos_z;
    });
    dLight.add(directionalLight, "follow_player").onChange(function(){
        d_light.follow = directionalLight.follow_player;
    });
    
    // Spotlight 1
    sLight.add(spotLight1, "status").onChange(function(){
        if(spotLight1.status) scene.add(s_light1);
        else scene.remove(s_light1);
    });
    sLight.addColor(spotLight1, "color").onChange(function(){
        s_light1.color.setHex(toHex(spotLight1.color));
    });
    sLight.add( spotLight1, "intensity",0,5).onChange(function(){
        s_light1.intensity = spotLight1.intensity;
    });
    sLight.add( spotLight1, "pos_x",-2000,2000).onChange(function(){
        s_light1.position.x = spotLight1.pos_x;
    });
    sLight.add( spotLight1, "pos_y",-2000,2000).onChange(function(){
        s_light1.position.y = spotLight1.pos_y;
    });
    sLight.add( spotLight1, "pos_z",-2000,2000).onChange(function(){
        s_light1.position.z = spotLight1.pos_z;
    });
    sLight.add(spotLight1, "follow_player").onChange(function(){
        s_light1.follow = spotLight1.follow_player;
    });

    

    // Spotlight 2
    sLight2.add(spotLight2, "status").onChange(function(){
        if(spotLight2.status) scene.add(s_light2);
        else scene.remove(s_light2);
    });
    sLight2.addColor(spotLight2, "color").onChange(function(){
        s_light2.color.setHex(toHex(spotLight2.color));
    });
    sLight2.add( spotLight2, "intensity",0,5).onChange(function(){
        s_light2.intensity = spotLight2.intensity;
    });
    sLight2.add( spotLight2, "pos_x",-2000,2000).onChange(function(){
        s_light2.position.x = spotLight2.pos_x;
    });
    sLight2.add( spotLight2, "pos_y",-2000,2000).onChange(function(){
        s_light2.position.y = spotLight2.pos_y;
    });
    sLight2.add( spotLight2, "pos_z",-2000,2000).onChange(function(){
        s_light2.position.z = spotLight2.pos_z;
    });
    sLight2.add(spotLight1, "follow_player").onChange(function(){
        s_light2.follow = spotLight2.follow_player;
    });

    // Print light data
    //lightGui.add( ..., '...');
    //lightGui.add( lightControls, 'get_light_data');

}

function addSceneControls(){
    var sceneGui = gui.addFolder('Scene');
    sceneGui.add( sceneControls, 'skycolor').onChange(function(){
        renderer.setClearColor( toHex(sceneControls.skycolor) );	// Blue background
    });

    var planeGUI = sceneGui.addFolder('Plane');
    planeGUI.add(planeControls, "status").onChange(function(){
        if(planeControls.status) scene.add(plane);
        else scene.remove(plane);
    });
    planeGUI.addColor(planeControls, "color").onChange(function(){
        plane.material.color.setHex(toHex(planeControls.color));
    });
    planeGUI.add( planeControls, "pos_x",-2000,2000).onChange(function(){
        plane.position.x = planeControls.pos_x;
    });
    planeGUI.add( planeControls, "pos_y",-2000,2000).onChange(function(){
        plane.position.y = planeControls.pos_y - planeControls.scale;
    });
    planeGUI.add( planeControls, "pos_z",-2000,2000).onChange(function(){
        plane.position.z = planeControls.pos_z;
    });
    planeGUI.add( planeControls, "scale", 1,10).onChange(function(){
        scene.remove(plane);
        setPlaneSettings();
    });

}
