// First Person Camera Controls
function lockMousePointer(controls) {
	// Functon called when click occurs
	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === document.body ) 
			controls.enabled = true;
		else	// Mouse outside of screen
			controls.enabled = false;
	}; 
	
	// Hook pointer lock function to document
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.body.addEventListener( 'click', function ( event ) {
		document.body.requestPointerLock();
	}, false );
}

// Optimize with bits ***
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
function addPCControls(model) {
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
}

// Rendering Movement Changes
function renderPCMovement(player, collision, g_collision) {
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
		if ( g_collision ){
			var ground_ray_height = player_c.height + ground_r.point.y -2.5;
			//ground_ray_height += ground_r.point.y>-1?ground_r.point.y:0;
			if( player.position.y <= ground_ray_height ) {	// height based
				velocity.y = 0;
				player.position.y = ground_ray_height;
				canJump = true;
			}
		} // */
	}

	prevTime = time;
}