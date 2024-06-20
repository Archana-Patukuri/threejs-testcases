/* import * as CANNON from "cannon-es";
import * as THREE from "three";
import CannonDebugger from "cannon-es-debugger";

const bodyShapesData = {
  plane: (vec) => new CANNON.Plane(),
  box: (vec) => new CANNON.Box(vec),
  trimesh: (vec) => new CANNON.Trimesh(),
};

const bodyTypesData = {
  static: CANNON.Body.STATIC,
  kinematic: CANNON.Body.KINEMATIC,
  dynamic: CANNON.Body.DYNAMIC,
};

export default class Physics {
  constructor(scene) {
    this.threejsScene = scene;
    this.gravity = new CANNON.Vec3(0, -9.81, 0);
    this.timeStep = 1 / 60;
    this.physicsWorld = new CANNON.World({
      gravity: this.gravity,
    });
    this.cannonDebugger = new CannonDebugger(
      this.threejsScene,
      this.physicsWorld
    );
    this.obectData = [];
  }

  enablePhysicsForObject(threejObject, bodyShape, bodyType) {
    let box = new THREE.Box3().setFromObject(threejObject);
    let boxSize = new THREE.Vector3();
    box.getSize(boxSize);
    boxSize.divideScalar(2);
    let vertexArray;
    let indexArray;
    if (bodyType === "trimesh") {
      vertexArray = threejObject.geometry.attributes.position.array;
      indexArray = threejObject.geometry.index.array;
    }
    console.log(vertexArray, indexArray);

    const threejsPosition = threejObject.getWorldPosition(new THREE.Vector3());
    const threejsRotation = threejObject.getWorldQuaternion(
      new THREE.Quaternion()
    );

    const body = new CANNON.Body({
      shape: bodyShapesData[bodyShape](
        new CANNON.Vec3(boxSize.x, boxSize.y, boxSize.z)
      ),
      type: bodyTypesData[bodyType],
      mass: bodyType === "static" ? 0 : 1,
      position: threejsPosition,
      quaternion: threejsRotation,
    });

    console.log(threejsPosition, threejsRotation);
    const phyPosition = new CANNON.Vec3(...Object.values(threejsPosition));

    // body.position.y = boxSize.y;
    console.log(body, threejObject);
    this.physicsWorld.addBody(body);
    this.obectData.push({
      threejObject,
      cannonObject: body,
    });
  }

  update() {
    // console.log(this.obectData);
    this.obectData.forEach((object) => {
      object.threejObject.position.copy(object.cannonObject.position);
    });
    this.physicsWorld.step(this.timeStep);
    this.cannonDebugger.update();
  }
}
 */