import { Bissel } from "../Bissel";

function cssText(cssText: string) {
    const bissel = new Bissel({}, 'style');
    bissel.attribute("rel", "stylesheet");
    bissel.attribute("type", "text/css");
    bissel.text(cssText);
    return bissel.element;
}

function cssLink(cssPath: string) {
    const bissel = new Bissel({}, 'link');
    bissel.attribute("rel", "stylesheet");
    bissel.attribute("type", "text/css");
    bissel.attribute("href", cssPath);
    return bissel.element;
}

export const css = {
        text: cssText,
        link: cssLink
}