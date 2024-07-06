import * as THREE from 'three';
import Spell from './Spell';

// Vertex Shader
const vertexShader = `
    varying vec3 vPosition;
    uniform float uTime; 
    mat2 get2dRotateMatrix(float _angle) {
        return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
    }

    void main() {
        vPosition = position;
        
        vec3 temp = position;  
        float angle = position.y * uTime * 0.08;
        mat2 rotateMatrix = get2dRotateMatrix(angle);
        temp.xz = rotateMatrix * temp.yz; 

        gl_Position = projectionMatrix * modelViewMatrix * vec4(temp, 1.0);
    }
`;

// Fragment Shader
const fragmentShader = `
  varying vec3 vPosition;
  uniform vec3 uColor;

  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

class BKStar extends Spell {
    constructor() {
        super();

        // name the spell 
        this.userData.name = 'bkStar';

        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uColor: { value: new THREE.Color("red") },
                uTime: { value: 0.0 },
            }
        });

        const geometry = new THREE.CylinderGeometry(1 / 10, 1 / 10, 40, 50, 50)
        this.mesh = new THREE.Mesh(geometry, material)
        this.mesh.scale.multiplyScalar(1 / 25);
        this.mesh.rotateX(Math.PI / 2);

        this.group.add(this.mesh);
    }

    animate(time) {
        this.mesh.material.uniforms.uTime.value = time;
        this.mesh.rotation.y += 0.01;
        this.mesh.rotation.x += 0.001;
    }
}

export default BKStar; 