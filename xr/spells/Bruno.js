import * as THREE from 'three';
import Spell from './Spell';

const vertexShader = `
    uniform float uSize;
    uniform float uTime; 

    attribute float aScale;
    attribute vec3 aRandom;

    varying vec3 vColor; 

    void main()
    {
        /**
            * Position
            */

        vec4 modelPosition = modelMatrix * vec4(position, 1.0);

        // Spin 
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xy);
        float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
        angle += angleOffset;

        // modelPosition.x = sin(angle) * sin(angle/2.0) * cos(angle) * distanceToCenter; 
        // modelPosition.z = sin(angle) * distanceToCenter;
        // modelPosition.y = sin(angle/2.0) * tan(angle) * distanceToCenter;

        modelPosition.x = sin(angle) * distanceToCenter; 
        modelPosition.z = cos(angle) * distanceToCenter;
        modelPosition.y = tan(angle) * distanceToCenter;

        modelPosition.x += aRandom.x; 
        modelPosition.y += aRandom.y; 
        modelPosition.z += aRandom.z;

        vec4 projectedPosition = projectionMatrix * viewMatrix * modelPosition;
        gl_Position = projectedPosition;

        gl_PointSize = uSize * aScale;
        //gl_PointSize *= (1.0 / -viewPosition.z);

        vColor = color;
    }
`;

const fragmentShader = `
    varying vec3 vColor;

    void main()
    {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;

const parameters = {
    count: 50000,
    size: 0.05,
    radius: 3,
    branches: 2,
    spin: 2,
    randomness: 0.2,
    randomnessPower: 10,
    insideColor: '#0b1304',
    outsideColor: '#fe1212',
}


class Bruno extends Spell {
    constructor() {
        super();

        this.userData.name = 'bruno';

        this.points = null;
        this.geometry = null;
        this.material = null;

        this.#generateGalaxy();
    }

    #generateGalaxy() {
        if (this.points !== null) {
            this.geometry.dispose()
            this.material.dispose()
            this.group.remove(this.points)
        }

        /**
         * Geometry
         */
        this.geometry = new THREE.BufferGeometry()

        const positions = new Float32Array(parameters.count * 3)
        const colors = new Float32Array(parameters.count * 3)
        const scales = new Float32Array(parameters.count * 1)
        const random = new Float32Array(parameters.count * 3)

        const insideColor = new THREE.Color(parameters.insideColor)
        const outsideColor = new THREE.Color(parameters.outsideColor)

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3

            // Position
            const radius = Math.random() * parameters.radius

            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            positions[i3] = Math.cos(branchAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * radius

            // Random 
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

            random[i3] = randomX
            random[i3 + 1] = randomY
            random[i3 + 2] = randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / parameters.radius)

            colors[i3] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = Math.random()
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        this.geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(random, 3))

        this.material = new THREE.ShaderMaterial({
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uSize: { value: 2 * 1 },
                uTime: { value: 0 },
            }
        })
        /**
         * Points
         */
        this.points = new THREE.Points(this.geometry, this.material)
        //this.points.position.set(1, 1, 5)
        //points.rotateX(Math.PI/10)
        this.group.add(this.points)
        this.group.position.set(1, 1, 1);
    }

    animate(elapsed) {
        this.material.uniforms.uTime.value = elapsed / 20;
    }
}

class BrunoDomain extends Spell {
    constructor() {
        super();

        this.userData.name = 'bruno';
        this.userData.image = './images/spells/bruno.png';

        this.bruno_1 = new Bruno();
        this.bruno_1.scale.multiplyScalar(2);
        this.bruno_1.cast();

        this.bruno_2 = new Bruno();
        this.bruno_2.cast();
        this.bruno_2.scale.multiplyScalar(2);
        this.bruno_2.rotation.x = Math.PI;
        this.bruno_2.rotation.z = -Math.PI;

        this.group.add(this.bruno_1, this.bruno_2)

    }

    animate(elapsed) {
        this.bruno_1.animate(elapsed);
        this.bruno_2.animate(elapsed);

        this.group.rotation.x += 0.001;
        this.group.rotation.y += 0.001;
        this.group.rotation.z += 0.001;
    }
}

export default BrunoDomain; 