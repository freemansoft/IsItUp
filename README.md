# Is It Up

This Chrome plugin displays the status of a set of web applications organized in a grid pattern.
It is intended to act as a dashboard for web applications that are deployed across various enviornments.
Environments could be SDLC lifecycle environments, Development, Production, etc or,
they could be various data centers or enpoints when applications are deployed in multiple locations.

The extension has no intrinsic understanding of the meaning of rows and columns. 
Row and column usage described above is a convention that works when monitoring many andpoints across < 10 environments.
The configuration and meaning of rows and columns is flexible and is up to the user.

## Display Elements

### Customizable Dashboard Title
The dashboard title can be set in the configuration file. See sample json.

### Cell Contents
Each cell contains 

* An icon the that represents the return of the last call to that service.
* A refresh icon that will re run the query to this endpoint.
* Any number of supporting links.  These are often links to documentation other dashboards or other environmental tools.

This image shows a primary link with a 200 return code, the refrish link and helper links to Splunk and AppDynamics

![Extension](https://github.com/NaveenGurram/IsItUp/blob/master/screenshots/IndividualCell.jpg?raw=true "Extension")

### Empty Cells
Not all cells make sense or have associated URLs. It is possible to just specify an empty string "" in this situation. 
Empty cells are shown as "N/A". 
Rows with no active cells are show with all cells blank.

## Features
* (1.14) Provision to send additional headers.
* (1.13) Provision to configure differet http verb instead of GET
* (1.12) Ability to show/hide badges globally
* (1.11) Ability to support badges showing additional information
* (1.10) Bug fixes.
* (1.9)  Fixed bug with image width
* (1.8)  Row with no health urls no longer shows cells with n/a
* (1.8)  Configuration via remote URL. Uses file extenison to determine format.
* (1.3)  YAML config file
* (1.2)  Configure using a file via the options page.
* (1.1)  Enter or paste JSON on the options page.
* (1.1)  Refresh health status continously with a interval that can be configured
* (1.1)  Push Chrome notifications when a cell returns a non-200.
* (1.0)  JSON configuration

## Installation Steps
Load like any other chrome extension
* Install via [Chrome Web Store](https://chrome.google.com/webstore/search/isitup?hl=en "IsItUp")  
* Install in chrome as developer extension from the [GIT source](https://github.com/NaveenGurram/IsItUp "GitHub").

## Configuration
It does not automatically reload the configuration on any interval or at startup.

### Configuration via file
IsItUp can load its configuration vai a file from the local file system. This is a manual process.
* Click on the *options* link.
* Select the YAML or JSON configuration file from the disk.
* Click the *Save* button to apply the configuration changes.

### Configuration via URL
IsItUp can load its configuration from a web site. This is a manual process. 
* Click on the *options* link.
* Enter the YAML or JSON configuration file URL.
* Click the *load* button to load the configuration file in the text field at the bottom.
* Click the *Save" button to apply the configuration changes.

The configuration file location is retained.  It can be reloaded any time by clicking *Load* and then *Save" on the options page.

## Dashboard Image Hints
You will want small images, preferrably smaller than the result code icons.  
Google has a tool that can turn a website favicon into a standard image.
This (slightly hacked up) url shows how it can be done. Replace foo.com with your URL.
* https://www.google.com/s2/favicons?domain=foo.com


___

## Sample Images

### Status of different components in multiple environments
Each row here represents a different application. Each column represents a different SDLC environment.
Each cell contains the primary endpoint, a refresh button and link to 2 supporting applications for that endpoint.
![Extension](https://github.com/NaveenGurram/IsItUp/blob/master/screenshots/Extension.png?raw=true "Extension")

### Options page and all possible configurations
![Options](https://github.com/NaveenGurram/IsItUp/blob/master/screenshots/Options.png?raw=true "Options Page")

### Visual representation of JSON file.
[Download Sample Configuration File](./conf/defaultConf.json)

![Configuration](https://github.com/NaveenGurram/IsItUp/blob/master/screenshots/ConfigurationJson.png?raw=true "Configuration Json Visual Representation")

___
## Future Features
1. Row level badge support
