const { ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')


const buttonMateiralProps = document.getElementById('definirProps')
buttonMateiralProps.addEventListener('click', materialProps)

document.getElementsByClassName('geometryIcon')[0]
    .addEventListener('click', function() {geometry('vigaI')})

document.getElementsByClassName('geometryIcon')[1]
    .addEventListener('click', function() {geometry('vigaTubular')})

document.getElementsByClassName('geometryIcon')[2]
    .addEventListener('click', function() {geometry('vigaC')})

document.getElementsByClassName('geometryIcon')[3]
    .addEventListener('click', function() {geometry('vigaC2')})

document.getElementsByClassName('geometryIcon')[4]
    .addEventListener('click', function() {geometry('vigaRack')})

document.getElementsByClassName('geometryIcon')[5]
    .addEventListener('click', function() {geometry('cantoneira')})

const buttonDiscretize = document.getElementById('discretização')
buttonDiscretize.addEventListener('click', mesh)

const buttonboundaryConditions = document.getElementById('condiçãoContorno')
buttonboundaryConditions.addEventListener('click', boundaryConditions)

const buttonLoad = document.getElementById('carga')
buttonLoad.addEventListener('click', load)

const analysiType = document.getElementsByName('type')
analysiType[0].addEventListener('change', setAnalysiType)
analysiType[1].addEventListener('change', setAnalysiType)


function materialProps() {
    const materialType = document.getElementsByName('material')

    if (materialType[0].checked) {
        var path = 'views/html/isotropicMaterialList.html'
        localStorage.setItem('current-material-type', 'isotropic')
    } else if (materialType[1].checked) {
        var path = 'views/html/orthotropicMaterialList.html'
        localStorage.setItem('current-material-type', 'orthotropic')
    } else {
        var path = 'views/html/anysotropicMaterialList.html'
        localStorage.setItem('current-material-type', 'anysotropic')
    }

    ipcRenderer.send('create-window', {
        width:380,
        height:310,
        path:path
    })
}


function geometry(type) {
    if (type == 'vigaI') {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryVigaI.html'
        })
    } else if (type == 'vigaTubular') {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryVigaTubular.html'
        })
    } else if (type == 'vigaC') {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryVigaC.html'
        })
    } else if (type == 'vigaC2') {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryVigaC2.html'
        })
    } else if (type == 'vigaRack') {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 375,
            path: 'views/html/geometryVigaRack.html'
        })
    } else {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryCantoneira.html'
        })
    }
    
}


function mesh() {
    ipcRenderer.send('create-window', {
        width: 300,
        height: 240,
        path: 'views/html/mesh.html'
    })

    const meshShape = document.getElementsByName('discretize')
    const userDataPath = ipcRenderer.sendSync('get-user-data')
    const jsonData = fs.readFileSync(path.join(userDataPath, 'data/analysiData.json'), 'utf8')
    var analysiData = JSON.parse(jsonData)
    analysiData.meshShape = meshShape[0].checked ? 1 : 0
    fs.writeFileSync(path.join(userDataPath, 'data/analysiData.json'), JSON.stringify(analysiData))
}


function boundaryConditions() {
    const boundaryConditionsWin = new BrowserWindow({
        width: 400,
        height: 400,
        parent: require('electron').remote.getCurrentWindow()
    }) 
}


function load() {
    const loadType = document.getElementsByName('load')
    
    if (loadType[0].checked) {
        var width = 300
        var height = 300
        var path = 'views/html/bendingMoment.html'
    } else {
        var width =300
        var height = 300
        var path = 'views/html/axialForce.html'
    }

    ipcRenderer.send('create-window', {
        width: width,
        height: height,
        path: path
    })
}


function setAnalysiType() {
    const userDataPath = ipcRenderer.sendSync('get-user-data')
    const jsonData = fs.readFileSync(path.join(userDataPath, 'data/analysiData.json'), 'utf8')
    var analysiData = JSON.parse(jsonData)

    if (analysiType[0].checked) { 
        analysiData.analysiType = 'linear'
    } else {
        analysiData.analysiType = 'nlinear'
    }

    fs.writeFileSync(path.join(userDataPath, 'data/analysiData.json'), JSON.stringify(analysiData))
}
