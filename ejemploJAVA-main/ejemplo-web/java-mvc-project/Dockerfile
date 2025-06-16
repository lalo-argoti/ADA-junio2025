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

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
