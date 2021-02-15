import { BisselEvent } from "./BisselEvent";
import { BisselChild } from "./BisselChild";
import { BisselText } from "./BisselText";
import { BisselAttribute } from "./BisselAttribute";
import { BisselPlaceholder } from "./BisselPlaceholder";

type BisselProtected = {
    element: HTMLElement
} & typeof configDefaults

type BisselConfig = {
    autoAttach?: boolean | {
        attribute?: boolean
        event?: boolean
        text?: boolean
        child?: boolean
    }
}

const get: ProxyHandler<any>['get'] = (t, k, r) => {
    // console.log("GET:", [t, k]);
    return Reflect.get(t, k, r);
}

const set: ProxyHandler<any>['set'] = (t, k, v, r) => {
    // console.log("SET:", [t, k]);
    if (v instanceof BisselPlaceholder) {
        const placeholder = v;
        placeholder.define(r, k);
        return true;
    }
    return Reflect.set(t, k, v, r);
}

const configDefaults: BisselConfig = {
    autoAttach: true
}

export const bisselProtected: Map<object, BisselProtected> = new Map();

export class Bissel<T extends keyof HTMLElementTagNameMap = any>{
    #target: object;
    #element: HTMLElement;

    constructor(
        target: object,
        tagName: T,
        config?: BisselConfig
    ) {
        if (bisselProtected.has(target))
            throw "SÓ UM BISSEL POR OBJETO";
        this.#target = target;
        const proto = Object.getPrototypeOf(target);
        const element = this.#element = document.createElement(tagName);
        Object.setPrototypeOf(target, new Proxy(proto, { get, set }))
        bisselProtected.set(target, { element, ...Object.assign({}, configDefaults, config) });
    }

    #factoryPlaceHolder = <R, A extends any[]>(ctor: { new(omitFirst: any, ...a: A): R }): (...a: A) => R => (...a) => new ctor(this, ...a) as unknown as R;

    event = this.#factoryPlaceHolder(BisselEvent);

    text = this.#factoryPlaceHolder(BisselText);

    attribute = this.#factoryPlaceHolder(BisselAttribute);

    child = this.#factoryPlaceHolder(BisselChild);

    get target() {
        return this.#target;
    }

    get element() {
        return this.#element;
    }
}