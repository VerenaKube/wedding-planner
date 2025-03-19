pluginManagement {
    val quarkusPluginVersion: String by settings
    val quarkusPluginId: String by settings
    val openapiGeneratorPluginId: String by settings
    val openapiGeneratorPluginVersion: String by settings
    repositories {
        mavenCentral()
        gradlePluginPortal()
        mavenLocal()
    }
    plugins {
        id(quarkusPluginId) version quarkusPluginVersion
        id(openapiGeneratorPluginId) version openapiGeneratorPluginVersion
    }
}
rootProject.name = "wedding-planner-backend"
