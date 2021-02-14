import { Bissel } from "../HTML/Bissel.js";

class EditableSpan {
    #bissel = new Bissel(this, "span");
    #editable = this.#bissel.attribute("contentEditable", true);
    #text = this.#bissel.text("placeholder");
}

class XComponent extends HTMLElement {
    #bissel = new Bissel(this, "div");
    #shadowRoot = this.attachShadow({ mode: 'closed' });
    
    #input = this.#bissel.child(new EditableSpan());

    constructor() {
        super();
        this.#shadowRoot.append(this.#bissel.element);
    }
}


window.customElements.define(`x-component`, XComponent)