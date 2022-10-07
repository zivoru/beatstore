package ru.zivo.beatstore.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class MainController {
    private static final String PAGE = "index";

    @GetMapping
    public String main() {
        return PAGE;
    }

    @GetMapping("*")
    public String feed() {
        return PAGE;
    }

    @GetMapping("beat/*")
    public String beat() {
        return PAGE;
    }

    @GetMapping("edit/*")
    public String edit() {
        return PAGE;
    }

    @GetMapping("playlist/*")
    public String playlist() {
        return PAGE;
    }

    @GetMapping("genre/*")
    public String genre() {
        return PAGE;
    }

    @GetMapping("tag/*")
    public String tag() {
        return PAGE;
    }
}
