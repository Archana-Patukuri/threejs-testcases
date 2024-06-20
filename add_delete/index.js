import * as THREE from 'three';

			import Stats from 'three/addons/libs/stats.module.js';
			import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
			import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
			import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

			let scene, renderer, camera, stats;
			let model, clock;			
			init();

			function init() {
				let deleteBtn=document.getElementById("delete")
				const container = document.getElementById( 'container' );
				clock = new THREE.Clock();

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xa0a0a0 );
				scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );				

				const dirLight = new THREE.DirectionalLight( 0xffffff );
				dirLight.position.set( 3, 10, 10 );
				dirLight.castShadow = true;
				dirLight.shadow.camera.top = 2;
				dirLight.shadow.camera.bottom = - 2;
				dirLight.shadow.camera.left = - 2;
				dirLight.shadow.camera.right = 2;
				dirLight.shadow.camera.near = 0.1;
				dirLight.shadow.camera.far = 40;
				scene.add( dirLight );

				// ground

				const mesh = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
				mesh.rotation.x = - Math.PI / 2;
				mesh.receiveShadow = true;
				scene.add( mesh );
                console.log(window.performance)
                console.log(`JS Heap Size Limit ${Math.round(performance.memory.jsHeapSizeLimit / Math.pow(1000, 2),1)} MB`);	
                console.log(`Empty space, JS Heap Size ${Math.round(performance.memory.usedJSHeapSize / Math.pow(1000, 2),1)} MB`);	
				const loader = new GLTFLoader();
				let addTable=document.getElementById("addTable")
				let addChair=document.getElementById("addChair")
				let URL='models/gltf/ChairAndTableModels/Chair02.glb'
				addTable.addEventListener("click",function(){
					URL='models/gltf/ChairAndTableModels/Table_Manual_Height_Up.glb'
					loadgltf(URL)
				})
				addChair.addEventListener("click",function(){
                    URL='models/gltf/ChairAndTableModels/Chair02.glb'
					// URL='models/gltf/ChairAndTableModels/Chair03Compressed.glb'
					loadgltf(URL)
				})
				loadgltf(URL)
				function loadgltf(URL){
					loader.load( URL, function ( gltf ) {
					model = gltf.scene;
					scene.add( model );
					model.traverse( function ( object ) {
						if ( object.isMesh ) object.castShadow = true;
					} );
					animate();
                     console.log("renderer memory",renderer.info.memory)
                    console.log(`After adding,Currently using JS Heap Size ${Math.round(performance.memory.usedJSHeapSize / Math.pow(1000, 2),1)} MB`);	
				} );
				}
				

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.outputEncoding = THREE.sRGBEncoding;
				renderer.shadowMap.enabled = true;
				container.appendChild( renderer.domElement );

				// camera
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
				camera.position.set( - 1, 2, 3 );

				const controls = new OrbitControls( camera, renderer.domElement );
				controls.enablePan = false;
				controls.enableZoom = false;
				controls.target.set( 0, 1, 0 );
				controls.update();

				stats = new Stats();
				container.appendChild( stats.dom );
				console.log(scene)
				deleteBtn.addEventListener("click",async function (){										
				 async function disposeResources(mtrl){
	if(mtrl.alphaMap){
		mtrl.alphaMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.alphaMap.source.uuid))
	}
	if(mtrl.aoMap){
		mtrl.aoMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.aoMap.source.uuid))
	}
	if(mtrl.blendDstAlpha){
		mtrl.blendDstAlpha.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.blendDstAlpha.source.uuid))
	}
	if(mtrl.blendEquationAlpha){
		mtrl.blendEquationAlpha.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.blendEquationAlpha.source.uuid))
	}
	if(mtrl.blendSrcAlpha){
		mtrl.blendSrcAlpha.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.blendSrcAlpha.source.uuid))
	}
	if(mtrl.bumpMap){
		mtrl.bumpMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.bumpMap.source.uuid))
	}
	if(mtrl.displacementMap){
		mtrl.displacementMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.displacementMap.source.uuid))
	}
	if(mtrl.emissiveMap){
		mtrl.emissiveMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.emissiveMap.source.uuid))
	}
	if(mtrl.envMap){
		mtrl.envMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.envMap.source.uuid))
	}
	if(mtrl.lightMap){
		mtrl.lightMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.lightMap.source.uuid))
	}
	if(mtrl.map){
		mtrl.map.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.map.source.uuid))
	}
	if(mtrl.metalnessMap){
		mtrl.metalnessMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.metalnessMap.source.uuid))
	}
	if(mtrl.normalMap){
		mtrl.normalMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.normalMap.source.uuid))
	}
	if(mtrl.roughnessMap){
		mtrl.roughnessMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.roughnessMap.source.uuid))
	}
	if(mtrl.specularMap){
		mtrl.specularMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.specularMap.source.uuid))
	}
	if(mtrl.gradientMap){
		mtrl.gradientMap.dispose()
		// engineParameters.scene.remove(engineParameters.scene.getObjectById(mtrl.gradientMap.source.uuid))
	}
	mtrl.dispose()
	mtrl=undefined
} 	
						while(scene.children.length>0){	
                            scene.children[0].traverse(async function (node){
                                if(node.isMesh){  							       
                                    node.geometry.dispose();                                    
                                    node.material.dispose()                                    
                                   await disposeResources(node.material)
                                   node.geometry=undefined
                                   node.material=undefined                                     
                                }	                                                    
                            })     
                           
                            scene.remove(scene.children[0])	  
                            // scene.children[0]=undefined                    							
						}	
                         console.log("renderer memory",renderer.info.memory)
                         console.log("allocated memory",Math.round(performance.memory.totalJSHeapSize/ Math.pow(1000, 2),1))                         
                        console.log(`After delete,Currently using JS Heap Size ${Math.round(performance.memory.usedJSHeapSize / Math.pow(1000, 2),1)} MB`);			
					})	

				window.addEventListener( 'resize', onWindowResize );

			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}

			function animate() {
				requestAnimationFrame( animate );
				stats.update();
				renderer.render( scene, camera );
			}

	