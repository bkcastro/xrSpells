import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { XRButton } from 'three/addons/webxr/XRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import spellCaster from './xr/SpellCaster';
import itemManager from './xr/ItemManager';
import MainUI from './xr/MainUI';

let container;
let camera, scene, renderer, clock, orbitControls;
let mouse, controller1, controller2, line;
let controllerGrip1, controllerGrip2;

let raycaster;

let controls, group;

let items, mainUI;

// debug 

let stats;

init();

function init() {

  stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);

  container = document.createElement('div');
  document.body.appendChild(container);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x118080);
  //scene.add(new THREE.AxesHelper(1));

  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
  camera.position.set(0, 3, 3);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const floorGeometry = new THREE.PlaneGeometry(6, 6);
  const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.25, blending: THREE.CustomBlending, transparent: false });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = - Math.PI / 2;
  floor.receiveShadow = true;
  // scene.add(floor);

  scene.add(new THREE.HemisphereLight(0xbcbcbc, 0xa5a5a5, 3));

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(0, 6, 0);
  light.castShadow = true;
  light.shadow.camera.top = 3;
  light.shadow.camera.bottom = - 3;
  light.shadow.camera.right = 3;
  light.shadow.camera.left = - 3;
  light.shadow.mapSize.set(4096, 4096);
  scene.add(light);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(animate);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;
  renderer.xr.setFoveation(0.0);
  container.appendChild(renderer.domElement);

  document.body.appendChild(XRButton.createButton(renderer));

  // controllers

  // orbitControls = new OrbitControls(camera, renderer.domElement);

  mouse = new THREE.Vector2();

  window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener("click", onSelect);

  controller1 = renderer.xr.getController(0);
  controller1.addEventListener('select', onSelect);
  controller1.addEventListener('selectstart', onControllerEvent);
  controller1.addEventListener('selectend', onControllerEvent);
  controller1.addEventListener('move', onControllerEvent);
  controller1.userData.active = false;
  scene.add(controller1);

  controller2 = renderer.xr.getController(1);
  controller2.addEventListener('select', onSelect);
  controller2.addEventListener('selectstart', onControllerEvent);
  controller2.addEventListener('selectend', onControllerEvent);
  controller2.addEventListener('move', onControllerEvent);
  controller2.userData.active = true;
  scene.add(controller2);

  const controllerModelFactory = new XRControllerModelFactory();

  controllerGrip1 = renderer.xr.getControllerGrip(0);
  controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
  scene.add(controllerGrip1);

  controllerGrip2 = renderer.xr.getControllerGrip(1);
  controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
  scene.add(controllerGrip2);

  //

  const geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, - 1)]);

  line = new THREE.Line(geometry);
  line.name = 'line';
  line.scale.z = 5;

  raycaster = new THREE.Raycaster();

  // controls

  controls = new TransformControls(camera, renderer.domElement);
  scene.add(controls);

  //

  mainUI = new MainUI();
  mainUI.position.set(-0.5, 1.0, -0.25);
  scene.add(mainUI);

  // Lets add some spells
  spellCaster.scale.multiplyScalar(1 / 2);
  spellCaster.position.set(.5, 1.25, 0);
  spellCaster.castSpell('julia');
  scene.add(spellCaster);

  window.addEventListener('resize', onWindowResize);

  clock = new THREE.Clock();
}

function onSelect(event) {

  const controller = event.target;

  controller1.userData.active = false;
  controller2.userData.active = false;

  if (controller === controller1) {

    controller1.userData.active = true;
    controller1.add(line);

  }

  if (controller === controller2) {

    controller2.userData.active = true;
    controller2.add(line);

  }

  // This means that the input came from the 2D canvas 
  if (controller instanceof HTMLCanvasElement) {
    raycaster.setFromCamera(mouse, camera);
  } else {
    raycaster.setFromXRController(controller);
  }



  const intersects = raycaster.intersectObjects([spellCaster.spell.bb, mainUI]);

  if (intersects.length > 0) {

    // Check what type of item got intersected 
    const object = intersects[0].object;
    console.log(object);
    switch (object.userData.type) {
      case 'ui_handle':
        controls.attach(object);
        break;
      case 'ui_image':
        console.log("trigger some action which is associated with the object");
        object.userData.action();
        controls.detach();
        break;
      case 'spell_bb':
        controls.attach(object);
        break;

    }

  } else {
    controls.detach();
  }

}

function onControllerEvent(event) {

  const controller = event.target;

  if (controller.userData.active === false) return;

  controls.getRaycaster().setFromXRController(controller);

  switch (event.type) {

    case 'selectstart':
      controls.pointerDown(null);
      break;

    case 'selectend':
      controls.pointerUp(null);
      break;

    case 'move':
      controls.pointerHover(null);
      controls.pointerMove(null);
      break;

  }

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  stats.begin();

  const elapsed = clock.getElapsedTime();

  mainUI.update();
  spellCaster.update(elapsed);

  renderer.render(scene, camera);

  stats.end();
}
