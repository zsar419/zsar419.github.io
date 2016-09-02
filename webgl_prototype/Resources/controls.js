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
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
			// Model controls
			case 189:	// -
				controls.getObject().position.y -= 1;
				break;
			case 187:	// =
				controls.getObject().position.y += 1;
				break;
			case 190:	// .
				model.scale.x += 0.1;
				model.scale.y += 0.1;
				model.scale.z += 0.1;
				break;
			case 188:	// ,	
				model.scale.x -= 0.1;
				model.scale.y -= 0.1;
				model.scale.z -= 0.1;
				break;
			case 192:	// ~
				console.log(controls.getObject().position);
				console.log(model.scale);
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
function renderPCMovement(player, collision) {
	var time = performance.now();
	var playerSpeed = 1600-(playerControls.speed*100); // 400~1500
	var delta = ( time - prevTime ) / playerSpeed; 
	velocity.x -= velocity.x * 10.0 * delta;
	velocity.z -= velocity.z * 10.0 * delta;
	// Needa account for gravity
	//velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
	
	// Prevents forward movement when colliding
	if ( moveForward && !collision) velocity.z -= 400.0 * delta;
	if ( moveBackward ) velocity.z += 400.0 * delta;
	if ( moveLeft ) velocity.x -= 400.0 * delta;
	if ( moveRight ) velocity.x += 400.0 * delta;
	player.translateX( velocity.x * delta );
	player.translateY( velocity.y * delta );
	player.translateZ( velocity.z * delta );
	prevTime = time;
}