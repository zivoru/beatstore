package ru.zivo.beatstore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.zivo.beatstore.model.Beat;
import ru.zivo.beatstore.model.Cart;
import ru.zivo.beatstore.model.User;
import ru.zivo.beatstore.service.BeatService;
import ru.zivo.beatstore.service.UserService;

import java.io.IOException;
import java.util.Set;

@RequestMapping("api/v1/users")
@RestController
public class BeatController {

    private final UserService userService;

    private final BeatService beatService;

    @Autowired
    public BeatController(UserService userService, BeatService beatService) {
        this.userService = userService;
        this.beatService = beatService;
    }

    @PostMapping("{userId}")
    public ResponseEntity<User> create(@PathVariable Long userId, @RequestParam(name = "file") MultipartFile photo) throws IOException {
        return ResponseEntity.ok(userService.register(userId, photo));
    }

    @PostMapping("beatId/{beatId}")
    public ResponseEntity<Beat> create(
            @PathVariable Long beatId,
            @RequestParam(name = "mp3") MultipartFile mp3,
            @RequestParam(name = "wav") MultipartFile wav,
            @RequestParam(name = "zip") MultipartFile zip
            ) throws IOException {
        return ResponseEntity.ok(beatService.uploadAudio(beatId, mp3, wav, zip));
    }

    @PostMapping("plays/{beatId}")
    public void create(@PathVariable Long beatId) {
        beatService.addPlay(beatId);
    }


    @PostMapping("beats/{userId}")
    public ResponseEntity<Beat> create(@PathVariable Long userId, @RequestBody Beat beat) {
        return ResponseEntity.ok(beatService.create(userId, beat));
    }


    @DeleteMapping("beats/{id}")
    public void delete(@PathVariable Long id) {
        beatService.delete(id);
    }

    @DeleteMapping("{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.delete(id);
    }

    @GetMapping("{id}")
    public ResponseEntity<Set<Cart>> getCart(@PathVariable Long id) {
        return ResponseEntity.ok(beatService.getCart(id));
    }
}
