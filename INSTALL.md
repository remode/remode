<h2>Detailed Install Instructions</h2>
Currently, Remode doesn't have a prebuilt binary release, as the project is still under work an

 1. [Install Python version 3.8](https://www.python.org/downloads/release/python-389/)<sup> (Remode was developed and tested using the 3.8 version. However, you can use any version as long as it is supported by the `pyautogui` library)
 2. [Install Node.js](https://nodejs.org/en/download/) <sup>(Pretty much any version works but the latest LTS version is recommended as LTS versions are more stable)
 3. [Download Remode as zip](/remode/remodeApp/archive/refs/headsmaster.zip) and extract it somewhere or clone remodeApp using git.
 4. Install the python and node.js dependencies:
	 - Open the `remodeApp-master` folder you extracted or cloned.
	 - Do the step suitable for your use case:
		 - The easy way **(Windows only)**:
			 - Double click the `INSTALL.bat` file. A cmd window should pop up and install all the npm and pip dependencies.
			 - If you get an error, follow the instructions in the error message. If the error persists, try doing the manual way.
		 - Manual way **(All platforms)**:
			 - Open your terminal/cmd/powershell in the `remodeApp-master` folder.
			 - Type the following commands:
			``` 
			npm install express
			npm install ip
			
			pip install pyautopui			
			```
5.  **(Required only on MacOS and GNU/Linux)** Configure the network interface name:
	- Open a terminal window.
	- **On GNU/Linux** Type `ifconfig` and press enter.
		- Find the word starting with wlan (This is typically wlan0, but the value can change sometimes)
	- **On MacOS**, the value you are looking for is usually `en0`. If the program doesn't start for some reason, Google "How to find MacOS wifi interface name".<sub> (More information required, contributions welcome)
	
	- Open the `config.js` file in the `remodeApp-master` folder with any text editor.
	- The contents of the file should be like this:
![config.js screenshot](https://github.com/remode/resources/blob/main/configjs.jpg?raw=true)
	- Change the `interfaceName` property to your network interface name.
6. Run the program by running `START.bat` on Windows or `START.sh` on GNU/Linux and MacOS.
7. You can access the Remode Web UI by copying the url from the terminal/cmd window and pasting it into a browser.
8. You can turn off the Remode Node.js server at any time by just closing the terminal/cmd window.
