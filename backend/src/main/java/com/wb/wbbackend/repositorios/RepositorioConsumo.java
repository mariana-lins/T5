package com.wb.wbbackend.repositorios;

import com.wb.wbbackend.entidades.Consumo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioConsumo extends JpaRepository<Consumo, Long> {
    // Métodos customizados podem ser adicionados aqui
}
