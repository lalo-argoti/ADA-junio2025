#!/bin/bash

nombre_proyecto="ejemplo-web"
package_dir="com/ada"
package_name="com.ada"

mkdir -p "$nombre_proyecto/src/main/java/$package_dir"
mkdir -p "$nombre_proyecto/src/main/webapp/WEB-INF"
mkdir -p "$nombre_proyecto/src/main/resources/META-INF"
mkdir -p "$nombre_proyecto/src/test/java/$package_dir"

# HelloWorldBean.java
cat > "$nombre_proyecto/src/main/java/$package_dir/HelloWorldBean.java" <<EOF
package $package_name;

import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;

@Named
@RequestScoped
public class HelloWorldBean {
    public String getMensaje() {
        return "¡Hola mundo desde JSF + Jakarta EE!";
    }
}
EOF

# index.xhtml
cat > "$nombre_proyecto/src/main/webapp/index.xhtml" <<EOF
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="jakarta.faces.html">
<h:head>
    <title>Hola Mundo JSF</title>
</h:head>
<h:body>
    <h1>#{helloWorldBean.mensaje}</h1>
</h:body>
</html>
EOF

# faces-config.xml
cat > "$nombre_proyecto/src/main/webapp/WEB-INF/faces-config.xml" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<faces-config xmlns="https://jakarta.ee/xml/ns/jakartaee"
              version="4.0">
</faces-config>
EOF

# beans.xml
cat > "$nombre_proyecto/src/main/resources/META-INF/beans.xml" <<EOF
<?xml version="1.1" encoding="UTF-8"?>
<beans xmlns="https://jakarta.ee/xml/ns/jakartaee"
       bean-discovery-mode="all"
       version="4.0">
</beans>
EOF

# pom.xml
cat > "$nombre_proyecto/pom.xml" <<EOF
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                             http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>$package_name</groupId>
    <artifactId>ejemplo-web</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <failOnMissingWebXml>false</failOnMissingWebXml>
    </properties>

    <dependencies>
        <dependency>
            <groupId>jakarta.platform</groupId>
            <artifactId>jakarta.jakartaee-api</artifactId>
            <version>10.0.0</version>
            <scope>provided</scope>
        </dependency>
    </dependencies>

    <build>
        <finalName>\${project.artifactId}</finalName>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
EOF

# README
cat > "$nombre_proyecto/README.md" <<EOF
# ejemplo-web

Proyecto web simple con JSF y Jakarta EE 10, compatible con Java 17.

## Cómo ejecutar

1. Ejecuta \`mvn clean package\`
2. Copia \`target/ejemplo-web.war\` al directorio \`deployments/\` de tu servidor Jakarta EE (Payara, WildFly 27+)
3. Abre en el navegador: http://localhost:8080/ejemplo-web/

Debe mostrar: **¡Hola mundo desde JSF + Jakarta EE!**
EOF

echo "✅ Proyecto '$nombre_proyecto' creado correctamente para Java 17 + Jakarta EE."
