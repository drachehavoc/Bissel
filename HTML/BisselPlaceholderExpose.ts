import { BisselPlaceholder } from "./BisselPlaceholder.js";

type GetterSetter = {
    set(value: any): any
    get(): any
}

export class BisselPlaceholderExpose extends BisselPlaceholder {
    #gsObj: GetterSetter;
    #canGet: boolean;
    #canSet: boolean;

    constructor(getterSetterObject: GetterSetter, get: boolean, set: boolean) {
        super();
        this.#gsObj = getterSetterObject;
        this.#canGet = get;
        this.#canSet = set;
    }

    define(target: object, propertyKey: PropertyKey) {
        let name = this.#gsObj.constructor.name;
        let propName = `${name}.${propertyKey.toString()}`;
        Object.defineProperty(target, propertyKey, {
            get: this.#canGet
                ? () => this.#gsObj.get()
                : () => { throw `Get '${propName}' is not permited.` },

            set: this.#canSet
                ? (v) => this.#gsObj.set(v)
                : (v) => { throw `Set '${propName}' is not permited.` },
        });
    }
}