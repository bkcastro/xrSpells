import * as THREE from 'three';
import Spell from './Spell';

// Load shaders
const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_PointSize = 1.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;  // Load vertex.glsl content
const fragmentShader = `
    varying vec3 vPosition;

    void main() {
        float intensity = length(vPosition);
        vec3 color = vec3(0.3 + 0.3 * sin(1.2831 * vPosition.x + intensity),
                        0.5 + 0.5 * sin(1.2831 * vPosition.y + intensity),
                        0.4 + 0.5 * sin(1.2831 * vPosition.z + intensity));
        gl_FragColor = vec4(color, 1.0);
    }
    `; // Load fragment.glsl content


// Function to randomize operations
function randomizeOperations(x, y, z, c) {
    const operations = [
        { xt: x * x - y * y - z * z + c.x, yt: 2 * x * y + c.y, zt: 2 * x * z + c.z },
        { xt: x * x - z * z - y * y + c.x, yt: 2 * x * z + c.y, zt: 2 * x * y + c.z },
        { xt: -y * y + x * x - z * z + c.x, yt: 2 * y * z + c.y, zt: 2 * y * x + c.z },
        { xt: -z * z + x * x - y * y + c.x, yt: 2 * z * x + c.y, zt: 2 * z * y + c.z },
        { xt: x * x + y * y - z * z + c.x, yt: 2 * x * z + c.y, zt: 2 * y * z + c.z },
        { xt: x * x + z * z - y * y + c.x, yt: 2 * y * x + c.y, zt: 2 * z * y + c.z },
    ];
    const randomIndex = Math.floor(Math.random() * operations.length);
    return operations[randomIndex];
}

class Julia extends Spell {
    constructor() {
        super();

        // name the spell 
        this.userData.name = 'julia';

        const c = new THREE.Vector3(-2 * Math.random(), -Math.random(), Math.random()); // Adjust these for different Julia sets

        const points = [];
        const numPoints = 50000;
        const scale = 1 / 5;

        // Generate Julia set points
        for (let i = 0; i < numPoints; i++) {
            let x = (Math.random() - 0.5) * 1;
            let y = (Math.random() - 0.5) * 1;
            let z = (Math.random() - 0.5) * 1;
            let iterations = 0;
            while (x * x + y * y + z * z < 4 && iterations < 256) {
                const { xt, yt, zt } = randomizeOperations(x, y, z, c);
                x = xt;
                y = yt;
                z = zt;
                iterations++;
            }
            if (iterations < 256) {
                points.push(new THREE.Vector3(x * scale, y * scale, z * scale));
            }
        }
        // Create particle geometry
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        });

        const juila = new THREE.Points(geometry, material);
        //juila.scale.multiplyScalar(1 / 8);
        // juila.position.set(0.15, 0, 0);
        this.group.add(juila);
    }

    animate() {
        this.group.rotation.x += 0.0005;
        this.group.rotation.y += 0.0005;
    }
}

export default Julia; 