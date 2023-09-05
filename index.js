import {Color} from "three";
import {IfcViewerAPI} from "web-ifc-viewer";

const container = document.getElementById("viewer-container");
const viewer = new IfcViewerAPI({
    container,
    backgroundColor: new Color(0xffffff),
});
viewer.axes.setAxes();
viewer.grid.setGrid();

async function loadIfc(ifcURL) {
    return viewer.IFC.loadIfcUrl(ifcURL, true);
}

const nameLabel = document.getElementById("item-name");
const input = document.getElementById("file-input");
input.addEventListener(
    "change",
    async (changed) => {
        const file = changed.target.files[0];
        const ifcURL = URL.createObjectURL(file);
        await loadIfc(ifcURL);
    },
    false
);

window.ondblclick = () => viewer.IFC.selector.highlightIfcItem(true);
window.onmousemove = () => viewer.IFC.selector.prePickIfcItem();
viewer.clipper.active = true;

window.onkeydown = (event) => {
    if (event.code === "KeyP") {
        viewer.clipper.createPlane();
    } else if (event.code === "KeyO") {
        viewer.clipper.deletePlane();
    }
};

function clearSelection() {
    nameLabel.innerText = "";
    viewer.IFC.selector.unpickIfcItems();
    viewer.IFC.selector.unHighlightIfcItems();
}

window.onkeydown = (event) => {
    if (event.code === 'KeyC') {
        clearSelection();
    }
}

// window.onclick = () => viewer.IFC.selector.pickIfcItem(true);
window.onclick = async () => {
    const itemId = await viewer.IFC.selector.pickIfcItem(true, true);
    if (itemId) {
        const {modelID, id} = itemId;
        const props = await viewer.IFC.getProperties(modelID, id, true, false);
        nameLabel.innerText = props.Name.value;
    } else {
        clearSelection();
    }
}

loadIfc("modelis.ifc");