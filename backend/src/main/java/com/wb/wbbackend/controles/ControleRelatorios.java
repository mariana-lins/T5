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

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/relatorios")
public class ControleRelatorios {
    @Autowired
    private RepositorioConsumo repositorioConsumo;
    @Autowired
    private RepositorioCliente repositorioCliente;
    @Autowired
    private RepositorioProduto repositorioProduto;
    @Autowired
    private RepositorioServico repositorioServico;

    // 1. Top 10 clientes que mais consumiram em quantidade
    @GetMapping("/top10-clientes-quantidade")
    public List<Map<String, Object>> top10ClientesQuantidade() {
        List<Consumo> consumos = repositorioConsumo.findAll();
        Map<Long, Long> contagem = consumos.stream()
            .collect(Collectors.groupingBy(c -> c.getCliente().getId(), Collectors.counting()));
        return contagem.entrySet().stream()
            .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
            .limit(10)
            .map(e -> {
                Cliente cli = repositorioCliente.findById(e.getKey()).orElse(null);
                Map<String, Object> m = new HashMap<>();
                m.put("clienteId", e.getKey());
                m.put("nome", cli != null ? cli.getNome() : "");
                m.put("quantidade", e.getValue());
                return m;
            }).collect(Collectors.toList());
    }

    // 2. Clientes por gênero
    @GetMapping("/clientes-por-genero")
    public Map<String, Long> clientesPorGenero() {
        List<Cliente> clientes = repositorioCliente.findAll();
        return clientes.stream()
            .filter(c -> c.getGenero() != null && !c.getGenero().isEmpty())
            .collect(Collectors.groupingBy(Cliente::getGenero, Collectors.counting()));
    }

    // 3. Produtos mais consumidos
    @GetMapping("/produtos-mais-consumidos")
    public List<Map<String, Object>> produtosMaisConsumidos() {
        List<Consumo> consumos = repositorioConsumo.findAll();
        Map<Long, Long> contagem = consumos.stream()
            .filter(c -> c.getProduto() != null)
            .collect(Collectors.groupingBy(c -> c.getProduto().getId(), Collectors.counting()));
        return contagem.entrySet().stream()
            .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
            .map(e -> {
                Produto p = repositorioProduto.findById(e.getKey()).orElse(null);
                Map<String, Object> m = new HashMap<>();
                m.put("produtoId", e.getKey());
                m.put("nome", p != null ? p.getNome() : "");
                m.put("quantidade", e.getValue());
                return m;
            }).collect(Collectors.toList());
    }

    // 3b. Serviços mais consumidos
    @GetMapping("/servicos-mais-consumidos")
    public List<Map<String, Object>> servicosMaisConsumidos() {
        List<Consumo> consumos = repositorioConsumo.findAll();
        Map<Long, Long> contagem = consumos.stream()
            .filter(c -> c.getServico() != null)
            .collect(Collectors.groupingBy(c -> c.getServico().getId(), Collectors.counting()));
        return contagem.entrySet().stream()
            .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
            .map(e -> {
                Servico s = repositorioServico.findById(e.getKey()).orElse(null);
                Map<String, Object> m = new HashMap<>();
                m.put("servicoId", e.getKey());
                m.put("nome", s != null ? s.getNome() : "");
                m.put("quantidade", e.getValue());
                return m;
            }).collect(Collectors.toList());
    }

    // 4. Produtos consumidos por gênero
    @GetMapping("/produtos-por-genero")
    public Map<String, Long> produtosPorGenero() {
        List<Consumo> consumos = repositorioConsumo.findAll();
        Map<String, Long> resultado = new HashMap<>();
        for (Consumo c : consumos) {
            if (c.getProduto() != null && c.getCliente() != null) {
                String genero = c.getCliente().getGenero();
                resultado.put(genero, resultado.getOrDefault(genero, 0L) + 1);
            }
        }
        return resultado;
    }

    // 5. Top 10 clientes que menos consumiram
    @GetMapping("/top10-clientes-menos-consumo")
    public List<Map<String, Object>> top10ClientesMenosConsumo() {
        List<Consumo> consumos = repositorioConsumo.findAll();
        Map<Long, Long> contagem = consumos.stream()
            .collect(Collectors.groupingBy(c -> c.getCliente().getId(), Collectors.counting()));
        return contagem.entrySet().stream()
            .sorted(Map.Entry.comparingByValue())
            .limit(10)
            .map(e -> {
                Cliente cli = repositorioCliente.findById(e.getKey()).orElse(null);
                Map<String, Object> m = new HashMap<>();
                m.put("clienteId", e.getKey());
                m.put("nome", cli != null ? cli.getNome() : "");
                m.put("quantidade", e.getValue());
                return m;
            }).collect(Collectors.toList());
    }

    // 6. Top 5 clientes por valor total consumido
    @GetMapping("/top5-clientes-valor")
    public List<Map<String, Object>> top5ClientesValor() {
        List<Consumo> consumos = repositorioConsumo.findAll();
        Map<Long, Double> valores = new HashMap<>();
        for (Consumo c : consumos) {
            if (c.getCliente() != null) {
                double valor = 0.0;
                if (c.getProduto() != null) valor += c.getProduto().getPreco();
                if (c.getServico() != null) valor += c.getServico().getPreco();
                valores.put(c.getCliente().getId(), valores.getOrDefault(c.getCliente().getId(), 0.0) + valor);
            }
        }
        return valores.entrySet().stream()
            .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
            .limit(5)
            .map(e -> {
                Cliente cli = repositorioCliente.findById(e.getKey()).orElse(null);
                Map<String, Object> m = new HashMap<>();
                m.put("clienteId", e.getKey());
                m.put("nome", cli != null ? cli.getNome() : "");
                m.put("valorTotal", e.getValue());
                return m;
            }).collect(Collectors.toList());
    }
}
