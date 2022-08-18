let mainWindow
const { app, BrowserWindow,  ipcMain} = require('electron');
const fs = require('fs');
const cron = require("node-cron");


let obj = {
    table: []
 };

function save(options) {
    obj.table.push(options);
    
    var json = JSON.stringify(obj);
    
    fs.writeFile('myjsonfile.json', json, 'utf8', ()=>{});

    cron.schedule("* * * * *", () => console.log("Executando a tarefa a cada 1 minuto"))
}

function createMainWindow() {
   mainWindow = new BrowserWindow({
       width: 500, height: 600, title: "daily journey",
       resizable: false,
       backgroundColor: "#F5F5DC",
       webPreferences: {
           nodeIntegration: true,
           contextIsolation: false,
       }
   })
   mainWindow.webContents.openDevTools()
   mainWindow.loadFile(`./app/index.html`)

   
}
 function getTimeRecordsFromJsonFile(callback) {
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        mainWindow.webContents.send('time:get',obj)
    }});
 }
ipcMain.on('time:save', (e,options)=> {
    console.log(options)
    save(options)
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        mainWindow.webContents.send('time:get',obj)
    }});
   
 })
 
app.on('ready', () => {
   createMainWindow()
   mainWindow.on("closed", () => { mainWindow = null })
   
   mainWindow.webContents.on('dom-ready',()=>{
    fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {
        obj = JSON.parse(data); //now it an object
        mainWindow.webContents.send('time:get',obj)
    }});
  
  })
})
