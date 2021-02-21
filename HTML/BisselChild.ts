import { Bissel, bisselProtected } from "./Bissel.js";

export class BisselChild {
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
        const { element: childElement, bissel: childBissel } = bisselProtected.get(child)!;
        this.#childBissel = childBissel;
        this.#childElement = childElement;
        this.#element = element;
        if ((autoAttach && autoAttach == true) ||
            (autoAttach && autoAttach.child))
            this.attach();
    }

    attach() {
        this.#element.appendChild(this.#childElement);
    }

    detach() {
        this.#element.removeChild(this.#childElement);
    }

    get bissel() {
        return this.#childBissel;
    }
}