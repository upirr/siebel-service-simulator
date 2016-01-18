# Stand-alone Siebel service simulator#

Desktop application that allows testing and running services outside Siebel UI.

Written using Spring Boot and AngularJS and uses Java Data Beans technology to connect to Siebel. This allows to connect and test services against object managers that traditionally don't have any UI set-up such as EAI Object Managers.

### Installation ###
####Prerequisites####
* Java ver. 8
* JDB drivers from your version of Siebel: **siebel.jar** and **siebelJI_enu.jar**. These can be found in siebsrvr/classes directory of your Siebel installation as well as in the same */classes* directory of Mobile Web client.

####Installation process####
* Download [dist/siebel-service-simulator.zip](https://github.com/oopyrj/siebel-service-simulator/blob/master/dist/siebel-service-simulator.rar) and unpack.
* Place *siebel.jar* and *siebelJI_enu.jar* into jars directory.
* Execute run.bat. _Note that it takes about 15 seconds for application to start itself.

###Screenshots###

* List of Siebel requests

[<img src="https://raw.githubusercontent.com/oopyrj/siebel-service-simulator/master/docs/screenshot1_preview.png">](https://raw.githubusercontent.com/oopyrj/siebel-service-simulator/master/docs/screenshot1.PNG)

* List of connection profiles

[<img src="https://raw.githubusercontent.com/oopyrj/siebel-service-simulator/master/docs/screenshot2_preview.png">](https://raw.githubusercontent.com/oopyrj/siebel-service-simulator/master/docs/screenshot2.PNG)

* List of open connections

[<img src="https://raw.githubusercontent.com/oopyrj/siebel-service-simulator/master/docs/screenshot3_preview.png">](https://raw.githubusercontent.com/oopyrj/siebel-service-simulator/master/docs/screenshot3.PNG)

###Usage###

* URL of started applicaiton is available at [http://localhost:7771](http://localhost:7771) This can be easily changed by adjusting [/resources/application.properties](https://github.com/oopyrj/siebel-service-simulator/blob/master/resources/application.properties) It is also possible to connect directly to host using [http://&lt;host&gt;:7771/](http://<host>:7771/) so the application can be used by multiple users or even installed directly onto Siebel environment.

* First user have to setup connection URL to Siebel server. URL format is: **Siebel://&lt;host&gt;:&lt;port&gt;/&lt;enterprise_name&gt;/&lt;object_manager_alias&gt;**. An example: *Siebel://192.168.1.100:2321/SBA81/EAIObjMgr_enu* Default port number is 2321 and can be configured in SCBroker settings via setting the Static Port Number (alias PortNumber) option.

###Customizing the code###

In order to customize the prloject you have install Siebel jars into your local Maven repository first. 
This can be done by executing following commands:

1. mvn install:install-file -D=file=SiebelJI_enu.jar -DgroupId=com.siebel -Dpackaging=jar -Dversion=1.0 -DartifactId=SiebelJI

2. mvn install:install-file -D=file=Siebel.jar -DgroupId=com.siebel -Dpackaging=jar -Dversion=1.0 -DartifactId=Siebel