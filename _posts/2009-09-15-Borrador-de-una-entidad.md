---
layout: post
title:  "Parte 4 - Borrador de una entidad"
date:   2009-09-15 19:26:00
lang: en
autor: Augusto Darraidou
---
# Borrador de una entidad

Para pasar en limpio lo que tengo sobre entidades, sin tener en cuenta la herencia y no entrar en más detalle con otras anotaciones o las validaciones, una clase de una entidad puede componerse de la siguiente forma:
De acuerdo a este modelo vamos a tener las siguientes clases.


{% highlight java %}
@Entity

//properties

    @Identity/ies
    -> @Id
    //Para mas de un campo en la PK
    -> @EmbbededId    (usa una clase @Embbedable)
    -> @IdClass        (tiene una clase propia)

    @Basic

    @Embbeded

    @OneToOne
    @OneToMany
    @ManyToOne
    @ManyToMany

    --
    //Derived identities
    @MappedById("nomColumnaPk") // maps to nomColumnaPk attribute of @EmbeddedId (@ManyToOne, @OneToOne, ¿otros?)

    @ElementCollection

//Getter and Setters
    getProperties();
    setProperties();

//Otros
    equals
    toString
{% endhighlight %}


