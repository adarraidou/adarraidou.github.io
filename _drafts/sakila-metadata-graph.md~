---
layout: post
title: Relational 2 Graph - Metadata
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


##Plan
Los pasos que tengo que realizar son:

###Metadata
Analizar la estructura del modelo relacional, el de grafos y sus las similitudes

1. Entender los patrones básicos de los grafos para poder traducir las tablas y sus relaciones (FK -> PK). 
2. Migrar la estructura de la base relacional, **no los datos**. para tener un esquema base e ir probando diferentes cosas.
3. Ver esta estructura en un gráfico.

###Definir la estructura a migrar
En una primera instancia voy a migrar la base completa, por cada tupla genero un nodo, por cada _foreign key_ en una tabla, una relación en la nueva base

#Paradigms

## RDBMS

### Sakila example
Aca explico de que se trata el modelo de la base de datos de prueba **sakila**, que tiene actores, `peliculas`, `alquileres` y como se crean las tablas intermedias, por ejemplo `film_has_category`.
puedo empezar por hacer un der normal y luego agregarle esas tablas, para señalar que solo estan para adecuar el modelo de datos al modelo de un rdbms.

ERD  | Graph Diagram
----|---
{% plantuml %}
left to right direction
object films {
   **film_id LONG**
   name VARCHAR
}

object actors {
   **actor_id LONG**
   name VARCHAR
}

object film_has_actor {
   **film_id LONG**
   **actor_id VARCHAR**
   role VARCHAR
}

films "1"--"*" film_has_actor
actors "1"--"*" film_has_actor

{% endplantuml %} | {% plantuml %}
left to right direction

(film) "acted in"-- (actor)

{% endplantuml %}

## Graph

**Simplified model**

{% plantuml %}
left to right direction

(Table) -->"*" (Column): has_column
Table  <-- Table :"references"

{% endplantuml %}


## Object

Aqui señalo como es el modelo de `ResultSet`

{% plantuml %}
left to right direction

class Table
class Column
class FK

Table --"*" Column: has_columns
Table -- Column: is_pk
Table "source"<-- FK
Table "reference" --> FK
{% endplantuml %}


-------------

# Generalización 

##Model


Model | RDBMS | Java | Graph
---|---|---
_Tipo_    |   Table   |   DBTable |   (node:`DBTable`)
_Name_    |   table.name |    name : `String`    |node.`name`
_Metadata_ | table.meta   |   meta: `[key:value] getters and setters`    |node.`properties`
_Properties_ |    table.columns|  columnList : `List <DBColumn>`    |   `(node:DBTable)-[:HAS_COLUMN]-(c:DBColumn)`<br>  `return c`
_Relationships_   | table.fkList| fkList : `List<DBImportedKey>` |   `(node:DBTable)-[fk:FK_TYPE]-(node2:DBTable)`<br>  `return fk`

##Property

Model | RDBMS | Java | Graph
---|---|---
_Tipo_    |   Column   |    DBColumn  |   (node:`DBColumn`)
_Name_    |   column.name | name: `String`     |   node.`name`
_Metadata_ | column.meta   |   meta: `[key:value] getters and setters`   |   node.`properties`
_Relationships_   | column.fkColumn  |     |    `(node:DBColumn)-[fkCol:IS_FK_COL]-(node2:DBColumn)`<br>  `return fkCol`

##Relationship

Model | RDBMS | Graph
---|---|---
_Tipo_    |   ImportedKey   |   `(t1:DBTable)-[rel:IS_FK_COL]-(t2:DBTable)`<br>`return rel`
_Name_    |   importedKey.fkName |   rel.`name`
_Metadata_ | importedKey.meta   |   rel.`properties`


###Optimizar la migración

###

Procesar JDBC Metadata
======================
Que es una base de datos relacional?
Bueno es esto [mysql][mysql]
Para poder leer esta estructura utilizo las apis [jdbc][api jdbc] de java, primero leo de [java.sql.ResultSet][api ResultSet]


Procesa JDBC Metadata
---------------------
Carga de objetos
-------------

Tabla1 | tabla1_has_tabla2| Tabla2
-----|---|---
film|film_has_actor|actor
film|film_has_actor|actor
film|film_has_actor|actor



#Genera archivos
##Archivos Cypher
###JavaBeans
###etc
#BatchImport
##Metadata en Neo4J
##Datos de la base relacional
#Depura relaciones de grafos


## Hacer una diapositiva para ver la evolución

**Base level**

{% plantuml %}
left to right direction
(Film) --> (film_id) :"has_column | has_pk_column"
(Film) --> (film_name) :has_column

(Actor) --> (actor_id) :"has_column | has_pk_column"
(Actor) --> (actor_name) :has_column

(film_has_actor) --> (film_id) : "has_column | has_pk_column"
(film_has_actor) --> (actor_id) : "has_column | has_pk_column"
(film_has_actor) --> (role) : has_column


{% endplantuml %}

**Graph**

{% plantuml %}

(Film) --> (film_id) :"has_column | has_pk_column"
(Film) --> (film_name) :has_column

(Actor) --> (actor_id) :"has_column | has_pk_column"
(Actor) --> (actor_name) :has_column

(Film) -- (Actor)
{% endplantuml %}





  [mysql]: http://dev.mysql.com/doc/index-other.html
  [mysql sakila]: http://dev.mysql.com/doc/sakila/en/
  [api jdbc]: http://docs.oracle.com/javase/7/docs/technotes/guides/jdbc/
  [api ResultSet]: http://docs.oracle.com/javase/7/docs/api/java/sql/ResultSet.html
  [api DatabaseMetaData]: http://docs.oracle.com/javase/7/docs/api/java/sql/DatabaseMetaData.html
  [neo4j]: http://neo4j.com
  [neo4j sample db]: http://docs.neo4j.org/chunked/stable/cypherdoc-movie-database.html
  [groovy]: http://groovy.codehaus.org/

