// Default settings

var toRads = (degrees) => degrees/180*Math.PI;
var toHex = (str) => parseInt(str.replace(/^#/, ''), 16);

var playerControls = new function(){
    this.height = 25;
    
    this.pos_x = 0;
    this.pos_y = this.height;
    this.pos_z = 0;

    //this.direction_x = 0;
    this.direction = 0;
    //this.direction_z = 0;
        // Might need for VR 

    this.fov = 75;
    this.speed = 10; 

    this.fly_mode = false;
}

var modelControls = new function(){
    this.name = 'sketchup-demo.dae';

    this.pos_x = -500;
    this.pos_y = 0;
    this.pos_z = 0;

    this.rot_x = 0;
    this.rot_y = 0;
    this.rot_z = 0;

    this.scale_x = 0.5;
    this.scale_y = 0.5;
    this.scale_z = 0.5;

    // this.shadows = true;
    this.synchronize_scaling = false; // Need to update all elements

    this.load_model = function() {};
}

var sceneControls = new function(){
    this.skycolor = "#1E90FF";  // Need to fix color picker
    //renderer.setClearColor( scene.fog.color );  // Choose colour
}

var planeControls = new function(){
    this.status = true;
    this.color = "#CCCCCC";
    this.pos_x = 0;
    this.pos_y = -5;
    this.pos_z = 0;
    this.scale = 5;
}

var ambientLight = new function(){
    this.status = false;
    this.color = "#808080";
    this.intensity = 0.5;
}

var hemisphereLight = new function(){
    this.status = true;
    this.skycolor = "#ffffff";
    this.groundcolor = "#ffffff";
    this.intensity = 0.5;
    this.hue = 0.6;
    this.saturation = 1;
    this.lightness = 0.6;
}

var directionalLight = new function(){
    this.status = true;
    this.color = "#ffffff";
    this.intensity = 0.8;
    this.pos_x = 0;
    this.pos_y = 400;
    this.pos_z = 300;
    this.follow_player = false;
}

var spotLight1 = new function(){
    this.status = true;
    this.color = "#ffffff";
    this.intensity = 0.5;
    this.pos_x = 0;
    this.pos_y = 400;
    this.pos_z = 0;
    this.follow_player = false;
}

var spotLight2 = new function(){
    this.status = false;
    this.color = "#ffffff";
    this.intensity = 0.5;
    this.pos_x = 0;
    this.pos_y = 0;
    this.pos_z = 0;
    this.follow_player = false;
}