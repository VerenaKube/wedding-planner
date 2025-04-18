plugins {
    java
    alias(libs.plugins.quarkus) apply true
    alias(libs.plugins.openapi.generator) apply true
}

repositories {
    mavenCentral()
    mavenLocal()
}

dependencies {
    implementation(enforcedPlatform(libs.quarkus.bom))
    implementation(libs.quarkus.resteasy)
    implementation(libs.quarkus.resteasy.jackson)
    implementation(libs.quarkus.config.yaml)
    implementation(libs.quarkus.arc)
    implementation(libs.quarkus.mongo.panache)
    implementation(libs.jakarta.validation.api)
    implementation(libs.quarkus.microprofile)
    implementation(libs.apache.commons)
    implementation(libs.lombok)
    annotationProcessor(libs.lombok)
    testImplementation(libs.quarkus.junit5)
    testImplementation(libs.testcontainers.mongodb)
    testImplementation(libs.assertj.core)
    testImplementation(libs.rest.assured)
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
        java.srcDir("${layout.buildDirectory.get()}/generated-resources/src/main/java")
    }
}

openApiGenerate {
    generatorName.set("jaxrs-spec")
    inputSpec.set("$rootDir/../api/openapi.yaml")
    outputDir.set("${layout.buildDirectory.get()}/generated-resources")
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

tasks.named("compileJava") {
    dependsOn("openApiGenerate")
    dependsOn("compileQuarkusGeneratedSourcesJava")
}

tasks.named("quarkusGenerateCodeTests") {
    dependsOn("compileJava")
}

tasks.withType<Test> {
    systemProperty("java.util.logging.manager", "org.jboss.logmanager.LogManager")
}
tasks.withType<JavaCompile> {
    dependsOn("openApiGenerate")
    options.encoding = "UTF-8"
    options.compilerArgs.add("-parameters")
}
