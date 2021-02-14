export class MutationHelper {
    #mutation: MutationObserver;
    #targetNode: Node;
    #callback: MutationCallback;
    #options: MutationObserverInit;

    constructor(
        target: Node,
        options: MutationObserverInit,
        callback: MutationCallback,
    ) {
        this.#targetNode = target;
        this.#callback = callback;
        this.#options = options;
        this.#mutation = new MutationObserver(this.#callback);
        this.start();
    }

    start() {
        this.#mutation.observe(this.#targetNode, this.#options);
    }

    stop() {
        this.#mutation.disconnect();
    }

    bypass(callback: (node: Node) => void) {
        this.stop();
        callback(this.#targetNode);
        this.start();
    }
}