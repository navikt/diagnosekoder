import org.jetbrains.kotlin.gradle.dsl.JvmTarget

val kotlinVersion = "1.9.0"
val jacksonVersion = "2.15.2"

plugins {
    kotlin("jvm") version "1.9.0"
}

group = "no.nav.helse"
version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib:$kotlinVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$jacksonVersion")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:$jacksonVersion")

    testImplementation(kotlin("test"))
}


tasks.test {
    useJUnitPlatform()
}