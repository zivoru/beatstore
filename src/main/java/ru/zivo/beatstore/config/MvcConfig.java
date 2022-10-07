package ru.zivo.beatstore.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;
import ru.zivo.beatstore.config.properties.BeatstoreProperties;

@Configuration
public class MvcConfig implements WebMvcConfigurer {

    private final String uploadPath;

    @Autowired
    public MvcConfig(BeatstoreProperties beatstoreProperties) {
        this.uploadPath = beatstoreProperties.getUploadPath();
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/resources/**")
                .addResourceLocations("file:///" + uploadPath + "/")
                .setCachePeriod(3600)
                .resourceChain(true)
                .addResolver(new PathResourceResolver());
    }
}