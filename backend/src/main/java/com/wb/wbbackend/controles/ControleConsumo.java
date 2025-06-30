package com.wb.wbbackend.controles;

import com.wb.wbbackend.entidades.Consumo;
import com.wb.wbbackend.entidades.Cliente;
import com.wb.wbbackend.entidades.Produto;
import com.wb.wbbackend.entidades.Servico;
import com.wb.wbbackend.repositorios.RepositorioConsumo;
import com.wb.wbbackend.repositorios.RepositorioCliente;
import com.wb.wbbackend.repositorios.RepositorioProduto;
import com.wb.wbbackend.repositorios.RepositorioServico;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/consumo")
public class ControleConsumo {
    @Autowired
    private RepositorioConsumo repositorioConsumo;
    @Autowired
    private RepositorioCliente repositorioCliente;
    @Autowired
    private RepositorioProduto repositorioProduto;
    @Autowired
    private RepositorioServico repositorioServico;

    @GetMapping("/consumos")
    public List<Consumo> listarConsumos() {
        return repositorioConsumo.findAll();
    }

    @PostMapping("/cadastrar")
    public Consumo cadastrarConsumo(@RequestBody ConsumoDTO dto) {
        Cliente cliente = repositorioCliente.findById(dto.clienteId).orElseThrow();
        Produto produto = dto.produtoId != null ? repositorioProduto.findById(dto.produtoId).orElse(null) : null;
        Servico servico = dto.servicoId != null ? repositorioServico.findById(dto.servicoId).orElse(null) : null;
        Consumo consumo = new Consumo(cliente, produto, servico, LocalDateTime.now(), dto.quantidade);
        return repositorioConsumo.save(consumo);
    }

    @PutMapping("/atualizar")
    public Consumo atualizarConsumo(@RequestBody ConsumoDTO dto) {
        Consumo consumo = repositorioConsumo.findById(dto.id).orElseThrow();
        if (dto.clienteId != null) {
            Cliente cliente = repositorioCliente.findById(dto.clienteId).orElseThrow();
            consumo.setCliente(cliente);
        }
        if (dto.produtoId != null) {
            Produto produto = repositorioProduto.findById(dto.produtoId).orElse(null);
            consumo.setProduto(produto);
        }
        if (dto.servicoId != null) {
            Servico servico = repositorioServico.findById(dto.servicoId).orElse(null);
            consumo.setServico(servico);
        }
        if (dto.quantidade != null) {
            consumo.setQuantidade(dto.quantidade);
        }
        return repositorioConsumo.save(consumo);
    }

    @DeleteMapping("/excluir")
    public void excluirConsumo(@RequestParam Long id) {
        repositorioConsumo.deleteById(id);
    }

    // DTO para facilitar o recebimento dos dados
    public static class ConsumoDTO {
        public Long id;
        public Long clienteId;
        public Long produtoId;
        public Long servicoId;
        public Integer quantidade;
    }
}
