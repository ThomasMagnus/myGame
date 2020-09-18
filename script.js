const electron = require('electron');
const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 700,
		height: 760,
		webPreferences: {
			nodeIntegration: true,
		}
	})

	win.loadFile('src/index.html')

}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
