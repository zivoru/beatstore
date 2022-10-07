package ru.zivo.beatstore.config.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "beatstore")
public class BeatstoreProperties {
    private String uploadPath;
}
