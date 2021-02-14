import { Bissel, bisselProtected } from "./Bissel.js";

type listener<K extends keyof DocumentEventMap> = (ev: DocumentEventMap[K]) => any

export class BisselEvent<K extends keyof DocumentEventMap> {
    #element: HTMLElement;
    #listener: listener<any>;
    #type: keyof DocumentEventMap;
    #options: boolean | AddEventListenerOptions;
    #enabled: boolean = true;

    constructor(
        bissel: Bissel,
        type: K,
        options: boolean | AddEventListenerOptions,
        listener: listener<K>
    ) {
        const { element, autoAttach } = bisselProtected.get(bissel.target)!;
        const userListener = listener.bind(bissel.target);
        this.#element = element;
        this.#type = type;
        this.#options = options;
        this.#listener = (...a) => this.#enabled ? userListener(...a) : void 0;
        if ((autoAttach && autoAttach == true) ||
            (autoAttach && autoAttach.event))
            this.attach();
    }

    attach() {
        this.#element.addEventListener(this.#type, this.#listener, this.#options);
        return this;
    }

    detach() {
        this.#element.removeEventListener(this.#type, this.#listener, this.#options);
        return this;
    }

    enable() {
        this.#enabled = true;
        return this;
    }

    disable() {
        this.#enabled = false;
        return this;
    }
}