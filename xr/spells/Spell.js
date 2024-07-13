import * as THREE from 'three';

// What if our spells don't have objects the user can iteract with? what if the spell does? how do I handle this? 

// For now a spell is a simple experiences that is made with three.js 
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    wireframe: true,
});

class Spell extends THREE.Object3D {
    constructor() {
        super();

        this.userData.type = 'spell';
        this.userData.name = 'n/a';

        // You put everything you want to render here
        this.group = new THREE.Group();

        // define bounding box can be scaled by user to match creation. 
        this.bb = new THREE.Mesh(geometry, material);
        this.bb.userData.type = 'spell_bb';
        this.bb.visible = false;
        this.add(this.bb);
    }

    cast() {
        this.add(this.group);
    }

    uncast() {
        this.remove(this.group);
    }

    animate() { // This is done by the user; 
        throw new Error('You have to implement the animate method!');
    }

    update(time) {

        if (!this.position.equals(this.bb.position)) { // Update the position of the group to match the bb
            this.position.copy(this.bb.position);
            this.group.position.copy(this.bb.position);
        }

        this.animate(time);
    }
}

export default Spell; 