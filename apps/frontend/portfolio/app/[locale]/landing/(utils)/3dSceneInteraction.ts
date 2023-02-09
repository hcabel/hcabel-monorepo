import * as THREE from "three";

// WARN: This function is not working perfectly, it's the closest I could get to the result I wanted
// And with some tweaking it's working well enough for my use case
export function GetCameraPositionToFocusBox(
	fbox: THREE.Box3,
	direction: THREE.Vector3,
	camera: THREE.PerspectiveCamera
): THREE.Vector3 {
	const fov = camera.fov;
	const aspect = camera.aspect;

	const boxCenter = new THREE.Vector3();
	fbox.getCenter(boxCenter);
	const boxSizes = new THREE.Vector3();
	fbox.getSize(boxSizes);
	let radius = Math.max(boxSizes.x, boxSizes.y, boxSizes.z);

	if (aspect > 1) {
		radius /= aspect;
	}

	const halfFovRadian = THREE.MathUtils.degToRad(fov / 2);
	const distance = radius / Math.tan(halfFovRadian);
	const cameraOffset = direction.normalize().multiplyScalar(distance);

	const pos = new THREE.Vector3();
	pos.addVectors(boxCenter, cameraOffset);

	return pos;
}
