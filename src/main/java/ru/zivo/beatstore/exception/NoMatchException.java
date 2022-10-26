package ru.zivo.beatstore.exception;

public class NoMatchException extends RuntimeException {
    public NoMatchException(String message){
        super(message);
    }
}
