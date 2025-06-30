package com.wb.wbbackend.controles;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.wb.wbbackend.entidades.Produto;
import com.wb.wbbackend.repositorios.RepositorioProduto;

@CrossOrigin
@RestController
public class ControleProduto {
    @Autowired
    private RepositorioProduto repositorio;

    @GetMapping("/produto/{id}")
    public ResponseEntity<Produto> obterProduto(@PathVariable Long id) {
        Produto produto = repositorio.findById(id).orElse(null);
        if (produto != null) {
            return new ResponseEntity<>(produto, HttpStatus.FOUND);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/produtos")
    public ResponseEntity<List<Produto>> obterProdutos() {
        List<Produto> produtos = repositorio.findAll();
        return new ResponseEntity<>(produtos, HttpStatus.OK);
    }

    @PostMapping("/produto/cadastrar")
    public ResponseEntity<Produto> cadastrarProduto(@RequestBody Produto novo) {
        if (novo != null) {
            Produto produtoSalvo = repositorio.save(novo);
            return new ResponseEntity<>(produtoSalvo, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/produto/atualizar")
    public ResponseEntity<?> atualizarProduto(@RequestBody Produto atualizacao) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        Produto produto = repositorio.findById(atualizacao.getId()).orElse(null);
        if (produto != null) {
            produto.setNome(atualizacao.getNome());
            produto.setDescricao(atualizacao.getDescricao());
            produto.setPreco(atualizacao.getPreco());
            produto.setCategoria(atualizacao.getCategoria());
            repositorio.save(produto);
            status = HttpStatus.OK;
        }
        return new ResponseEntity<>(status);
    }

    @DeleteMapping("/produto/excluir")
    public ResponseEntity<?> excluirProduto(@RequestBody Produto exclusao) {
        try {
            Produto produto = repositorio.findById(exclusao.getId()).orElse(null);
            if (produto == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                repositorio.delete(produto);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
