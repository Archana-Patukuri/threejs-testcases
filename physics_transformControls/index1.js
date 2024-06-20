import * as THREE from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
let  control,selectedObject
import {    
    Raycaster,
    Vector2
  } from 'three';
  let mouse = new Vector2(),Objects=[];
import SceneInit from "./lib/SceneInit";
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

const test = new SceneInit("myThreeJsCanvas");
test.initialize();
test.animate();
let rayCaster = new Raycaster(),enablePhysics=true;

// TRANSFORM CONTROLS
				control = new TransformControls( test.camera, test.renderer.domElement );
				control.addEventListener( 'change', render );
                control.setMode( 'translate' );				
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


                const loader = new GLTFLoader();        
                const dracoLoader = new DRACOLoader();
                dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
                loader.setDRACOLoader(dracoLoader);

                let addTable = document.getElementById('addTable');
                let addChair = document.getElementById('addChair');
                let physicsUI = document.getElementById('physicsUI');
                let URL = 'models/Table_Automatic_01_v01.glb';

	addTable.addEventListener('click', function () {
		URL = 'models/Desk_Lamp.glb';
		loadgltf(URL);
	});
	addChair.addEventListener('click', function () {
		URL = 'models/Table_Automatic_01_v01.glb';		
		loadgltf(URL);
	});
    loadgltf(URL);
    physicsUI.addEventListener('change', function (e) {
      if(e.target.checked){
        enablePhysics=true
      }else{
        enablePhysics=false
      }
     
    });


// PHYSICS
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
boxBody.position.set(0, 10, 0);
boxBody.linearDamping = 0.41;
// physicsWorld.addBody(boxBody);

const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
// test.scene.add(boxMesh);

test.scene.background=new THREE.Color(1,1,1)

// control.attach( boxMesh );
test.scene.add( control );
control.setMode( 'translate' );
// control.position.y-=2        


let boxBodyTable,boxBodyLamp,tableSize,lampSize,tablePos

function loadgltf(URL) {
    loader.load(URL, function (gltf) {        
        let model = gltf.scene;
        console.log(model.children[0].name) 
        let group=new THREE.Group()  
        group.name='selectable'      
        group.add(model)

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const pos = box.getCenter(new THREE.Vector3());
        if (size.x < 0.1) {
          size.x = 0.1;
        }
        if (size.y < 0.1) {
          size.y = 0.1;
        }
        if (size.z < 0.1) {
          size.z = 0.1;
        }
        
         
        
    if(model.children[0].name.includes('Table')){   
        boxBodyTable = new CANNON.Body({
            mass: 10,
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
          });
          tableSize=size
          boxBodyTable.position.set(0, 1, 0);
          // model.children[0].position.y=model.children[0].position.y
          boxBodyTable.position.copy(group.position)
          boxBodyTable.linearDamping = 0.99;     
        physicsWorld.addBody(boxBodyTable);        
        test.scene.add(group); 
        console.log(model)
    }else{
        let Table_101=test.scene.getObjectByName('Table_101');
        boxBodyLamp = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
          });
          lampSize=size
          boxBodyLamp.position.set(0, 1.2, 0);
          boxBodyLamp.linearDamping = 0.99;
        physicsWorld.addBody(boxBodyLamp);
        test.scene.add(group); 
        // boxBodyTable.addCompoundBody(boxBodyLamp);
        // Table_101.add(group)
    }
          Objects.push(group)
          // control.attach( group );
                      
        // animate();			
    });
}
test.renderer.domElement.addEventListener('click', () => {
    handleSelect();
  });
  function handleSelect(){
    // test.renderer.setRenderTarget(null);
    rayCaster.setFromCamera(mouse, test.camera);
    let arr = rayCaster.intersectObjects(Objects);
    if(arr[0]){    
    let tempObject = arr[0].object;  
        while (tempObject && !tempObject.name.includes('selectable')) {
          tempObject = tempObject.parent;
          if (tempObject && tempObject.name.includes('selectable')) {
            selectedObject = tempObject;        
          }   
          if(selectedObject){
        //   console.log(selectedObject)  
          control.attach( selectedObject );
        //   control.position.copy(selectedObject.children[0].position)
          }
        }
    }
  }



function render() {    
  test.renderer.render( test.scene, test.camera );
  if(selectedObject.children[0].children[0].name.includes('Table')){   
  boxBodyTable.position.copy(control.object.position)  
  if(boxBodyLamp){    
    const constraint = new CANNON.PointToPointConstraint(
      boxBodyTable, new CANNON.Vec3(0, 0.5, 0), // Anchor point on parent
      boxBodyLamp, new CANNON.Vec3(0, 0, 0) // Anchor point on child
    );
    physicsWorld.addConstraint(constraint);
  }
  }else{
  boxBodyLamp.position.copy(control.object.position)
  }
}

const animate = () => {
  if (enablePhysics) physicsWorld.fixedStep();
  
  cannonDebugger.update();
  boxMesh.position.copy(boxBody.position);
  boxMesh.quaternion.copy(boxBody.quaternion);

  if(Objects[0]){
  Objects[0].position.copy(boxBodyTable.position);
  // Objects[0].position.y -= tableSize.y / 2;
  Objects[0].quaternion.copy(boxBodyTable.quaternion);
  }

  if(Objects[1]){
  Objects[1].position.copy(boxBodyLamp.position);
  // Objects[1].position.y -= lampSize.y / 2;
  Objects[1].quaternion.copy(boxBodyLamp.quaternion);  
  }

    window.requestAnimationFrame(animate);     
};
animate();
