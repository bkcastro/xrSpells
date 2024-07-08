import * as THREE from 'three';
import Spell from './Spell';

const vertexShader = `
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_PointSize = 1.25;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

const fragmentShader = `
    precision mediump float;
    varying vec3 vPosition;
    uniform vec3 uCenterColor;
    uniform vec3 uOuterColor;

    void main() {
        vec2 coord = gl_PointCoord * 2.0 - 1.0;
        float distance = length(coord);

        // Render the particle as a circle
        if (distance > 1.0) {
            discard;
        }

        // Set the color with the specified opacity
        float distanceFromCenter = length(vPosition - vec3(0, 0, 0));
        float gradient = distanceFromCenter;
        vec3 color = mix(uCenterColor, uOuterColor, gradient);

        gl_FragColor = vec4(color, 1.0);
    }
    `;

function generateMandelbrot3D(width, height, depth, maxIterations) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let x = -width / 2; x < width / 2; x++) {
        for (let y = -height / 2; y < height / 2; y++) {
            for (let z = -depth / 2; z < depth / 2; z++) {
                let cx = x / width * 4 - 2;
                let cy = y / height * 4 - 2;
                let cz = z / depth * 4 - 2;

                let iteration = 0;
                let zx = 0, zy = 0, zz = 0;
                while (Math.abs(zx) < .01 && Math.abs(zy) < .01 && Math.abs(zz) < .01 && iteration < maxIterations) {
                    let xtemp = zx * zx - zy * zy - zz * zz + cx;
                    let ytemp = 2 * zx * zy + cy;
                    let ztemp = 2 * zx * zz + cz;
                    if (zx === xtemp && zy === ytemp && zz === ztemp) {
                        iteration = maxIterations;
                        break;
                    }
                    zx = xtemp;
                    zy = ytemp;
                    zz = ztemp;
                    iteration++;
                }

                if (iteration < maxIterations) {
                    vertices.push(x, y, z);
                }
            }
        }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    return geometry;
}

class Mandlebrot extends Spell {
    constructor() {
        super();

        // name the spell 
        this.userData.name = 'mandlebrot';

        const mandelbrotGeometry = generateMandelbrot3D(60, 60, 60, 100);
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCenterColor: { value: new THREE.Color(0xff0000) }, // Red color
                uOuterColor: { value: new THREE.Color(0x000000) },
            },
            vertexShader: vertexShader, // Your vertex shader code here
            fragmentShader: fragmentShader, // The fragment shader code above
        });

        const points = new THREE.Points(mandelbrotGeometry, particleMaterial);
        points.scale.multiplyScalar(1 / 50);

        this.group.add(points);
        this.bb.scale.multiplyScalar(1.2);
    }

    animate() {
        this.group.rotation.x += 0.0001;
        this.group.rotation.y += 0.0001;
        this.group.rotation.z += 0.0001;
    }
}

export default Mandlebrot;