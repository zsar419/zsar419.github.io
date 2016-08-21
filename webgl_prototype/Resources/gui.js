/*datGUI controls object*/
var guiControls = new function(){
    this.rotationX  = 0.0;
    this.rotationY  = 0.0;
    this.rotationZ  = 0.0;
    
    this.lightX = 19;
    this.lightY = 47;
    this.lightZ = 19;
    this.intensity = 2.5;       
    this.distance = 373;
    this.angle = 1.6;
    this.exponent = 38;
    this.shadowCameraNear = 34;
    this.shadowCameraFar = 2635;
    this.shadowCameraFov = 68;
    this.shadowCameraVisible=false;
    this.shadowMapWidth=512;
    this.shadowMapHeight=512;
    this.shadowBias=0.00;
    this.shadowDarkness=0.11;       

}

function toRads(degrees){ return degrees/180*Math.PI; }

/*adds spot light with starting parameters*/
var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set (20, 35, 40);
spotLight.intensity = guiControls.intensity;        
spotLight.distance = guiControls.distance;
spotLight.angle = guiControls.angle;
spotLight.exponent = guiControls.exponent;
spotLight.shadowCameraNear = guiControls.shadowCameraNear;
spotLight.shadowCameraFar = guiControls.shadowCameraFar;
spotLight.shadowCameraFov = guiControls.shadowCameraFov;
spotLight.shadowCameraVisible = guiControls.shadowCameraVisible;
spotLight.shadowBias = guiControls.shadowBias;
spotLight.shadowDarkness = guiControls.shadowDarkness;
//scene.add(spotLight);

/*adds controls to scene*/
var gui = new dat.GUI();

function addPlayerControls(){
    var playerGui = gui.addFolder('Player');
    playerGui.add( playerControls, 'player_x',-5000,5000).listen().onChange(function(){
        controls.getObject().position.x = playerControls.player_x;        
    });
    playerGui.add( playerControls, 'player_y',-5000,5000).listen().onChange(function(){
        controls.getObject().position.y = playerControls.player_y;
    });;
    playerGui.add( playerControls, 'player_z',-5000,5000).listen().onChange(function(){
        controls.getObject().position.z = playerControls.player_z;
    });;

    /*playerGui.add( playerControls, 'direction_x', -90,90).onChange(function(){
        controls.getObject().rotation.x = toRads(playerControls.direction_x);
    });*/
    playerGui.add( playerControls, 'direction', -180,180).listen().onChange(function(){
        controls.getObject().rotation.y = toRads(playerControls.direction);
    });
    //playerGui.add( playerControls, 'direction', 0,360).listen();
    /*playerGui.add( playerControls, 'direction_z', -1,1).onChange(function(){
        controls.getObject().rotation.z = toRads(playerControls.direction_z);
    });*/

    playerGui.add( playerControls, 'fov', 10,120).onChange(function(){
        camera.fov = playerControls.fov;
        camera.updateProjectionMatrix();
    });
    playerGui.add( playerControls, 'speed', 1,9).onChange(function(){
        playerSpeed = playerControls.speed;
    });
    playerGui.add( playerControls, 'gravity').onChange(function(){
        console.log(playerControls.gravity);
    });
    playerGui.add( playerControls, 'get_player_data');
}

function addModelControls(){
    var modelGui = gui.addFolder('Model');

    modelGui.add( modelControls, "pos_x",-5000,5000).onChange(function(){
        model.position.x = modelControls.pos_x;
    });
    modelGui.add( modelControls, "pos_y",-5000,5000).onChange(function(){
        model.position.y = modelControls.pos_y;
    });
    modelGui.add( modelControls, "pos_z",-5000,5000).onChange(function(){
        model.position.z = modelControls.pos_z;
    });

    modelGui.add( modelControls, "rot_x", 0,360).onChange(function(){
        model.rotation.x = toRads(modelControls.rot_x);
    });
    modelGui.add( modelControls, "rot_y",0,360).onChange(function(){
        model.rotation.y = toRads(modelControls.rot_y);
    });
    modelGui.add( modelControls, "rot_z",0,360).onChange(function(){
        model.rotation.z = toRads(modelControls.rot_z);
    });

    modelGui.add( modelControls, "synchronize_scaling").onChange(function(){
        console.log(playerControls.gravity);
    });

    function synchronize_scale(value){
        model.scale.x = model.scale.y = model.scale.z = value;
        modelControls.scale_x = modelControls.scale_y = modelControls.scale_z = value;
    }
    modelGui.add( modelControls, "scale_x", 0.1,5).listen().onChange(function(){
        if(modelControls.synchronize_scaling)
            synchronize_scale(modelControls.scale_x);
        else model.scale.x = modelControls.scale_x;
    });
    modelGui.add( modelControls, "scale_y", 0.1,5).listen().onChange(function(){
        if(modelControls.synchronize_scaling)
            synchronize_scale(modelControls.scale_y);
        else model.scale.y = modelControls.scale_y;
    });
    modelGui.add( modelControls, "scale_z", 0.1,5).listen().onChange(function(){
        if(modelControls.synchronize_scaling)
            synchronize_scale(modelControls.scale_z);
        else model.scale.z = modelControls.scale_z;
    });
    modelGui.add( modelControls, 'get_model_data');
}

function addLightControls(){
    var lightGui = gui.addFolder('Lights');
    var aLight = lightGui.addFolder('Ambient_Light');
    var dLight = lightGui.addFolder('Directional_Light');
    var sLight = lightGui.addFolder('Spot_Light');
    var sLight2 = lightGui.addFolder('Spot_Light2');
    
    //lightGui.add( lightControls, 'get_light_data');

    // Ambient light
    aLight.add(ambientLight, "status").onChange(function(){
        if(ambientLight.status) scene.add(a_light);
        else scene.remove(a_light);
    });
    aLight.add( ambientLight, "intensity",0,1).onChange(function(){
        a_light.intensity = ambientLight.intensity;
    });
    aLight.addColor(ambientLight, "color").onChange(function(){
        a_light1.color.setHex(toHex(ambientLight.color));
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
    dLight.add( directionalLight, "pos_x",-5000,5000).onChange(function(){
        d_light.position.x = directionalLight.pos_x;
    });
    dLight.add( directionalLight, "pos_y",-5000,5000).onChange(function(){
        d_light.position.y = directionalLight.pos_y;
    });
    dLight.add( directionalLight, "pos_z",-5000,5000).onChange(function(){
        d_light.position.z = directionalLight.pos_z;
    });

    // Spotlight 1
    sLight.add(spotLight1, "status").onChange(function(){
        if(spotLight1.status) scene.add(s_light1);
        else scene.remove(s_light1);
    });
    sLight.addColor(spotLight1, "color").onChange(function(){
        s_light1.color.setHex(toHex(spotLight1.color));
    });
    sLight.add( spotLight1, "intensity",0,10).onChange(function(){
        s_light1.intensity = spotLight1.intensity;
    });
    sLight.add( spotLight1, "pos_x",-5000,5000).onChange(function(){
        s_light1.position.x = spotLight1.pos_x;
    });
    sLight.add( spotLight1, "pos_y",-5000,5000).onChange(function(){
        s_light1.position.y = spotLight1.pos_y;
    });
    sLight.add( spotLight1, "pos_z",-5000,5000).onChange(function(){
        s_light1.position.z = spotLight1.pos_z;
    });

    // Spotlight 2
    sLight2.add(spotLight2, "status").onChange(function(){
        if(spotLight2.status) scene.add(s_light2);
        else scene.remove(s_light2);
    });
    sLight2.addColor(spotLight2, "color").onChange(function(){
        s_light2.color.setHex(toHex(spotLight2.color));
    });
    sLight2.add( spotLight2, "intensity",0,10).onChange(function(){
        s_light2.intensity = spotLight2.intensity;
    });
    sLight2.add( spotLight2, "pos_x",-5000,5000).onChange(function(){
        s_light2.position.x = spotLight2.pos_x;
    });
    sLight2.add( spotLight2, "pos_y",-5000,5000).onChange(function(){
        s_light2.position.y = spotLight2.pos_y;
    });
    sLight2.add( spotLight2, "pos_z",-5000,5000).onChange(function(){
        s_light2.position.z = spotLight2.pos_z;
    });

    // Print light data
    //lightGui.add( ..., '...');
}

function addSceneControls(){
    var sceneGui = gui.addFolder('Scene');
    sceneGui.add( sceneControls, 'get_scene_data');
}

function addSaveSettings(){
    var save = new function(){
        this.Print_Data = function() { 
            playerControls.get_player_data();
            modelControls.get_model_data();
        }
    }
    gui.add( save, 'Print_Data');
}

addPlayerControls();
addModelControls();
addLightControls();
addSceneControls();
addSaveSettings();

gui.close();