import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import Julia from './spells/Julia';
import Shapes from './spells/Shapes';
import Mandlebrot from './spells/Mandelbort';
import Koch4D from './spells/Koch';
import BKStar from './spells/BKStar';
import itemManager from './ItemManager';
import Bruno from './spells/Bruno';
import { BrunoDomain } from './spells/Bruno';
// Talk to this to cast spells 

class SpellCaster extends THREE.Group {
    constructor() {
        super();

        this.spell = null;

        new GLTFLoader().load('/cross.glb', (gltf) => {
            this.cross = gltf.scene.children[0];
            this.cross.scale.multiplyScalar(1 / 2);
            this.cross.material = new THREE.MeshBasicMaterial({ color: new THREE.Color("black") })
            this.isResoucesLoaded = true;
            this.add(this.cross);
        });

        this.isCastAll = false;

        this.add(new Julia(), new Shapes(), new Mandlebrot(), new Koch4D(), new BKStar(), new BrunoDomain());
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

        if (this.spell == null) {
            this.cross.visible = false;
            this.spell = this.#getSpell(spell);
            this.spell.cast();
        } else if (this.spell) {
            this.spell.uncast();
            this.cross.visible = true;
            if (this.spell.userData.name != spell) {
                this.cross.visible = false;
                this.spell = this.#getSpell(spell);
                this.spell.cast();
            } else {
                this.spell = null;
            }
        }


    }

    uncastSpell() {

        if (this.spell) {
            this.spell.uncast();
            this.spell = null;
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
        this.isCastAll = true;
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

const spellCaster = new SpellCaster();

export default spellCaster; 