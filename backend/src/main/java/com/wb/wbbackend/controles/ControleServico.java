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

import com.wb.wbbackend.entidades.Servico;
import com.wb.wbbackend.repositorios.RepositorioServico;

@CrossOrigin
@RestController
public class ControleServico {
    @Autowired
    private RepositorioServico repositorio;

    @GetMapping("/servico/{id}")
    public ResponseEntity<Servico> obterServico(@PathVariable Long id) {
        Servico servico = repositorio.findById(id).orElse(null);
        if (servico != null) {
            return new ResponseEntity<>(servico, HttpStatus.FOUND);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/servicos")
    public ResponseEntity<List<Servico>> obterServicos() {
        List<Servico> servicos = repositorio.findAll();
        return new ResponseEntity<>(servicos, HttpStatus.OK);
    }

    @PostMapping("/servico/cadastrar")
    public ResponseEntity<Servico> cadastrarServico(@RequestBody Servico novo) {
        if (novo != null) {
            Servico servicoSalvo = repositorio.save(novo);
            return new ResponseEntity<>(servicoSalvo, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @PutMapping("/servico/atualizar")
    public ResponseEntity<?> atualizarServico(@RequestBody Servico atualizacao) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        Servico servico = repositorio.findById(atualizacao.getId()).orElse(null);
        if (servico != null) {
            servico.setNome(atualizacao.getNome());
            servico.setDescricao(atualizacao.getDescricao());
            servico.setPreco(atualizacao.getPreco());
            servico.setCategoria(atualizacao.getCategoria());
            repositorio.save(servico);
            status = HttpStatus.OK;
        }
        return new ResponseEntity<>(status);
    }

    @DeleteMapping("/servico/excluir")
    public ResponseEntity<?> excluirServico(@RequestBody Servico exclusao) {
        try {
            Servico servico = repositorio.findById(exclusao.getId()).orElse(null);
            if (servico == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            } else {
                repositorio.delete(servico);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
