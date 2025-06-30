package com.wb.wbbackend.repositorios;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.wb.wbbackend.entidades.Servico;

@Repository
public interface RepositorioServico extends JpaRepository<Servico, Long> {
}
