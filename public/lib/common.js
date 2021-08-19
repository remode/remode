async function getTemplate(filepath) {
    let response = await fetch(filepath);
    let txt = response.text();

    let html =  new DOMParser().parseFromString(txt, 'text/html');
    return html.querySelector("body");
}

window.addEventListener("resize",()=>{
    document.querySelector(":root").style.setProperty("--window-aspect-ratio", innerWidth/innerHeight)
})
document.querySelector(":root").style.setProperty("--window-aspect-ratio", innerWidth/innerHeight)