import * as THREE from 'three';
import Spell from './Spell';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

function getRandomAsciiChar() {
    // Generate a random number between 32 and 126
    const asciiCode = Math.floor(Math.random() * (127 - 32) + 32);

    // Convert the ASCII code to a character
    return String.fromCharCode(asciiCode);
}

function randomPointInSphere(radius) {
    let u = Math.random();
    let v = Math.random();
    let theta = u * 2.0 * Math.PI; // Angle around the X-axis
    let phi = Math.acos(2.0 * v - 1.0); // Angle from the Z-axis down
    let r = Math.cbrt(Math.random()) * radius; // Cube root to ensure uniform distribution

    let sinTheta = Math.sin(theta);
    let cosTheta = Math.cos(theta);
    let sinPhi = Math.sin(phi);
    let cosPhi = Math.cos(phi);

    let x = r * sinPhi * cosTheta;
    let y = r * sinPhi * sinTheta;
    let z = r * cosPhi;

    return { x, y, z };
}

// Load font 
const loader = new FontLoader();


const material = new THREE.LineBasicMaterial({ color: new THREE.Color("black") });
const nameMaterial = new THREE.LineBasicMaterial({ color: new THREE.Color("red") });

export default class BKCastro extends Spell {
    constructor() {
        super();

        this.userData.name = 'bkcastro';
        this.userData.image = './images/spells/bkcastro.png';

        this.asciis = [];
        this.nameArray = [];
        this.duration = 10;

        let temp = this;
        loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
            temp.generateASCII(font)
        });
    }

    generateASCII(font) {
        var scale = 1.5;

        for (var i = 0; i < 100; i++) {

            const geometry = new TextGeometry(getRandomAsciiChar(), {
                font: font,
                size: .2,
                height: .05,
            });

            const randomX = Math.random() * 2 * Math.PI; // Rotation around X axis
            const randomY = Math.random() * 2 * Math.PI; // Rotation around Y axis
            const randomZ = Math.random() * 2 * Math.PI; // Rotation around Z axis   

            const point = randomPointInSphere(scale)

            const mesh = new THREE.Mesh(geometry, material)
            mesh.position.set(point.x, point.y, point.z)
            mesh.rotation.set(randomX, randomY, randomZ);
            this.asciis.push(mesh)
            this.group.add(mesh)
        }

        let name = "bkcastro"
        scale -= 0.1

        let cursor = -0.5;

        for (var i = 0; i < name.length; i++) {
            const geometry = new TextGeometry(name[i], {
                font: font,
                size: .2,
                height: .05,
            });

            geometry.computeBoundingBox();

            const x = (Math.random() * scale * 2) - scale
            const y = (Math.random() * scale * 2) - scale
            const z = (Math.random() * scale * 2) - scale

            const mesh = new THREE.Mesh(geometry, nameMaterial)
            mesh.position.set(x, y, z)
            //mesh.rotation.set(randomX, randomY, randomZ);
            this.group.add(mesh)
            //nameGroup.add(mesh)
            this.nameArray.push({ initialPosition: new THREE.Vector3(x, y, z), targetPosition: new THREE.Vector3(cursor, 0, 0), mesh })
            cursor += geometry.boundingBox.max.x;
        }
    }

    animate(time) {
        this.nameArray.forEach((value) => {

            let t = time / this.duration;
            t = Math.min(t, 1); // Clamp value to 1
            value.mesh.position.lerpVectors(value.initialPosition, value.targetPosition, t);
            console.log(value.mesh.position)
            //value.mesh.lookAt(camera.position)
        })

        this.asciis.forEach((mesh) => {
            mesh.rotation.x += 0.001;
            mesh.rotation.z += 0.0008;
        })

    }
}
