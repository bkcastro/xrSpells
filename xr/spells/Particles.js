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

class Particles extends Spell {
    constructor() {
        super();

        this.userData.name = 'particles';
        this.userData.image = './images/spells/rasengan.png';

        this.params = {
            particleRadius: 1,
            particleSpeed: 1.5,
            particleCount: 200,
            renderAsParticles: true,
            gravityStrength: 0.00005,
            rotationSpeed: {
                x: 1,
                y: 1,
                z: 1,
            }
        }

        this.positions = null;
        this.velocities = null;

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

        this.randomize();
    }

    createParticles() {
        if (this.position != null) {
            this.group.remove(this.particles);
        }

        this.positions = new Float32Array(this.particleCount * 3);
        this.velocities = [];

        for (let i = 0; i < this.particleCount; i++) {
            const vertex = new THREE.Vector3(
                ((Math.random() - 0.5) * this.particleRadius) / 4,
                ((Math.random() - 0.5) * this.particleRadius) / 4,
                ((Math.random() - 0.5) * this.particleRadius) / 4
            );
            vertex.toArray(this.positions, i * 3);

            this.velocities.push(
                new THREE.Vector3(
                    Math.random() - 0.5,
                    Math.random() - 0.5,
                    Math.random() - 0.5
                ).multiplyScalar(0.01 * this.particleSpeed)
            );
        }

        this.particleGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(this.positions, 3)
        );

        if (this.renderAsParticles) {
            this.particles = new THREE.Points(
                this.particleGeometry,
                this.particleMaterial
            );
        } else {
            this.particles = new THREE.Line(
                this.particleGeometry,
                this.particleMaterial
            );
        }

        this.group.add(this.particles);
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

        this.createParticles();
    }

    animate(time) {
        // Update particle positions

        if (this.particles != null) {
            const positionAttribute = this.particles.geometry.attributes.position;
            if (positionAttribute == null) {
                return;
            }
            for (let i = 0; i < this.particleCount; i++) {
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
                velocity.add(directionToCenter.multiplyScalar(this.gravityStrength));

                if (position.length() >= this.particleRadius / 1.2) {
                    const normal = position.clone().normalize();
                    velocity.reflect(normal);
                }
            }

            positionAttribute.needsUpdate = true;
        }

        this.group.rotateX(this.params.rotationSpeed.x / 100);
        this.group.rotateY(this.params.rotationSpeed.y / 100);
        this.group.rotateZ(this.params.rotationSpeed.z / 100);
    }
}

export default Particles;
