# Stand-alone Siebel service simulator#

Desktop application that allows testing and running services outside Siebel UI.

Written using Spring Boot and AngularJS and uses Java Data Beans technology to connect to Siebel. This allows to connect and test services against object managers that traditionally don't have any UI set-up such as EAI Object Managers.

### Installation ###
####Prerequisites####
* Java ver. 8
* JDB drivers from your version of Siebel: **siebel.jar** and **siebelJI_enu.jar**. These can be found in siebsrvr/classes directory of your Siebel installation as well as in the same */classes* directory of Mobile Web client.
####Installation process
* Download [dist/siebel-service-simulator.zip](http://github.com/oopyrj/siebel-service-simulator/dist/siebel-service-simulator.zip) and unpack.
* Place *siebel.jar* and *siebelJI_enu.jar* into jars directory.
* Execute run.bat. _Note that it takes about 15 seconds for application to start itself.

###Screenshots###

* List of requests

![List of requests](https://github.com/oopyrj/siebel-service-simulator/docs/screenshot1.png)

* List of saved connection settings

![Settings](https://github.com/oopyrj/siebel-service-simulator/docs/screenshot2.png)

* List of open connections

![Open connections](https://github.com/oopyrj/siebel-service-simulator/docs/screenshot3.png)
