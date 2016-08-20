var playerControls = new function(){
    this.player_x = 0;
    this.player_y = 25;
    this.player_z = 0;

    this.direction_x = 0;
    this.direction_y = 0;
    this.direction_z = 0;

    this.fov = 75;
    this.speed = 5; // Can improve on the speed formula 

    this.get_player_data = function() { 
        console.log("X: ",this.player_x,"\nY: ",this.player_y,"\nZ: ",this.player_z); 
        console.log("Dir_X: ",this.direction_x,"\nDir_Y: ",this.direction_y,"\nDir_Z: ",this.direction_z);    
        console.log("fov: ", this.fov);    
        console.log("speed: ", this.speed);    
    };

    this.gravity = false;

    // height?
    // starting player position (x,y,z)
    // starting player direction

    // extra: current player pos, direction
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
var lightControls = new function(){
    // 

    // extra: option to add in new lights
}
var sceneControls = new function(){
    // rendering colour
}