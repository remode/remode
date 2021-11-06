/**
 * An element that can be clicked (Button div lmao)
 */
class ClickableElement extends HTMLElement {
    get state() { return this.getAttribute("state"); }

    /**
     * @param {"on"|"off"} val The state of the clickable element
     */
    set state(val) {
        if (this.getAttribute("state") !== val)
            this.setAttribute("state", val === ("on" || "off") ? val : "off");
    }

    constructor() {
        super();
        if (this.getAttribute("state") !== ("on" || "off")) {
            this.setAttribute("state", "off");
        }
        this.state = this.getAttribute("state");
        this.onstatechange = () => { }
        this.onclickstart = () => { }
        this.onclickend = () => { }

        if ('ontouchstart' in window) {
            this.addEventListener("touchstart", () => {
                this.state = "on";
            });
            this.addEventListener("touchend", () => {
                this.state = "off";
            });
        }
        else {
            this.addEventListener("mousedown", () => {
                this.state = "on";
            });
            this.addEventListener("mouseup", () => {
                this.state = "off";
            });
        }
    }

    static get observedAttributes() {
        return ["state"];
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (attrName == "state" && oldVal != newVal) {
            this.onstatechange();
            if (newVal == "on") {
                this.onclickstart();
            }
            else if (newVal == "off") {
                this.onclickend();
            }
        }
    }
}

customElements.define("clickable-element", ClickableElement)