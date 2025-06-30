package com.wb.wbbackend.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wb.wbbackend.entidades.Produto;

@Repository
public interface RepositorioProduto extends JpaRepository<Produto, Long> {
}
