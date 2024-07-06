import * as THREE from 'three';
import Spell from './Spell';

// Load shaders
const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_PointSize = 1.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;  // Load vertex.glsl content

const fragmentShader = `
    varying vec3 vPosition;

    void main() {
        float intensity = length(vPosition);
        vec3 color = vec3(0, 0, 0);
        gl_FragColor = vec4(color, 1.0);
    }
    `; // Load fragment.glsl content

class X extends Spell {
    constructor() {
        super();

        const count = 15;
        const points = [];

        for (let i = 0; i < count; ++i) {
            console.log(i);
            let x = (Math.random() - 0.5) * 1;
            let y = (Math.random() - 0.5) * 1;
            let z = (Math.random() - 0.5) * 1;
            points.push(new THREE.Vector3(x, y, z));
        }

        // Create particle geometry
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        const x = new THREE.Line(geometry, material);
        this.add(x);
    }

    update() {

    }
} 