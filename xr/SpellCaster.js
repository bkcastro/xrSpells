import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

import Julia from './spells/Julia';
import Shapes from './spells/Shapes';
import Mandlebrot from './spells/Mandelbort';
import Koch4D from './spells/Koch';
import BKStar from './spells/BKStar';
import BrunoDomain from './spells/Bruno';
import Rasengan from './spells/Rasengan';
import Scribble from './spells/Scribble';
import BKCastro from './spells/BkCastro';

// Talk to this to cast spells 

class SpellCaster extends THREE.Group {
    constructor() {
        super();

        this.spell = null;

        new GLTFLoader().load('/cross.glb', (gltf) => {
            this.cross = gltf.scene.children[0];
            this.cross.material = new THREE.MeshBasicMaterial({ color: new THREE.Color("black") })
            this.isResoucesLoaded = true;
            this.cross.userData.type = 'spell_bb'
            this.add(this.cross);
        });

        this.isCastAll = false;

        this.add(new BKCastro(), new Julia(), new BKStar(), new BrunoDomain(), new Mandlebrot(), new Koch4D(), new Scribble(), new Rasengan());
    }

    getAllSpells() {

        const spells = [];

        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].userData.type === 'spell') {
                spells.push(this.children[i]);
            }
        }

        return spells;
    }

    #getSpell(spell) {

        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].userData.name === spell) {
                return this.children[i];
            }
        }

        return null;
    }

    castSpell(spell) {

        if (this.spell) { // If we have a spell cast then we have to uncast it first
            this.spell.uncast();

            // if user cast the same spell then just get rid of the current spell else cast the new spell
            if (this.spell.userData.name != spell) {
                this.cross.visible = false;
                this.spell = this.#getSpell(spell);
                this.spell.cast();
            } else {
                this.spell = null;
                this.cross.visible = true;
            }
        } else {
            this.cross.visible = false;
            this.spell = this.#getSpell(spell);
            this.spell.cast();
        }
    }

    uncastSpell() {

        if (this.spell) {
            this.spell.uncast();
            this.spell = null
            this.cross.visible = true;
        }
    }

    castAll() {
        this.isCastAll = true;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].cast();
        }
    }

    uncastAll() {
        this.isCastAll = false;
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].uncast();
        }
    }

    update(elapsed) {
        if (this.isResoucesLoaded == true) {
            if (this.isCastAll) {
                for (let i = 0; i < this.children.length; i++) {
                    this.children[i].update(elapsed);
                }
            } else if (this.spell) {
                this.spell.update(elapsed);
            } else {
                this.cross.rotation.z += 0.01;
            }
        }
    }
}

export default SpellCaster; 