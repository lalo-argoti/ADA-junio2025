README.md
# Proyecto Java Spring Boot - Ejemplo Web

Este es un proyecto básico de ejemplo usando Spring Boot con Java 17, Maven y Docker.

---

## Estructura del proyecto

```.
├── Dockerfile
├── mvnw
├── mvnw.cmd
├── pom.xml
└── src
└── main
├── java
│ └── com
│ └── ejemplo
│ ├── App.java
│ └── controller
│ └── HelloController.java
└── resources
├── application.properties
└── static
```

---

## Requisitos

- Java 17
- Maven (o usa el wrapper `./mvnw`)
- Docker (opcional para contenerización)

---

## Cómo compilar y ejecutar localmente

1. Compilar el proyecto:

   ```bash
   ./mvnw clean package
Ejecutar el JAR generado:
```

bash
Copiar

```
java -jar target/java-mvc-project-1.0-SNAPSHOT.jar
```

Acceder a la app en el navegador:

```
http://localhost:8080/hola
```

Crear y ejecutar la imagen Docker
Construir la imagen:

bash
Copiar
Editar
docker build -t mi-app-java .
Ejecutar el contenedor:

bash
Copiar
Editar
docker run -p 8080:8080 mi-app-java
Acceder a la app en el navegador:

bash
Copiar
Editar
http://localhost:8080/hola
