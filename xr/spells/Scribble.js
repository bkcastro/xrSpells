import * as THREE from "three";
import Spell from "./Spell";

const vertex = `
    attribute float size;
    uniform vec3 innerColor; 
    uniform vec3 outerColor; 
    uniform float uSize;

    varying vec3 vInnerColor; 
    varying vec3 vOuterColor; 
    varying vec3 vColor;
    varying vec3 vPosition;
    void main() {
        vInnerColor = innerColor; 
        vOuterColor = outerColor;
        vPosition = position;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize;
        gl_Position = projectionMatrix * mvPosition;
    }
    `;

const fragment = `
    varying vec3 vPosition;
    varying vec3 vInnerColor; 
    varying vec3 vOuterColor; 

    void main() {
        float distance = length(vPosition);
        vec3 color = mix(vInnerColor, vOuterColor, distance);
        gl_FragColor = vec4(color, 1.0);
    }
`;

class Scribble extends Spell {
    constructor() {
        super();

        this.userData.name = 'scribble';
        this.userData.image = './images/spells/scribble.png';

        this.params = {
            particleRadius: 4,
            particleSpeed: 0.5,
            particleCount: 200,
            renderAsParticles: false,
            gravityStrength: 0.0005,
            rotationSpeed: {
                x: 1,
                y: 1,
                z: 1,
            }
        }

        this.particleGeometry = new THREE.BufferGeometry();
        this.particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                innerColor: { value: new THREE.Color("red") },
                outerColor: { value: new THREE.Color("magenta") },
                uSize: { value: 4.0 },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.positions = new Float32Array(this.params.particleCount * 3);
        this.velocities = [];

        for (let i = 0; i < this.params.particleCount; i++) {
            const vertex = new THREE.Vector3(
                ((Math.random() - 0.5) * this.params.particleRadius) / 4,
                ((Math.random() - 0.5) * this.params.particleRadius) / 4,
                ((Math.random() - 0.5) * this.params.particleRadius) / 4
            );
            vertex.toArray(this.positions, i * 3);

            this.velocities.push(
                new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).multiplyScalar(0.01 * this.params.particleSpeed)
            );
        }

        this.particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(this.positions, 3)
        );

        this.particles = new THREE.Line(
            this.particleGeometry,
            this.particleMaterial
        );

        this.group.add(this.particles);

        this.randomize();

    }
    randomize() {

        this.particleMaterial.uniforms.innerColor.value = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
        );
        this.particleMaterial.uniforms.outerColor.value = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
        );
    }

    animate(time) {
        // Update particle positions

        const positionAttribute = this.particles.geometry.attributes.position;

        for (let i = 0; i < this.params.particleCount; i++) {
            const index = i * 3;
            const velocity = this.velocities[i];

            positionAttribute.array[index] += velocity.x;
            positionAttribute.array[index + 1] += velocity.y;
            positionAttribute.array[index + 2] += velocity.z;

            // Check for collision with the sphere and reflect the velocity
            const position = new THREE.Vector3(
                positionAttribute.array[index],
                positionAttribute.array[index + 1],
                positionAttribute.array[index + 2]
            );

            const directionToCenter = position.clone().negate().normalize();
            // Apply the strength of the gravitational pull
            velocity.add(directionToCenter.multiplyScalar(this.params.gravityStrength));

            if (position.length() >= this.particleRadius / 1.2) {
                const normal = position.clone().normalize();
                velocity.reflect(normal);
            }
        }

        positionAttribute.needsUpdate = true;

        this.group.rotateX(this.params.rotationSpeed.x / 120);
        this.group.rotateY(this.params.rotationSpeed.y / 150);
        this.group.rotateZ(this.params.rotationSpeed.z / 200);
    }
}

export default Scribble;
