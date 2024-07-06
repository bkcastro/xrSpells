import * as THREE from 'three';

// What if our spells don't have objects the user can iteract with? what if the spell does? how do I handle this? 

// For now a spell is a simple experiences that is made with three.js 

class Spell extends THREE.Object3D {
    constructor() {
        super();

        this.userData.type = 'spell';
        this.userData.name = 'n/a';

        // You put everything you want to render here
        this.group = new THREE.Group();

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0000,
            wireframe: true,
        });

        this.bb = new THREE.Mesh(geometry, material);
        this.bb.userData.type = 'spell_bb';
        this.bb.visible = false;
        this.add(this.bb);

    }

    cast() {
        this.add(this.group);
    }

    uncast() { // this gets rid of all of 
        this.remove(this.group);
    }

    animate() { // This is done by the user; 
        throw new Error('You have to implement the animate method!');
    }

    update(time) {

        if (!this.position.equals(this.bb.position)) {
            this.position.copy(this.bb.position);
            this.group.position.copy(this.bb.position);
        }

        this.animate(time);
    }
}

export default Spell; 