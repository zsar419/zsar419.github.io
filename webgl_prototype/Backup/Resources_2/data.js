var playerControls = new function(){
    this.player_x = 0;
    this.player_y = 25;
    this.player_z = 0;

    //this.direction_x = 0;
    this.direction = 0;
    //this.direction_z = 0;

    this.fov = 75;
    this.speed = 5; // Can improve on the speed formula 

    this.get_player_data = function() { 
        console.log("X: ",this.player_x,"\nY: ",this.player_y,"\nZ: ",this.player_z); 
        console.log("direction: ",this.direction);    
        console.log("fov: ", this.fov);
        console.log("speed: ", this.speed);    
    };

    this.gravity = false;
    // height?
}
var modelControls = new function(){
    this.pos_x = -500;
    this.pos_y = 0;
    this.pos_z = 0;

    this.rot_x = 0;
    this.rot_y = 0;
    this.rot_z = 0;

    this.scale_x = 0.5;
    this.scale_y = 0.5;
    this.scale_z = 0.5;
    this.synchronize_scaling = false; // Need to update all elements

    this.get_model_data = function() { 
        console.log("pos_x: ",this.pos_x,"\npos_y: ",this.pos_y,"\npos_z: ",this.pos_z); 
        console.log("rot_x: ",this.rot_x,"\nrot_y: ",this.rot_y, "\nrot_z: ",this.rot_z);    
        console.log("scale_x: ",this.scale_x,"\nscale_y: ",this.scale_y, "\nscale_z: ",this.scale_z);    
    };
}

var toHex = function(str){
    return parseInt(str.replace(/^#/, ''), 16);
}
var ambientLight = new function(){
    this.status = false;
    this.color = "#808080";
    this.intensity = 0.5;
}

var directionalLight = new function(){
    this.status = true;
    this.color = "#ffffff";
    this.intensity = 0.8;
    this.pos_x = 0;
    this.pos_y = 400;
    this.pos_z = 300;
    // Target model
}

var spotLight1 = new function(){
    this.status = true;
    this.color = "#ffffff";
    this.intensity = 0.5;
    this.pos_x = 0;
    this.pos_y = 400;
    this.pos_z = 0;
    
}

var spotLight2 = new function(){
    this.status = false;
    this.color = "#ffffff";
    this.intensity = 0.5;
    this.pos_x = 0;
    this.pos_y = 0;
    this.pos_z = 0;
}

var sceneControls = new function(){
    this.get_scene_data = function() { 
    };
    // rendering colour
}