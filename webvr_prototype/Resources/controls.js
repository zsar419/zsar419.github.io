// First Person Camera Controls
function lockMousePointer(controls) {
	// Hook pointer lock function to document
	document.addEventListener( 'pointerlockchange', (()=>{controls.enabled = document.pointerLockElement === document.body?true:false}), false );
	document.body.addEventListener( 'click', (()=> {document.body.requestPointerLock()}), false );
} // */

// Optimize with bits ***
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
function addPCControls(model) {
	// Also add pointerlock controls here too (called in one place)
	// Declare actions on buttons
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true;
				break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( !player_c.fly_mode) {
					if(canJump === true) velocity.y += player_c.jump_velocity;
					canJump = false;
				} else player.translateY( 5 );
				break;
			case 17: // ctrl
				if ( player_c.fly_mode) player.translateY( -5 );
				break;
		}
	};
	
	// Declare actions on button up
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
} // */

var mouseMovement = false;
function addMobileMovement(){
	document.addEventListener("mousedown", () =>{
		mouseMovement = !mouseMovement;
		moveForward = mouseMovement;//&!player.isFlying==true?true:false;
	});
}

// document.addEventListener("mouseup", function(){});

// Rendering Movement Changes
function renderPCMovement(player, collision, ground_ray_height) {
	var time = performance.now();
	var playerSpeed = 1600-(player_c.speed*100); // 400~1500
	var delta = ( time - prevTime ) / playerSpeed;
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	
	// Prevents forward movement when colliding
	if ( moveForward && !collision) velocity.z -= 400.0 * delta;
	if ( moveBackward ) velocity.z += 400.0 * delta;
	if ( moveLeft ) velocity.x -= 400.0 * delta;
	if ( moveRight ) velocity.x += 400.0 * delta;

	player.translateX( velocity.x * delta );
	player.translateZ( velocity.z * delta );

	if(!player.isFlying) {
		// Gravity	
		velocity.y -= 9.8 * 10 * delta; // 10.0 = mass
		player.translateY( velocity.y * delta );
		// Ground collision
		if(ground_ray_height){
			if( player.position.y <= ground_ray_height ) {	// height based
				velocity.y = 0;
				player.position.y = ground_ray_height;
				canJump = true;
			}
		}
	}
	prevTime = time;
}