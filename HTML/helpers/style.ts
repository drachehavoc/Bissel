import { Bissel } from "../Bissel.js";

export default function (cssText: string) {
    const bissel = new Bissel({}, 'style');
    bissel.attribute("href", "./aaaa.css");
    bissel.attribute("rel", "stylesheet");
    bissel.attribute("type", "text/css");
    bissel.text(cssText);
    return bissel.element;
}