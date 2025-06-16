#!/bin/bash

# Variables
PROJECT_NAME="java-mvc-project"
PACKAGE_PATH="com/ejemplo"
PORT=8080

echo "Creando estructura del proyecto..."

mkdir -p $PROJECT_NAME/src/main/java/$PACKAGE_PATH/controller
mkdir -p $PROJECT_NAME/src/main/java/$PACKAGE_PATH/model
mkdir -p $PROJECT_NAME/src/main/java/$PACKAGE_PATH/repository
mkdir -p $PROJECT_NAME/src/main/java/$PACKAGE_PATH/service
mkdir -p $PROJECT_NAME/src/main/java/$PACKAGE_PATH/config
mkdir -p $PROJECT_NAME/src/main/resources/static
mkdir -p $PROJECT_NAME/src/main/resources

echo "Creando archivos Java..."

# App.java
cat > $PROJECT_NAME/src/main/java/$PACKAGE_PATH/App.java <<EOF
package $PACKAGE_PATH;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
EOF

# HelloController.java
cat > $PROJECT_NAME/src/main/java/$PACKAGE_PATH/controller/HelloController.java <<EOF
package $PACKAGE_PATH.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
    @GetMapping("/")
    public String hola() {
        return "Hola Mundo";
    }
}
EOF

# application.properties vacío
touch $PROJECT_NAME/src/main/resources/application.properties

echo "Creando pom.xml..."

cat > $PROJECT_NAME/pom.xml <<EOF
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <modelVersion>4.0.0</modelVersion>
    <groupId>com.ejemplo</groupId>
    <artifactId>java-mvc-project</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.2</version>
        <relativePath/>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
EOF

echo "Creando Dockerfile..."

cat > $PROJECT_NAME/Dockerfile <<EOF
# Imagen base con JDK y Maven para compilar y ejecutar
FROM maven:3.9.4-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Construir la aplicación y empaquetar jar
RUN mvn clean package -DskipTests

# Imagen runtime solo con JRE
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/java-mvc-project-1.0-SNAPSHOT.jar app.jar

EXPOSE $PORT

ENTRYPOINT ["java", "-jar", "app.jar"]
EOF

echo "Creando docker-compose.yml..."

cat > $PROJECT_NAME/docker-compose.yml <<EOF
version: "3.9"

services:
  app:
    build: .
    ports:
      - "$PORT:$PORT"
EOF

echo "Creando scripts mvnw y mvnw.cmd..."

# Descarga Maven Wrapper para que funcione el mvnw (opcional y recomendado)
# O si quieres, puedes generar los scripts básicos

cat > $PROJECT_NAME/mvnw << 'EOF'
#!/bin/sh
# mvnw script simplificado que llama al mvn instalado
mvn "$@"
EOF

cat > $PROJECT_NAME/mvnw.cmd << 'EOF'
@echo off
mvn %*
EOF

chmod +x $PROJECT_NAME/mvnw

echo "Proyecto creado en $PROJECT_NAME"
echo "Para construir y levantar la app:"
echo "  cd $PROJECT_NAME"
echo "  docker-compose up --build"
