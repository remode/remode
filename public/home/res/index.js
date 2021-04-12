let modMenuListElement = document.getElementById("modMenuList");

function loadMods() {
    fetch('/modList')
        .then(response => response.json())
        .then(data => {
            data.forEach(modProperties => {
                modMenuListElement.appendChild(createModElement(modProperties));
            });
        });
}

function createModElement(modProperties) {
    if ('content' in document.createElement('template')) {
        let modElementTemplate = document.getElementById("modElementTemplate").content.cloneNode(true);
        modElementTemplate.querySelector(".mod-title-text").innerText = modProperties.modName;
        modElementTemplate.querySelector(".mod-description").innerText = modProperties.modDesc;
        modElementTemplate.querySelector(".mod-description").title = modProperties.modDescHover;
        if (modProperties.modIcon)
            modElementTemplate.querySelector(".mod-icon").src =
                `${modProperties.modPath}/${modProperties.modIcon}`;
        modElementTemplate.querySelector(".mod-link").href = modProperties.modPath;

        return modElementTemplate;
    }
    else {
        modMenuListElement.innerText =
            "Your browser doesnt support HTML Tempates and sucks! Get a new one!";
        return document.createElement("div");
    }
}


loadMods();