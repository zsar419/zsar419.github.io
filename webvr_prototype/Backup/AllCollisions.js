var rays = [
	new THREE.Vector3(0, 0, 1),
	new THREE.Vector3(1, 0, 1),
	new THREE.Vector3(1, 0, 0),
	new THREE.Vector3(1, 0, -1),
	new THREE.Vector3(0, 0, -1),
	new THREE.Vector3(-1, 0, -1),
	new THREE.Vector3(-1, 0, 0),
	new THREE.Vector3(-1, 0, 1)
	//new THREE.Vector3( 0, -1, 0 ),
	//new THREE.Vector3( 0, 1, 0 )
];

var collidable = []	// Push meshes into here (doesnt work for collada models)
function getCollision(){	// Projects rays in all direction (from array)
	for (i = 0; i < rays.length; i += 1){
		raycaster.set( controls.getObject().position , rays[i]);
		//raycaster.ray.origin.copy( controls.getObject().position );
		var intersections = raycaster.intersectObjects( collidable );
		// var intersections = raycaster.intersectObjects( scene.children, true );	// For Collada models
		if ( intersections.length ) {
			console.log('hi');
			return true;
		}
	}
	return false;
}

// Projecting ray forward only (collada models):
function getForwardCollision(){		// Project ray forward only
	var direction = camera.getWorldDirection();
	var forward = new THREE.Vector3(direction.x, direction.y, direction.z);
	raycaster.set( controls.getObject().position , forward);
	var intersections = raycaster.intersectObjects( scene.children, true );
	if ( intersections.length > 0 === true ) {
		console.log('hit');
		return true;
	}
	return false;
}