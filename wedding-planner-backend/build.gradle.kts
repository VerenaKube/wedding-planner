plugins {
    java
    id("io.quarkus")
    id("org.openapi.generator")
}

repositories {
    mavenCentral()
    mavenLocal()
}

val quarkusPlatformGroupId: String by project
val quarkusPlatformArtifactId: String by project
val quarkusPlatformVersion: String by project
val jakartaValidationVersion: String by project
val microprofileVersion: String by project
val lombokVersion: String by project

dependencies {
    implementation(enforcedPlatform("${quarkusPlatformGroupId}:${quarkusPlatformArtifactId}:${quarkusPlatformVersion}"))
    implementation("io.quarkus:quarkus-resteasy")
    implementation("io.quarkus:quarkus-resteasy-jackson")
    implementation("io.quarkus:quarkus-config-yaml")
    implementation("io.quarkus:quarkus-arc")
    implementation("jakarta.validation:jakarta.validation-api:${jakartaValidationVersion}")
    implementation("io.quarkiverse.microprofile:quarkus-microprofile:${microprofileVersion}")
    implementation("org.projectlombok:lombok:${lombokVersion}")
    annotationProcessor("org.projectlombok:lombok:${lombokVersion}")
    testImplementation("io.quarkus:quarkus-junit5")
}

group = "de.swf.ehv"
version = "1.0-SNAPSHOT"

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

sourceSets {
    main {
        java.srcDir("src/main/java")
        java.srcDir("$buildDir/generated-resources/src/main/java")
    }
}

openApiGenerate {
    generatorName.set("jaxrs-spec")
    inputSpec.set("$rootDir/../api/openapi.yaml")
    outputDir.set("$buildDir/generated-resources")
    configOptions.set(
        mapOf(
            "sourceFolder" to "src/main/java",
            "modelPackage" to "de.swf.ehv.planner.generated.api.model",
            "apiPackage" to "de.swf.ehv.planner.generated.api",
            "interfaceOnly" to "true",
            "library" to "quarkus",
            "dateLibrary" to "java8",
            "generateBuilders" to "true",
            "booleanGetterPrefix" to "is",
            "useJakartaEe" to "true",
            "useTags" to "true",
            "useSwaggerAnnotations" to "false",
            "useMicroProfileOpenAPIAnnotations" to "true",
            "returnResponse" to "true",
        )
    )
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}
tasks.withType<JavaCompile> {
    dependsOn("openApiGenerate")
    options.encoding = "UTF-8"
    options.compilerArgs.add("-parameters")
}
