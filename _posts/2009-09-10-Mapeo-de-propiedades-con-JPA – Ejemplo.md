---
layout: post
title:  "Parte 3 - Mapeo de propiedades con JPA – Ejemplo"
date:   2009-09-10 19:26:00
lang: en
autor: Augusto Darraidou
---
#Mapeo de propiedades con JPA – Ejemplo


Este es un simple modelo de datos que corresponde a un sistema que registra el alquiler de películas y datos de los socios.
![modelo de datos video club](http://adarraidou.files.wordpress.com/2009/09/modelo-de-datos-video-club.png?w=595)

De acuerdo a este modelo vamos a tener las siguientes clases.

Tabla | Clase
------|-----------
Peliculas | 	Pelicula
Copias_Peliculas | 	CopiaPelicula
Formatos | 	Formato
Socios | 	Socio
Alquileres | 	Alquiler
Ciudades | 	Ciudad


##Clase `Socio`
Una de las cosas que vamos a necesitar es indicar como se identifica cada socio (es decir la clave primaria), que propiedad corresponde a que columna, si una propiedad se representa por un objeto de una Entidad en vez de un tipo básico (Ciudad por ejemplo), y si queremos agrupar ciertas columnas que tienen un sentido de dominio (las columnas referidas a la direccion por ejemplo). En la siguiente tabla mostramos esto:

Propiedad | 	Columna |	Tipo	 | Anotación
------|----|---|----
id | 	socio_id | 	Integer | 	`@Id`<br> `@Column(name = "socio_id")`
nroSocio | 	nro_socio | 	String | 	`@Column(name = "nroSocio")`
nombre | 	nombre | 	String	
apellido | 	apellido | 	String	
direccion | 	ciudad_id<br>codigo_postal<br>dir_calle<br>dir_numero<br>dir_piso dir_depto | 	Direccion | 	`@Embedded`
fechaAlta | 	fecha_alta | 	java.util.Date | 	`@Temporal(TemporalType.DATE)`
telefono | 	telefono | 	String	 | 
ultimaActializacion | 	ultima_actualizacion | java.util.Date	 | 	`@Temporal(TemporalType.TIMESTAMP)`


Ejemplo propiedad socio_id:
{% highlight java %}
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Basic(optional = false)
@Column(name = "socio_id")
private Short id;
{% endhighlight %}

###@Id – @GeneratedValue
La columna `socios_id` es la clave primaria de la tabla Socios, es decir que la identifica univocamente. para indicar esto usamos la anotación `@Id`

> Nota: Las anotaciones `@Id` y `@GeneratedValue` seran desarroladas en otro momento cuando se vean los distintos casos de identificación de claves primarias y la generación de los valores de estas.

###@Basic
`@Basic(optional = false)` indica que este campo es obligatorio

###@Column
`@Column(name = "socio_id")` por defecto se toma el nombre de la propiedad como nombre de la columna con la cual se mapea, como en este caso se llaman distinto **(socio_id → id)** hay que indicarle cual es el nombre de la columna.

Para las propiedades **nombre, apellido** y **telefono**, como tienen el mismo nombre que sus columnas no hace falta indicarle nada más ya que por defecto se asume que son propiedades persistentes.

{% highlight java %}
private String nombre;
private String apellido;
private String telefono;
{% endhighlight %}


###@Embeddable – @Embedded

Veamos un caso especial que sucede con la dirección. En el modelo de datos no existe una tabla llamada Direcciones, sino que es una abstracción que realizamos nosotros para agrupar estas propiedades en una clase que les da sentido. Pero esta clase no es una entidad en si, no tiene una tabla para si misma donde se guarden sus datos. Para esto creamos una clase llamada **Direccion**, la anotamos con @Embeddable y ponemos las propiedades **ciudad, codigoPostal, calle, numero, piso, departamento**.

##Clase `Direccion`

Propiedad	|	Columna	|	Tipo	|	Anotación
----|---|-------|---
ciudad	|	ciudad_id	|	Ciudad	|	`@JoinColumn(name = "ciudad_id")`<br>`@ManyToOne`
codigoPostal	|	codigo_postal	|	String	|	`@Column(name = "codigo_postal")`
calle	|	dir_calle	|	String	|	`@Column(name = "dir_callel")`
numero	|	dir_numero	|	String	|	`@Column(name = "dir_numero")`
piso	|	dir_piso	|	String	|	`@Column(name = "dir_piso")`
departamento	|	dir_depto	|	String	|	`@Column(name = "dir_depto")`

Esta anotación no tiene atributos.

{% highlight java linenos %}
@Embeddable
public class Direccion {
   @JoinColumn(name = "ciudad_id")
   @ManyToOne
   private Ciudad ciudad;

   @Column(name = "codigo_postal")
   private String codigoPostal;

   @Column(name = "dir_calle")
   private String calle;

   @Column(name = "dir_numero")
   private String numero;

   @Column(name = "dir_piso")
   private String piso;

   @Column(name = "dir_dpto")
   private String departamento;

   /**Getters and Setters*/

}
{% endhighlight %}

¿como usamos esto en la clase Socio? Como cualquier tipo de Java pero agregándole la anotación `@Embedded`.

{% highlight java %}
@Embedded private Direccion direccion;
{% endhighlight  %}

> Esta misma clase se puede reutilizar en otras. Por ejemplo si existiese una tabla _Proveedores_ con datos de dirección. En un futuro desarrollo del tema vamos a ver como se pueden sobreescribir los mapeos de este tipo de propiedades.

###@Temporal
Nos quedan los campos **fecha_alta** y **ultima_actualizacion** que son de tipo Date el primero y Timestamp en segundo.
Para esto usamos una anotación nueva, `@Temporal`,  esta anotación sirve para indicar que se deben persistir solo tipos de datos `java.util.Date`  y `java.util.Calendar`. Los valores que acepta son:

- **DATE** – equivalente a `java.sql.Date`
- **TIME** – equivalente a `java.sql.Time`
- **TIMESTAMP** – equivalente a `java.sql.Timestamp`

{% highlight java %}

@Column(name = "fecha_alta")
@Temporal(TemporalType.DATE)
private java.util.Date fechaAlta;

@Column(name = "ultima_actualizacion")
@Temporal(TemporalType.TIMESTAMP)
private java.util.Date ultimaActualizacion;

{% endhighlight %}


##Clase `Pelicula`
Pasemos ahora a la tabla Peliculas. Listamos a continuación una tabla con las propiedades y sus características

Propiedad|	Columna|	Tipo|	Anotación
---|---|---|---
id|	pelicula_id|	Integer|	@Id<br>@Column(name = “pelicula_id”)
nombre|	nombre|	String|	
duracion|	duracion|	Short|	
calificacion|	calificacion|	enum Calificacion|	@Enumerated(STRING)
sinopsis|	sinopsis|	String	


##Clase `CopiaPelicula`

Pasemos ahora a la tabla CopiaPelicula. Listamos a continuación una tabla con las propiedades y sus características

Propiedad|	Columna|	Tipo|	Anotación
---|---|---|---
pelicula|	pelicula_id|	Pelicula	
nroCopia|	nro_copia|	Integer|	@Column(name = “nro_copia”)
formato|	formato_id|	Formato|	@JoinColumn(name = “ciudad_id”)<br>@ManyToOne
estado|	estado|	enum EstadoCopia|	@Enumerated(STRING)



### @Enumerated

**Ejemplo 1**

La columna calificacion de la tabla Peliculas esta definida como

{% highlight java  %}

ENUM(Apta para todo público.,
     Sólo apta para mayores de 13 años,
     Sólo apta para mayores de 18 años,
     Sólo apta para mayores de 18 años, de exhibición condicionada.)

{% endhighlight %}


Para reflejar esto en la clase Socios usamos un tipo Enum:

{% highlight java %}

@Entity
@Table(name = "Peliculas")
public class Pelicula implements Serializable {

   //…

   public enum Calificacion {
      A("Apta para todo público."),
      B("Sólo apta para mayores de 13 años."),
      C("Sólo apta para mayores de 18 años."),
      D("Sólo apta para mayores de 18 años, de exhibición condicionada.");
   
      private String value;

      Calificacion(String value){
         this.value = value;
      }

   }

   @Enumerated(STRING)
   private Calificacion calificacion;

   //…

}

{% endhighlight %}

**Ejemplo 2**

El Estado de la copia de la película se definió como

{% highlight java %}

ENUM(Libre, Alquilado, En_Reparacion, Fuera_de_Servicio)

{% endhighlight %}

Podemos reflejarlo de la siguiente manera:



{% highlight java %}
@Entity
@Table(name = "Copias_Peliculas")
public class CopiaPelicula implements Serializable {

   public enum EstadoCopia {
      LIBRE, ALQUILADO, EN_REPARACION, FUERA_DE_SERVICIO
   }

   //...

   @Enumerated(STRING)
   private EstadoCopia estado;

}

{% endhighlight %}

Después de tratar el tema de las relaciones entre entidades voy a subir los fuentes de los ejemplos.


