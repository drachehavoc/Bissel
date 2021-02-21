import { Bissel, bisselProtected } from "./Bissel.js";

export class BisselChild {
    #bissel: Bissel;
    #childBissel: Bissel;
    #element: HTMLElement;
    #childElement: HTMLElement;

    constructor(
        bissel: Bissel,
        child: object
    ) {
        const { element, autoAttach } = bisselProtected.get(bissel.target)!;
        if (!bisselProtected.has(child))
            throw `Child precisa receber um objeto que já tenha sido indexado com um '${Bissel.name}'.`
        this.#bissel = bissel;
        const { element: childElement, bissel: childBissel } = bisselProtected.get(child)!;
        this.#childBissel = childBissel;
        this.#childElement = childElement;
        this.#element = element;
        if ((autoAttach && autoAttach == true) ||
            (autoAttach && autoAttach.child))
            this.attach();
    }

    get bissel() {
        return this.#childBissel;
    }
    
    get target() {
        return this.#bissel.target;
    }

    attach() {
        this.#element.appendChild(this.#childElement);
    }

    detach() {
        this.#element.removeChild(this.#childElement);
    }
}