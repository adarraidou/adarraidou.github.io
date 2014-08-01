---
layout: post
title:  "Parte 2"
date:   2009-09-10 19:26:00
categories: RDBMS jpa java
autor: Augusto Darraidou
---

# Mapeo de propiedades con&nbsp;JPA

			

Vimos que para mapear una clase con una tabla usabamos las anotaciones @Entity y @Table, ahora vamos a explicar como mapeamos las propiedades de las clases con las columnas de las tablas.
Existen distintos tipos de anotaciones para mapear propiedades. Esto depende del tipo de dato de las columnas de la tabla, si es una relación con otra tabla, etc.
Haciendo una breve resumen existen varias anotaciones para realizar esto:

---------------

## mapeo directo

@Basic
:	La anotación Basic es la mas simple de todas, tiene dos atributos **fetch**, que define que estrategia se usa para traer los datos de la base de datos (`FetchType.EAGER | FetchType.LAZY`), y **optional** que toma valor booleano dependiendo de que el campo pueda o no ser nulo.

---------------

@Enumerated
:	Se usa cuando se quiere guardar valores enumerados de constantes 	(Ordinales o de Texto). Tiene un solo atributo para configurar que 	es **value** (`EnumType.ORDINAL | EnumType.STRING`).

---------------

@Temporal
:	Se usa para campos de tipo `java.util.Date` y `java.util.Calendar`

---------------

@Lob
:	Se usa esta anotación junto con un mapeo básico para 	especificar que una propiedad o campo persistente debe ser manejado 	como un `Clob, Blob, etc`.

---------------

@Transient
:	Por defecto JPA supone que todos los campos de una entidad son 	persistentes. Se usa esta anotacion para indicar cuando una 	propiedad no es persistente.

---------------

## de relaciones...

@OneToOne (Uno a Uno)
:	Cuando una entidad A referencia a una Entidad B, y ningún otro A puede referenciar a B, decimos que tenemos una relación OneToOne.

---------------

@ManyToOne (Muchos a Uno)
:	Cuando una entidad A referencia a una entidad B, y otros A pueden referenciar a este mismo B, decimos que tenemos una relación 	ManyToOne.

---------------

@OneToMany (Uno a Muchos)
:	Cuando una entidad A refencia multiples entidades B, y no hay dos A que referencien el mismo B decimos que tenemos una relación 	OneToMany

---------------

@ManyToMany (Muchos a Muchos)
:	Cuando muchas entidades A referencian a muchas entidades B, y otras entidades A pueden referenciar algunas de las mismas B decimos 	que tenemos una relación ManyToMany.
- @MapKey
- @OrderBy

---------------

## ...y de composición

@Embeddable
:	Se usa esta anotación para especificar una clase cuyas 	instancias son almacenadas como parte de una entidad propietaria. 	Cada una de las propiedades o campos de este **Embedded 	Object** (objeto integrado) es mapeado a la tabla de la 	entidad propietaria.

---------------

@Embedded
:	Se utiliza esta anotación para indicar que se esta usando un 	objeto integrado. Las propiedades de este objeto se mapearan con la 	tabla de la entidad donde esta siendo utilizado.

(Ver ejemplo de `Direccion`> y `Socio`)


---------------

## por ultimo


Las siguientes anotaciones se utilizan para sobrescribir propiedades y asociaciones que se declaran por ejemplo en herencia de clases, las clases `@Embeddable`, etc. Se van a desarrollar en un futuro post.

- `@AttributeOverride`
- `@AttributeOverrides`
- `@AssociationOverride`
- `@AssociationOverrides`


