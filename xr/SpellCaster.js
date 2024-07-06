import * as THREE from 'three';
import Julia from './spells/Julia';
import Shapes from './spells/Shapes';
import Mandlebrot from './spells/Mandelbort';
import Koch4D from './spells/Koch';
import BKStar from './spells/BKStar';
import itemManager from './ItemManager';

// Talk to this to cast spells 

class SpellCaster extends THREE.Group {
    constructor() {
        super();

        this.spell = null;

        this.add(new Julia(), new Shapes(), new Mandlebrot(), new Koch4D(), new BKStar());
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

        if (this.spell) {
            this.spell.uncast();
        }

        this.spell = this.#getSpell(spell);
        this.spell.cast();
    }

    uncastSpell() {

        if (this.spell) {
            this.spell.uncast();
            this.spell = null;
        }
    }

    update(elapsed) {
        if (this.spell) { this.spell.update(elapsed) };
    }
}

const spellCaster = new SpellCaster();

export default spellCaster; 