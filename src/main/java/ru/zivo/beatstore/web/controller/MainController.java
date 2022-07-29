package ru.zivo.beatstore.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/")
public class MainController {
    @GetMapping
    public String main() {
        return "index";
    }

    @GetMapping("*")
    public String feed() {
        return "index";
    }

    @GetMapping("/beat/*")
    public String beat() {
        return "index";
    }
}
