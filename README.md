<p align="center">
    <a href="https://www.logistify.com.mx/" target="_blank">
        <img src="http://54.172.217.230/favicons/logo-morado.png" width="500">
    </a>
</p>
<hr>
<p align="center">
    <a href="" target="_blank">
        <img src="https://angular.io/assets/images/logos/angular/logo-nav@2x.png" width="500">
    </a>
</p>
<hr>

## Sobre Logistify App

Logistify es una empresa dedicada a ofrecer soluciones integrales en logística, cuenta con una gran red de partners para poder abarcar toda la República Mexicana y resto del mundo. Enfocada en proporcionar un servicio personalizado y con la facilidad de adaptarlo a tus procesos logísticos.

### Elasticidad para mejorar tu rentabilidad

Con la ayuda de tecnología propia, infraestructura, logística y el expertise de nuestro equipo de trabajo; ofrecemos soluciones que ayuden a optimizar recursos, reducir costos y aumentar la rentabilidad.

-   Freight Forwarding: Somos el intermediario estratégico entre nuestros clientes y los diferentes proveedores de transporte internacional de carga multimodal. Hacemos que tu carga llegue a destino sin complicaciones y en el tiempo que lo requieras.
-   Almacenaje: En Logistify te olvidas de las dificultades relacionadas con el almacenaje. Nos encargamos de todo el proceso de fulfillment: recibos, almacenaje, inventarios, empaques y todo lo necesario pare el envío de tu mercancía.
-   Última milla: Para grandes empresas, pymes o negocios e-commerce que buscan mejorar sus procesos y tiempos de entrega. Gestionamos tus pedidos y los convertimos en guías con trazabilidad total hasta el destino final.
-   Consulting: Nuestro equipo de expertos te asesorará para encontrar áreas de oportunidad y mejorar tus procesos logísticos actuales. Creamos soluciones flexibles para optimizar tus recursos.

¿Estás listo para descubrir lo que la logística puede hacer por tu empresa?

## Configuración de este proyecto

Antes de comenzar con la configuración de este proyecto asegurate de tener instalado las siguientes aplicaciones asi como tener conocimientos basicos en el desarrollo web y conocer las tecnologias utilizadas para el desarrollo de este proyecto.

### Aplicaciones necesarias

Estas aplicaciones son necesarias para poder configurar el proyecto, varia dependiendo del sistema operativo que tengas ya sea Windows, Mac OS o Linux, lo importante es tener el adecuado o similar para tu sistema operativo.

-   [Instalar NodeJS min versión 14](https://nodejs.org/en/)
-   [Instalar NPM min versión 8](https://www.npmjs.com/package/download)
-   [Instalar Git min versión 2](https://git-scm.com/downloads)
-   [Instalar un editor de código como Visual Studio Code](https://code.visualstudio.com/)

Cabe mencionar que estas son las aplicaciones para poder probar la aplicación en su propia computadora de manera efectiva, puede optar por usar sus propias aplicaciones siempre y cuando sea similiares o cumplan la misma función.

Cada aplicación tiene su propia configuración como descargar e instalar, algunas es necesario crear una cuenta, otras configurar pasos adicionales en su computador, lo importante es tener lista cada aplicación para correr el proyecto.

### Tecnologias utilizadas

El software que se utilizo para realizar este proyecto es de código abierto por lo que puede investigar y probar cada uno, se utilizaron estas tecnologias para poder llevar a cabo el desarrollo del sistema por lo que también debe estar actualizando sobre el cambio de version sobre las mismas asi como nuevas implementaciones.

-   [Angular 14](https://angular.io/docs)
-   [Angular Material](https://material.angular.io/)
-   [Typescript](https://www.typescriptlang.org/)
-   [Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
-   [Programación MVC (modelo-vista-controlador)](https://codea.app/blog/mvc-en-php)

Para mas información visite la documentación de cada tecnologia si es necesario para poder resolver las dudas sobre cada tecnologia que tenga problemas o indagar sobre nuevas actualizaciones que vayan surgiendo para estar siempre actualizado y no tener vulneravilidades que se puedan romper en el sistema.

### Pasos para instalar el proyecto en tu local

-   Clone este repositorio:

```bash
git clone https://github.com/DeveloperLogistify/logistify-angular-app.git
```

Esto creara una carpeta llamada logistify-angular-app

-   Acceda a la carpeta logistify-angular-app:

```bash
cd logistify-angular-app
```

-   Puede verificar que esta dentro de la carpeta con el comando:

```bash
pwd
```

-   Instale las dependencias de npm con el comando:

```bash
npm install
```

-   o puede actualizar las mismas dependencias con el comando:

```bash
npm update
```

-   Asegurece de instalar Angular Cli que permite manejar Angular

```bash
npm install -g @angular/cli
```

-   Una vez instalado todas las dependencias verifique que su URL este apuntando al servicio web correspondiente en la ruta:

```bash
cd src/common/global-constants.ts
```

-   Ahi esta la variable `apiURL` la cual debe tener el host del servicio web

```bash
public static apiURL: string = "http://54.172.217.230/api/v1";
```

-   Otra recomendación opcional es volver a actualizar las dependencias

```bash
npm update
```

-   Una vez actualizado todas las dependecias, limpie la cache de angular cli:

```bash
ng cache clean
```

-   Por último, debe iniciar su servidor para ello ejecute este comando en su terminal:

```bash
ng serve
```

-   Para verificar que el sistema este funcionando bien, vaya a un navegador e ingrese a la URL:

```bash
http://localhost:4200/
```

## Soporte

Para cualquier duda o aclaración, enviar un correo electrónico a:
```bash
developer.logistify@gmail.com
```

## Licencia

El marco de Angular es un software de código abierto mantenido por Google
El marco de desarrollo web para construir el futuro

<p align="center">
    <a href="https://www.logistify.com.mx/" target="_blank">
        <img width="100" height="100" title="Angular Material" src="https://material.angular.io/assets/img/homepage/angular-white-transparent.svg"/>
        <img width="100" height="100" title="Typescript" src="https://w7.pngwing.com/pngs/915/519/png-transparent-typescript-hd-logo-thumbnail.png"/>
    </a>
</p>
<hr>