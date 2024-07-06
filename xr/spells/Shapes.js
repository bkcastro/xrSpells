import * as THREE from 'three'
import Spell from './Spell';

// credits https://github.com/mrdoob/three.js/blob/master/examples/webxr_xr_controls_transform.html

class Shapes extends Spell {
    constructor() {
        super();

        // name the spell 
        this.userData.name = 'shapes';

        const geometries = [
            new THREE.BoxGeometry(0.2, 0.2, 0.2),
            new THREE.ConeGeometry(0.2, 0.4, 64),
            new THREE.CylinderGeometry(0.2, 0.2, 0.2, 64),
            new THREE.IcosahedronGeometry(0.2, 8),
            new THREE.TorusGeometry(0.2, 0.04, 64, 32)
        ];

        for (let i = 0; i < 10; i++) {

            const geometry = geometries[Math.floor(Math.random() * geometries.length)];
            const material = new THREE.MeshStandardMaterial({
                color: Math.random() * 0xffffff,
                roughness: 0.7,
                metalness: 0.0
            });

            const object = new THREE.Mesh(geometry, material);

            object.userData.type = 'ui_handle';
            object.scale.multiplyScalar(1 / 3);

            let x = (Math.random() - 0.5) * 1;
            let y = (Math.random() - 0.5) * 2;
            let z = (Math.random() - 0.5) * 1;

            object.position.x = x;
            object.position.y = y;
            object.position.z = z;

            object.rotation.x = Math.random() * 2 * Math.PI;
            object.rotation.y = Math.random() * 2 * Math.PI;
            object.rotation.z = Math.random() * 2 * Math.PI;

            object.scale.setScalar(Math.random() + 0.5);

            object.castShadow = true;
            object.receiveShadow = true;

            this.group.add(object);
        }
    }

    animate() {
        // do nun rn
    }
}

export default Shapes; 