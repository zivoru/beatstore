package ru.zivo.beatstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;

@EnableConfigurationProperties(BeatstoreProperties.class)
@SpringBootApplication
public class BeatstoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeatstoreApplication.class, args);
    }
}