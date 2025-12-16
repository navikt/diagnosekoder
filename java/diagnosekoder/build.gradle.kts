import org.jetbrains.kotlin.gradle.dsl.JvmTarget

val kotlinVersion = "2.2.21"
val jacksonVersion = "2.19.4"

plugins {
    kotlin("jvm") version "2.2.21"
    id("maven-publish")
}

group = "no.nav.helse"

// We use a separate version.txt file to facilitate automatically incrementing/setting the version from github actions.
val versionFile = rootProject.file("version.txt")
version = versionFile.readText().trim()

repositories {
    mavenCentral()
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_21)
    }
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib:$kotlinVersion")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin:$jacksonVersion")
    implementation("com.fasterxml.jackson.datatype:jackson-datatype-jsr310:$jacksonVersion")

    testImplementation(kotlin("test"))
}

publishing {
    repositories {
        maven {
            url = uri("https://maven.pkg.github.com/navikt/diagnosekoder")
            credentials {
                username = System.getenv("GITHUB_USERNAME")
                password = System.getenv("GITHUB_PASSWORD")
            }
        }
    }
    publications {
        create<MavenPublication>("mavenJava") {
            pom {
                description.set("ICD-10 og ICPC-2 Diagnosekoder fra direktoratet for e-helse.")
                url.set("https://github.com/navikt/diagnosekoder")
                licenses {
                    license {
                        name.set("MIT License")
                        url.set("https://opensource.org/licenses/MIT")
                    }
                }
                scm {
                    connection.set("scm:git:https://github.com/navikt/diagnosekoder.git")
                    developerConnection.set("scm:git:https://github.com/navikt/diagnosekoder.git")
                    url.set("https://github.com/navikt/diagnosekoder")
                }
            }
            from(components["java"])
        }
    }
}


tasks.test {
    useJUnitPlatform()
}

// Used by github action increment-version workflow
tasks.register("incrementVersion") {
    group = "my tasks"
    description = "Increments or sets the version number in the version.txt file."
    fun generateVersion(): String {
        val (oldMajor, oldMinor, oldPatch) = version.toString().split(".").map(String::toInt)
        val (newMajor, newMinor, newPatch) = arrayOf(oldMajor, oldMinor, oldPatch + 1)
        return "$newMajor.$newMinor.$newPatch"
    }
    doLast {
        val newVersion = properties["overrideVersion"] as String? ?: generateVersion()
        val oldContent = versionFile.readText()
        val newContent = oldContent.replace(version.toString(), newVersion)
        if (oldContent == newContent) {
            throw Exception("version was not incremented. Could not increment ${oldContent} to ${newContent}")
        }
        versionFile.writeText(newContent)
    }
}