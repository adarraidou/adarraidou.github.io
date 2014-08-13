---
layout: post
title: Relational 2 Graph - Cypher
lang: es
categories:
    - es
autor: Augusto Darraidou
---
[toc]

En el [post anterior](jdbc) vimos como obtener la metadata de la estructura de la base de datos, el paso siguiente es cargarlos en la base de Neo4j.
Para esto tenemos varias opciones

 - Ejecutar comandos **Cypher**
 - Generar archivos **CSV** e [importarlos con Cypher](http://docs.neo4j.org/chunked/milestone/cypherdoc-importing-csv-files-with-cypher.html?_ga=1.147778295.1144920925.1390911101)
 - Usar **BatchImporter.**

Nosotros vamos a utilizar esta primera opción y más adelante mostraré como utilizar BatchImporter para grandes volúmenes de datos.

# Requisitos

Tener Instalado:
 - [Java JDK][java jdk] , versión mínima 7.
 - [MySql][mysql] 
 - [Sakila][mysql sakila]



## Cypher
> Cypher is a declarative graph query language that allows for expressive and efficient querying and updating of the graph store. Cypher is a relatively simple but still very powerful language. Very complicated database queries can easily be expressed through Cypher. This allows you to focus on your domain instead of getting lost in database access.
[read more](http://neo4j.com/docs/2.1.3/cypher-introduction/)

El modelo que tendríamos para mostrar la estructura de nuestra base, usando Cypher, es el siguiente

{% highlight cypher %}

(aTable:DBTable)-[:FK]->(anotherTable:DBTable)
(aTable)-[:HAS_COLUMN]->(column1:DBColumn)
(aTable)-[:HAS_COLUMN]->(column2:DBColumn)

(aTable)-[:IS_PK_COLUMN]->(column1)

(column2)-[:IS_FK_COLUMN]->(otherColumn:DBColumn)-[:IS_PK_COLUMN]->(anotherTable)

{% endhighlight %}

simplificado por este gráfico que nos muestra que tipos de nodos tenemos y como se relacionan

{% plantuml %}

(:dbTable) --> (:dbTable) :FK
(:dbTable) --> (:dbColumn) :HAS_COLUMN
(:dbTable) <-- (:dbColumn) :IS_PK_COLUMN
(:dbColumn) <-- (:dbColumn) :IS_FK_COLUMN

{% endplantuml %}

## Proceso

 1. levantar el servidor Neo4J
 2. levantar el servidor MySQL
 3. establecer las propiedades de conexión de Neo4J
 4. establecer las propiedades de conexión de MySQL
 5. correr la aplicación que escribimos en el post anterior
 6. genera un archivo con código cypher
 7. ver el resultado en http://localhost:7474
 8. mostrar consultas de ejemplo
	- tablas con más columnas
	- tablas más referenciadas
	- tablas sin referencias
	- posibles referencias no establecidas (mapeamos por nombre de la pkcolumna)

## Generando las sentencias Cypher

Vimos que tenemos tablas, columnas, tablas que referencian a tablas, columnas que son parte de la clave primaría y columnas que referencian a columnas de otras tablas.
Para poder cargar esto necesitamos generar las sentencias en este orden:

{% highlight cypher %}
 // 1. TABLES
 
CREATE (table_id:DBTable { 
    TABLE_NAME : 'staff', 
    REMARKS : '', 
    TABLE_TYPE : 'TABLE', 
    TABLE_CAT : 'sakila',  
    name: 'staff' }) 

// 2. COLUMNS
CREATE (table_id)-[:HAS_COLUMN]->(column_id:DBColumn { 
    TABLE_NAME : 'film_text', 
    SQL_DATETIME_SUB : '0', 
    REMARKS : '', 
    BUFFER_LENGTH : '65535', 
    NULLABLE : '0', 
    IS_NULLABLE : 'NO', 
    TABLE_CAT : 'sakila', 
    NUM_PREC_RADIX : '10', 
    SQL_DATA_TYPE : '0', 
    COLUMN_SIZE : '5', 
    TYPE_NAME : 'SMALLINT', 
    IS_AUTOINCREMENT : 'NO', 
    COLUMN_NAME : 'film_id', 
    ORDINAL_POSITION : '1', 
    DECIMAL_DIGITS : '0', 
    DATA_TYPE : '5',
    name: 'film_text' })

// 3. establecer columnas que son pk
CREATE (table_id)<-[:IS_PK_COLUMN {order: 1 } ]-(column_id)

// 4. establecer relaciones de fk entre tablas
CREATE (table_id)<-[:FK {name: 'FK_NAME', deferrability: 7, updateRule: 0, deleteRule: 3 }]-(other_table_id) 

// 5. establecer relaciones de fk entre columnas
CREATE (column_id)<-[:IS_FK_COLUMN {name: 'FK_NAME', keySeq:1}]-(other_column_id)
{% endhighlight %}

## GStringTemplateEngine
Para facilitar el proceso de generación de archivos decidí utilizar [GStringTemplateEngine](http://groovy.codehaus.org/Groovy+Templates#GroovyTemplates-GStringTemplateEngine) como motor de plantillas.
Si bien este es un ejemplo simple también se puede utilizar para generar otro tipo de texto, clases JavaBean, mapeos JPA, mapeos de Hibernate, etc.
A continuación muestro la plantilla:

Clase Java | Sentencia Cypher | plantilla
--- | --- | ---
DBTable | Sentencia Cypher | plantilla
DBColumn | Sentencia Cypher | plantilla
DBTable.pkColumns | Sentencia Cypher | plantilla
DBTable.exportedKeys | Sentencia Cypher | plantilla


{% highlight gsp %}
/****************************************
           TABLES
****************************************/
<% tables.each { table ->  
   def tableId = table.id
%>
CREATE ($tableId:DBTable { <% 
    table.meta.each { k, v ->    
%>$k : '$v', <% 
    }
%> name: '${table.tableName}' }) <% 
   } %>

/****************************************
           COLUMNS
****************************************/
<% columns.each { column ->  
   def tableId = column.table.id
   def columnId = column.id
%>
CREATE ($tableId)-[:HAS_COLUMN]->($columnId:DBColumn { <% 
    column.meta.each { k, v ->    
%>$k : '$v', <% 
    }
%> name: '${column.tableName}' }) <% 
   } %>
   
/****************************************
           PRIMARY KEYS
****************************************/
<% tables.each { table ->  
    def tableId = table.id
    table.primaryKey?.eachWithIndex { pkColumn, idx ->
       %>      
CREATE ($tableId)<-[:IS_PK_COLUMN {order: ${idx + 1} } ]-(${pkColumn.id})<% 
     }
  }
%>

/****************************************
   FOREIGN KEYS and COLUMNS REFERENCES
****************************************/
<% tables.each { table ->  
    table.importedKeyList?.each { ref ->
        def fkName = ref.fkName.toUpperCase()
       %>             
CREATE (${table.id})<-[:FK {name: '$fkName', deferrability: ${ref.deferrability}, updateRule: ${ref.updateRule}, deleteRule: ${ref.deleteRule} }]-(${ref.pkTable.id}) <% 
        ref.referenceColumns.each { refColumns -> %>
CREATE (${refColumns.pkColumn.id})<-[:IS_FK_COLUMN {name: '$fkName', keySeq:${refColumns.keySeq}}]-(${refColumns.fkColumn.id}) <%      
        } 
     }
  }
%>

{% endhighlight %}


Un ejemplo de la sentencia Cypher para cargar la tabla es:

# Corremos proceso

# Ctrl+C -> Ctrl+V

# Corremos las sentencias generadas

# Resumen
...

#Próximos pasos

Tenemos cargado el modelo de la base relacional en un ambiente de grafos, después les voy a mostrar como utilizar cypher para navegar por las tablas a través de sus relaciones.


[java jdk]: (http://www.oracle.com/technetwork/java/javase/downloads/index.html)
[mysql]: http://dev.mysql.com/downloads/mysql/
[mysql sakila]: http://dev.mysql.com/doc/sakila/en/
[neo4j]: http://neo4j.com
