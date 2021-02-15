import { MutationHelper } from "../Utils/MutationHelper";
import { Bissel, bisselProtected } from "./Bissel";
import { BisselPlaceholderExpose } from "./BisselPlaceholderExpose";

type TextCallback = (newValue: string, oldValue: string) => any

export class BisselText {
    #element: HTMLElement;
    #node: Text;
    #value: string;
    #listener?: TextCallback;
    #helperMut: MutationHelper;

    #mutOpts: MutationObserverInit = {
        characterData: true
    }

    constructor(
        bissel: Bissel,
        content: string,
        listener?: TextCallback
    ) {
        const { element, autoAttach } = bisselProtected.get(bissel.target)!;
        this.#element = element;
        this.#value = content;
        this.#node = document.createTextNode(this.#value);
        this.#listener = listener;
        this.#helperMut = new MutationHelper(this.#node, this.#mutOpts, this.#chgCallback);
        if ((autoAttach && autoAttach == true) ||
            (autoAttach && autoAttach.text))
            this.attach();
    }

    #chgCallback: MutationCallback = (mutations, observer) => {
        const value = this.#node.nodeValue!;
        if (this.#listener)
            this.#listener(value, this.#value);
        this.#value = value;
    }

    expose(get: boolean = true, set: boolean = true) {
        return new BisselPlaceholderExpose(this, get, set) as unknown as string;
    }

    set(value: string) {
        this.#helperMut.stop();
        if (this.#listener)
            this.#listener(value, this.#value);
        this.#node.nodeValue = this.#value = value;
        this.#helperMut.start();
    }

    get() {
        return this.#node.nodeValue;
    }

    attach() {
        this.#element.appendChild(this.#node);
        return this;
    }

    detache() {
        this.#element.removeChild(this.#node);
        return this;
    }
}