import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
let scene, renderer, control, orbit;
let cameraPersp, cameraOrtho, currentCamera,camera;

import SceneInit from "./lib/SceneInit";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
const test = new SceneInit("myThreeJsCanvas");
test.initialize();
test.animate();

/* 
        const controls = new OrbitControls(test.camera, test.renderer.domElement);      
        controls.target.set(0, 1, 0);
        controls.update(); */


				control = new TransformControls( test.camera, test.renderer.domElement );
				control.addEventListener( 'change', render );
        control.setMode( 'translate' );
				console.log(control);

				control.addEventListener( 'dragging-changed', function ( event ) {

					test.controls.enabled = ! event.value;
					//console.log(JSON.stringify(event));          

				} );
        

				window.addEventListener( 'keyup', function ( event ) {

					switch ( event.keyCode ) {

						case 16: // Shift
							control.setTranslationSnap( null );
							control.setRotationSnap( null );
							control.setScaleSnap( null );
							break;

					}

				} );

        window.addEventListener( 'keydown', function ( event ) {

					switch ( event.keyCode ) {

						case 81: // Q
							control.setSpace( control.space === 'local' ? 'world' : 'local' );
							break;

						case 16: // Shift
							control.setTranslationSnap( 100 );
							control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
							control.setScaleSnap( 0.25 );
							break;

						case 87: // W
							control.setMode( 'translate' );
							break;

						case 69: // E
							control.setMode( 'rotate' );
							break;

						case 82: // R
							control.setMode( 'scale' );
							break;

						case 67: // C
							const position = currentCamera.position.clone();

							currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
							currentCamera.position.copy( position );

							orbit.object = currentCamera;
							control.camera = currentCamera;

							currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
							onWindowResize();
							break;

						case 86: // V
							const randomFoV = Math.random() + 0.1;
							const randomZoom = Math.random() + 0.1;

							cameraPersp.fov = randomFoV * 160;
							cameraOrtho.bottom = - randomFoV * 500;
							cameraOrtho.top = randomFoV * 500;

							cameraPersp.zoom = randomZoom * 5;
							cameraOrtho.zoom = randomZoom * 5;
							onWindowResize();
							break;

						case 187:
						case 107: // +, =, num+
							control.setSize( control.size + 0.1 );
							break;

						case 189:
						case 109: // -, _, num-
							control.setSize( Math.max( control.size - 0.1, 0.1 ) );
							break;

						case 88: // X
							control.showX = ! control.showX;
							break;

						case 89: // Y
							control.showY = ! control.showY;
							break;

						case 90: // Z
							control.showZ = ! control.showZ;
							break;

						case 32: // Spacebar
							control.enabled = ! control.enabled;
							break;

						case 27: // Esc
							control.reset();
							break;

					}

				} );




const axesHelper = new THREE.AxesHelper(8);
test.scene.add(axesHelper);

const physicsWorld = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

const groundBody = new CANNON.Body({
  type: CANNON.Body.STATIC,
  shape: new CANNON.Plane(),
  // shape: new CANNON.Box(new CANNON.Vec3(8, 8, 0.1)),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
physicsWorld.addBody(groundBody);

const radius = 1;
const sphereBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Sphere(radius),
});
sphereBody.position.set(0.5, 7, 0);
// physicsWorld.addBody(sphereBody);
sphereBody.angularVelocity.set(0, 10, 0);
sphereBody.angularDamping = 0.7;

const cannonDebugger = new CannonDebugger(test.scene, physicsWorld, {
  // color: 0xff0000,
});

const geometry = new THREE.SphereGeometry(radius);
const material = new THREE.MeshNormalMaterial();
const sphereMesh = new THREE.Mesh(geometry, material);
// test.scene.add(sphereMesh);

const boxBody = new CANNON.Body({
  mass: 5,
  shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
});
boxBody.position.set(1, 10, 0);
boxBody.linearDamping = 0.41;
physicsWorld.addBody(boxBody);

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
test.scene.add(boxMesh);
test.scene.background=new THREE.Color(1,1,1)
control.attach( boxMesh );
				test.scene.add( control );
        control.setMode( 'translate' );
        control.position.y-=2
        // console.log(scene)

function render() {

  test.renderer.render( test.scene, test.camera );
  boxBody.position.copy(control.object.position)
}

const animate = () => {
  physicsWorld.fixedStep();
  cannonDebugger.update();
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);
 /*  sphereMesh.position.copy(sphereBody.position);
  sphereMesh.quaternion.copy(sphereBody.quaternion); */
  // const aspect = window.innerWidth / window.innerHeight;

			/* 	camera.aspect = aspect;
				camera.updateProjectionMatrix(); */

    window.requestAnimationFrame(animate);   
  // render() 
};
animate();
