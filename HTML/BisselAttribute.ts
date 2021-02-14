import { MutationHelper } from "../Utils/MutationHelper.js";
import { Bissel, bisselProtected } from "./Bissel.js";
import { BisselPlaceholderExpose } from "./BisselPlaceholderExpose.js";

type AllowedType<T> =
    T extends Date ? Date :
    T extends string ? string :
    T extends number ? number :
    T extends boolean ? boolean :
    never;

type AttributeCallback<T> = (newValue: T, oldValue: T) => any

export class BisselAttribute<InformedType, T = AllowedType<InformedType>>  {
    #element: HTMLElement;
    #name: string;
    #type: string;
    #node: Attr;
    #value: T;
    #listener?: AttributeCallback<T>;
    #helperMut: MutationHelper;

    constructor(
        bissel: Bissel,
        qualifiedName: string,
        value: T,
        listener?: AttributeCallback<T>
    ) {
        const { element, autoAttach } = bisselProtected.get(bissel.target)!;
        this.#element = element;
        this.#type = this.#getType(value);
        this.#value = value;
        this.#name = this.#qualifieName(qualifiedName);
        this.#node = document.createAttribute(this.#name);
        this.#helperMut = new MutationHelper(element, { attributeFilter: [this.#name] }, this.#chgCallback);
        this.set(value); // definido antes do listener para que não seja executado na primeira definição
        this.#listener = listener;
        if ((autoAttach && autoAttach == true) ||
            (autoAttach && autoAttach.attribute))
            this.attach();
    }

    #getType = (v: any): string => {
        const type = typeof v;
        return type == 'object' ? v.constructor.name : type;
    }

    #chgCallback: MutationCallback = (mutations, observer) => {
        try {
            const v = this.#formString(this.#node.nodeValue || "");
            this.set(v as any);
        } catch (e) {
            throw e;
        }
    }

    #qualifieName = (propKey: PropertyKey) => {
        if (typeof propKey === 'symbol') {
            propKey = <string>propKey.description?.trim();
            if (propKey === "")
                throw "Ao defenir um Symbol como nome de um attributo HTML é necessário que o mesmo tenha uma descrição, para que seja usada como nome do attributo no elemento html.";
        }

        if (typeof propKey === 'number')
            propKey = "num-" + propKey.toString();

        return <string>propKey.replace(/([A-Z])/g, "-$1").replace(/\s/g, '-').toLowerCase();
    }

    #toString = (v: T): string => {
        const type = this.#getType(v);

        if (type !== this.#type)
            throw `O atributo '${this.#node.name}' foi definido com o tipo '${this.#type}' e você informou um valor do tipo '${type}'.`

        if (typeof v == "string" || typeof v == "boolean" || typeof v == "number")
            return v.toString();

        if (v instanceof Date)
            return v.toJSON();

        throw `O atributo '${this.#node.name}' não pode ser definido, somente valores dos tipo Date, number, boolean e string são permitidos.`
    }

    #formString = (v: string) => {
        if (this.#type == "Date")
            return new Date(v)

        if (this.#type == "boolean")
            return ["false", "no", "0"].includes(v = v.toLowerCase().trim()) ? false : Boolean(v)

        if (this.#type == "number")
            return parseFloat(v);

        return v;
    }

    expose(get: boolean = true, set: boolean = true) {
        return new BisselPlaceholderExpose(this, get, set) as unknown as T;
    }

    set(value: T) {
        try {
            const newValue = this.#toString(value);
            this.#helperMut.stop();
            if (this.#listener)
                this.#listener(value, this.#value);
            this.#value = value;
            this.#node.nodeValue = newValue;
            this.#helperMut.start();
        } catch (e) {
            throw e;
        }
    }

    get() {
        return this.#value;
    }

    attach() {
        this.#helperMut.stop();
        this.#element.setAttributeNode(this.#node);
        this.#helperMut.start();
        return this;
    }

    detache() {
        this.#helperMut.stop();
        this.#element.removeAttributeNode(this.#node);
        this.#helperMut.start();
        return this;
    }
}