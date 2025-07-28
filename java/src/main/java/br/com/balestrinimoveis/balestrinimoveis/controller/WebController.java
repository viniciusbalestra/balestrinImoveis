package br.com.balestrinimoveis.balestrinimoveis.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String homePage() {

        return "java/src/main/resources/static/index";
    }

    @GetMapping("/investimentos")
    public String investimentosPage(){

        return "java/src/main/resources/static/pages/investimento";
    }

    @GetMapping("/contato")
    public String contatoPage() {

        return "java/src/main/resources/static/pages/contatos";
    }

    @GetMapping("/sobre")
    public String sobrePage() {

        return "java/src/main/resources/static/pages/sobre";
    }

    @GetMapping("/cadastro")
    public String cadastroPage() {

        return "java/src/main/resources/static/pages/cadastro";
    }

}
