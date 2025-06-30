package com.wb.wbbackend.entidades;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Consumo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Cliente cliente;

    @ManyToOne
    private Produto produto;

    @ManyToOne
    private Servico servico;

    private LocalDateTime dataHora;

    private Integer quantidade;

    public Consumo() {}

    public Consumo(Cliente cliente, Produto produto, Servico servico, LocalDateTime dataHora, Integer quantidade) {
        this.cliente = cliente;
        this.produto = produto;
        this.servico = servico;
        this.dataHora = dataHora;
        this.quantidade = quantidade;
    }

    // Getters e setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Cliente getCliente() { return cliente; }
    public void setCliente(Cliente cliente) { this.cliente = cliente; }
    public Produto getProduto() { return produto; }
    public void setProduto(Produto produto) { this.produto = produto; }
    public Servico getServico() { return servico; }
    public void setServico(Servico servico) { this.servico = servico; }
    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public Integer getQuantidade() { return quantidade; }
    public void setQuantidade(Integer quantidade) { this.quantidade = quantidade; }
}
