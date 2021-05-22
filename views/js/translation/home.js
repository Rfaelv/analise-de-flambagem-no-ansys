// const { ipcRenderer} = require('electron')

// var i18n = ipcRenderer.sendSync('get-i18n')
const texts = [
    "Analysi type",
    "Linear",
    "Non linear",
    "Material properties",
    "Isotropic",
    "Orthotropic",
    "Anisotropic",
    "Define Properties",
    "Geometry",
    "Mesh and material assignment",
    "Triangle",
    "Rectangle",
    "Configure",
    "Boundary conditions",
    "S - S",
    "C - F",
    "C - C",
    "C - S",
    "Personalize",
    "Load",
    "Bending",
    "Axial",
    "Configure",
    "Start analysi",
    "View results"
]

const labels = document.getElementsByClassName('text')

for (let i = 0; i < texts.length; i ++) {  
    labels[i].appendChild(document.createTextNode(i18n.__(texts[i])))
}