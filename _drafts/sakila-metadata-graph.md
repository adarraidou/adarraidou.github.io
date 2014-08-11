---
layout: post
title: Sakila - Metadata
lang: es
categories:
    - es
autor: Augusto Darraidou
---



Buscando probar un base de datos NoSQL, más precisamente una base de grafos como [Neo4j][neo4j], me di cuenta que no tenia datos para hacerlo.
En verdad si tenía, podía utilizar [cypher][neo4j sample db] pero quería ver como _acomodar_ una base de datos relacional en este nuevo esquema.
Para esto me propuse **migrar** la base de datos [sakila][mysql sakila], pasarla de un esquema relacional a uno de grafos.

Comenzando por las tablas y relaciones para luego continuar con las vistas.

Mientras lo iba realizando me di cuenta que podía generalizar el proceso demanera que sirva para otras bases, no solo sakila.

Al principio queria ver el esquema, como se acomodaba a este paradigma, por lo que **generé** una base de datos en neo4j que contenía como datos la **estructura de la base relacional**, es decir las **tablas**, sus **columnas**, y las **relaciones** entre estas, de esta manera podía ver la metadata de la base relacional en un ambiente de grafos.

Una vez echo esto, **migré los datos** de sakila a neo4j, al principio leyendo los datos utilizando **jdbc** y generando comandos en **cypher** que pegaba en la consola de neo4j. 
Esto funcionó bien hasta que me encontré con las tablas que tenian gran cantidad de registros, ya no me dejaba relizarlo. Entonces creé un proceso que los insertara utilizando **batchInserter**.

En este post voy a migrar la metadata.


# ¿De que la va `Sakila`?

![Sakila model](http://dev.mysql.com/doc/workbench/en/images/wb-sakila-eer.png)



  [mysql]: http://dev.mysql.com/doc/index-other.html
  [mysql sakila]: http://dev.mysql.com/doc/sakila/en/
  [api jdbc]: http://docs.oracle.com/javase/7/docs/technotes/guides/jdbc/
  [api ResultSet]: http://docs.oracle.com/javase/7/docs/api/java/sql/ResultSet.html
  [api DatabaseMetaData]: http://docs.oracle.com/javase/7/docs/api/java/sql/DatabaseMetaData.html
  [neo4j]: http://neo4j.com
  [neo4j sample db]: http://docs.neo4j.org/chunked/stable/cypherdoc-movie-database.html
  [groovy]: http://groovy.codehaus.org/

