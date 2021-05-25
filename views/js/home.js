const { ipcRenderer } = require('electron')
const {readData, writeData} = require('../../modules/writeAndReadData')
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

document.getElementsByClassName('geometryIcon')[6]
    .addEventListener('click', function() {geometry('plate')})

const buttonDiscretize = document.getElementById('discretização')
buttonDiscretize.addEventListener('click', meshAndMaterialAssignment)

const buttonboundaryConditions = document.getElementById('condiçãoContorno')
buttonboundaryConditions.addEventListener('click', boundaryConditions)

const buttonLoad = document.getElementById('carga')
buttonLoad.addEventListener('click', load)

const analysiType = document.getElementsByName('type')
analysiType[0].addEventListener('change', setAnalysiType)
analysiType[1].addEventListener('change', setAnalysiType)

const meshType = document.getElementsByName('discretize')
meshType[0].addEventListener('change', setMeshType)
meshType[1].addEventListener('change', setMeshType)

document.getElementById('boundary')
    .addEventListener('change', setSimpleBoundaryConditions)

window.addEventListener('focus', () => {
    if (localStorage.getItem('personalized-boundary-conditions') == 'y') {
        document.getElementById('boundary').selectedIndex = 0
    }
})


function materialProps() {
    const materialType = document.getElementsByName('material')

    if (materialType[0].checked) {
        localStorage.setItem('current-material-type', 'isotropic')
    } else if (materialType[1].checked) {
        localStorage.setItem('current-material-type', 'orthotropic')
    } else {
        localStorage.setItem('current-material-type', 'anisotropic')
    }

    ipcRenderer.send('create-window', {
        width:370,
        height:250,
        path:'views/html/materialList.html'
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
            height: 320,
            path: 'views/html/geometryVigaRack.html'
        })
    } else if (type == 'cantoneira') {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryCantoneira.html'
        })
    } else {
        ipcRenderer.send('create-window', {
            width: 390,
            height: 320,
            path: 'views/html/geometryPlate.html'
        })
    }
    
}


function meshAndMaterialAssignment() {
    ipcRenderer.send('create-window', {
        width: 350,
        height: 420,
        path: 'views/html/meshAndMaterial.html'
    })

    const meshShape = document.getElementsByName('discretize')
    const userDataPath = ipcRenderer.sendSync('get-user-data')
    const jsonData = fs.readFileSync(path.join(userDataPath, 'data/analysiData.json'), 'utf8')
    var analysiData = JSON.parse(jsonData)
    analysiData.meshShape = meshShape[0].checked ? 1 : 0
    fs.writeFileSync(path.join(userDataPath, 'data/analysiData.json'), JSON.stringify(analysiData))
}


function boundaryConditions() {
    const model = readData('model.json')

    for (key in model.sectionType) {
        if (model.sectionType[key]) {
            ipcRenderer.send('create-window', {
                width: 380,
                height: 480,
                path: 'views/html/boundaryConditions.html'
            })
            return
        }
    }
    ipcRenderer.send('create-dialog', {title: 'Não há dados de seção', description: 'Defina a seção antes de continuar.'})  
}


function load() {
    const loadType = document.getElementsByName('load')
    
    if (loadType[0].checked) {
        var width = 450
        var height = 350
        var path = 'views/html/bendingMoment.html'
    } else {
        var width =380
        var height = 350
        var path = 'views/html/axialForce.html'
    }

    ipcRenderer.send('create-window', {
        width: width,
        height: height,
        path: path
    })
}


function setAnalysiType() {
    var model = readData('model.json')

    if (analysiType[0].checked) { 
        model.analysiType.linear = true
        model.analysiType.nonlinear = false
    } else {
        model.analysiType.nonlinear = true
        model.analysiType.linear = false
    }

    writeData(model, 'model.json')
}

function setMeshType() {
    var model = readData('model.json')

    if (meshType[0].checked) { 
        model.meshProperties.type = 0
    } else {
        model.meshProperties.type = 1
    }

    writeData(model, 'model.json')
}

function setSimpleBoundaryConditions() {
    const select = document.getElementById('boundary')
    const currentValue = select.options[select.selectedIndex].value
    if (currentValue != '') {
        var model = readData('model.json')
        model.boundaryConditions = {
            personalized: false
        }
        model.boundaryConditions[currentValue] = true
        writeData(model, 'model.json')
        localStorage.setItem('personalized-boundary-conditions', 'n')
    }
}
