---
layout: post
title:  "Parte 1 - Entidades"
date:   2009-09-01 19:26:00
lang: en
tags:
   - rdbms 
   - java
   - jpa
---
# Entidades
Antes que nada, supongamos que tenemos una base de datos con una tabla llamada **Personas** definida de la siguiente manera.

{% highlight java %}

skinparam monochrome true

object Persona {
   **id INT**
   nombre VARCHAR(45)
   apellido VARCHAR(45)
}

{% endhighlight %}


Entonces para mapear una clase con esta tabla solo tenemos que definir la clase `Personas.java` como sigue.

{% highlight java %}
@Entity
public class Personas implements Serializable {
   /*Campos, Getters and Setters*/
   ...
}
{% endhighlight %}


La anotación `@Entity` sirve para designar una clase POJO (Plain Old Java object) como una entidad para que pueda usar los servicios de JPA.
Como JPA funciona usando valores por defecto no hace falta indicarle como se llama la tabla, ya que busca una con el mismo nombre que la clase.
En el caso de que quisieramos que la clase tenga un nombre diferente al de la tabla, `Persona` por ejemplo (que está en singular), hay que indicarle cual es la tabla con la que se mapea, para esto se utiliza la anotación `@Table`


{% highlight java %}
@Entity
@Table(name = "Personas")
public class Persona implements Serializable {
   /*Campos, Getters and Setters*/
   ...
}
{% endhighlight %}

## Resumen
Tenemos una tabla llamada `Personas`

1. Creamos una clase (Persona.java o Persona.java por ejemplo).
2. Dicha clase tiene que tener la anotación `@Entity` antes de la definición de la clase.
3. Si la clase no se llama igual que la tabla debe agregarse la anotación `@Table(name="NombreTabla")`
4. Implementar la interface `java.io.Serializable`

## Persona.java

{% highlight java %}
import java.io.Serializable;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table("Personas")
public class Persona implements java.io.Serializable {

    private Integer id;
    private String nombre;
    private String apellido;

    /**********************
     * Getters and Setters *
     ***********************/
    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return this.apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }
}

{% endhighlight %}

## Links asociados

- [JSR 317: JavaTM Persistence 2.0][JSR 317]
- [TopLink JPA Annotation Reference][TopLink JPA]




[JSR 317]: http://jcp.org/en/jsr/detail?id=317
[TopLink JPA]: http://www.oracle.com/technology/products/ias/toplink/jpa/resources/toplink-jpa-annotations.html
