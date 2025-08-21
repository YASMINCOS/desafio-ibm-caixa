# Use Maven com OpenJDK 17 para build
FROM maven:3.8.4-openjdk-17-slim AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar pom.xml primeiro (para cache de dependências)
COPY pom.xml .

# Baixar dependências
RUN mvn dependency:go-offline -B

# Copiar código fonte
COPY src ./src

# Compilar aplicação
RUN mvn clean package -DskipTests

# Usar OpenJDK 17 slim para runtime
FROM openjdk:17-jdk-slim

RUN apt-get update && apt-get install -y \
    fontconfig \
    fonts-dejavu-core \
    fonts-dejavu-extra \
    fonts-liberation \
    fonts-freefont-ttf \
    libfreetype6 \
    libxrender1 \
    libxi6 \
    libxext6 \
    libxtst6 \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar JAR compilado do estágio anterior
COPY --from=build /app/target/*.jar app.jar

COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /wait-for-it.sh

# Expor porta
EXPOSE 8080

# Executar aplicação
#ENTRYPOINT ["java", "-jar", "app.jar"]