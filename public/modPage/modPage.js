
async function loadModInfo() {
    let data = await (await fetch("/modList")).json();
    return(data.find(el=> el.modPath == window.location.hash.substring(1)));
}

async function loadModPage(modInfo){
    let modFrame = document.createElement("iframe")
    modFrame.src = `/public/mods/${modInfo.modPath}`;
    document.getElementById("modContainer").appendChild(modFrame)
    modFrame.onload = ()=>{
        document.querySelector(".loading-container").remove();
    }
}

loadModInfo().then(loadedMod=>{
    document.title = loadedMod.modName
    loadModPage(loadedMod).then(()=>{
        console.info("Loading Done");
    })
})

function toggleSidebar(){
    const sidebar = document.querySelector(".sidebar-container");
    sidebar.style.setProperty(
        "--sidebar-offset",
        getComputedStyle(sidebar).getPropertyValue("--sidebar-offset")*-1);
}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    M.Sidenav.init(elems, {});
  });