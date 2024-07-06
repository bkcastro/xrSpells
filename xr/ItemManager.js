import * as THREE from 'three';
// We add all of our items what we want to be able to interact with here. 

class ItemManager {
    constructor() {

        this.items = new Array(10);
        this.ui_actions = [];
        this.ui_handles = [];

        this.index = 0;
    }

    // check if item is in list if so return i else return -1
    #getItemIndex(item) {
        for (let i = 0; i < this.index; i++) {
            if (this.children[i].userData.name === spell) {
                return i;
            }
        }

        return -1;
    }

    remove(item) {

        if (this.index > 0) {
            const itemIndex = this.#getItemIndex(item);

            if (itemIndex >= 0) {
                // swap with the end item 
                const temp = this.items[this.index];
                this.items[i] = temp;
                this.items[index] = item;
                this.index--;
            }
        }
    }

    add(item) {

        if (this.index < this.capacity - 1) {
            this.items[this.index] = item;
            this.index++;
        }
    }
}

const itemManager = new ItemManager();

export default itemManager; 
