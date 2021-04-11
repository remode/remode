let modMenuListElement = document.getElementById("modMenuList");

function loadMods() {
    fetch('/modList')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.modCount; i++) {
                modMenuListElement.appendChild(createModElement(data.modNames[i], data.modPaths[i]));
            }
        });
}

function createModElement(name, path) {
    if ('content' in document.createElement('template')) {
        let modElementTemplate = document.getElementById("modElementTemplate").content.cloneNode(true);
        modElementTemplate.querySelector(".mod-title").innerText = name
        modElementTemplate
        return modElementTemplate;
    }
    else {
        modMenuListElement.innerText =
            "Your browser doesnt support HTML Tempates and sucks! Get a new one!";
        return document.createElement("div");
    }
}


loadMods();