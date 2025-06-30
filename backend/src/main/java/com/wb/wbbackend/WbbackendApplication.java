package com.wb.wbbackend;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Component;

import com.wb.wbbackend.entidades.Cliente;
import com.wb.wbbackend.entidades.Endereco;
import com.wb.wbbackend.entidades.Telefone;
import com.wb.wbbackend.repositorios.RepositorioCliente;

@SpringBootApplication
public class WbbackendApplication {

	public static void main(String[] args) {
		// Propriedades
		Map<String,Object> propriedades = new HashMap<>();
		propriedades.put("server.port", "8080");
		propriedades.put("spring.jpa.show-sql", "true");
		
		// Inicialização de propriedades em código
		SpringApplication app = new SpringApplication(WbbackendApplication.class);
		app.setDefaultProperties(propriedades);
        app.run(args);
        
        // Forma padrão para iniciar a aplicação
		//SpringApplication.run(WbbackendApplication.class, args);
	}

	@Component
	public static class Runner implements ApplicationRunner {
		@Autowired
		public RepositorioCliente repositorio;
		@Autowired
		public com.wb.wbbackend.repositorios.RepositorioProduto repositorioProduto;
		@Autowired
		public com.wb.wbbackend.repositorios.RepositorioServico repositorioServico;
		@Autowired
		public com.wb.wbbackend.repositorios.RepositorioConsumo repositorioConsumo;

		@Override
		public void run(ApplicationArguments args) throws Exception {
			// Exemplo de clientes
			Cliente cliente = new Cliente();
			cliente.setNome("Pedro Alcântara de Bragança e Bourbon");
			cliente.setSobreNome("Dom Pedro");
			Endereco endereco = new Endereco();
			endereco.setCidade("Rio de Janeiro");
			endereco.setEstado("Rio de Janeiro");
			endereco.setBairro("Centro");
			endereco.setRua("Praça Quinze de Novembro");
			endereco.setNumero("48");
			endereco.setCodigoPostal("20010-010");
			endereco.setInformacoesAdicionais("O Paço Imperial é um edifício histórico localizado na atual Praça XV de Novembro, no centro da cidade do Rio de Janeiro, Brasil.");
			cliente.setEndereco(endereco);
			Telefone telefone = new Telefone();
			telefone.setDdd("21");
			telefone.setNumero("22152622");
			cliente.getTelefones().add(telefone);
			repositorio.save(cliente);

			Cliente cliente2 = new Cliente();
			cliente2.setNome("Teresa Cristina de Bourbon-Duas Sicílias");
			cliente2.setSobreNome("Mãe dos Brasileiros");
			endereco = new Endereco();
			endereco.setCidade("Rio de Janeiro");
			endereco.setEstado("Rio de Janeiro");
			endereco.setBairro("Centro");
			endereco.setRua("Praça Quinze de Novembro");
			endereco.setNumero("48");
			endereco.setCodigoPostal("20010-010");
			endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
					+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");

			cliente2.setEndereco(endereco);
			telefone = new Telefone();
			telefone.setDdd("21");
			telefone.setNumero("22152622");
			cliente2.getTelefones().add(telefone);
			repositorio.save(cliente2);

			Cliente cliente3 = new Cliente();
			cliente3.setNome("Isabel Cristina Leopoldina Augusta Gonzaga de Bourbon e Bragança");
			cliente3.setSobreNome("Pricesa Isabel");

			endereco = new Endereco();
			endereco.setCidade("Rio de Janeiro");
			endereco.setEstado("Rio de Janeiro");
			endereco.setBairro("Centro");
			endereco.setRua("Praça Quinze de Novembro");
			endereco.setNumero("48");
			endereco.setCodigoPostal("20010-010");
			endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
					+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");

			cliente3.setEndereco(endereco);
			telefone = new Telefone();
			telefone.setDdd("21");
			telefone.setNumero("22152622");
			cliente3.getTelefones().add(telefone);
			repositorio.save(cliente3);

			Cliente cliente4 = new Cliente();
			cliente4.setNome("Leopoldina Teresa Gonzaga de Bragança e Bourbon-Duas Sicílias");
			cliente4.setSobreNome("Pricesa Leopoldina");

			endereco = new Endereco();
			endereco.setCidade("Rio de Janeiro");
			endereco.setEstado("Rio de Janeiro");
			endereco.setBairro("Centro");
			endereco.setRua("Praça Quinze de Novembro");
			endereco.setNumero("48");
			endereco.setCodigoPostal("20010-010");
			endereco.setInformacoesAdicionais("O Paço Imperial é " + "um edifício histórico localizado na "
					+ "atual Praça XV de Novembro, no centro " + "da cidade do Rio de Janeiro, Brasil.");

			cliente4.setEndereco(endereco);
			telefone = new Telefone();
			telefone.setDdd("21");
			telefone.setNumero("22152622");
			cliente4.getTelefones().add(telefone);
			repositorio.save(cliente4);

			// População de 30 clientes
            String[] nomes = {"Ana", "Bruno", "Carla", "Daniel", "Eduarda", "Felipe", "Gabriela", "Henrique", "Isabela", "João", "Karen", "Lucas", "Marina", "Nicolas", "Olívia", "Paulo", "Quésia", "Rafael", "Sofia", "Tiago", "Ursula", "Vinícius", "Wesley", "Xuxa", "Yasmin", "Zeca", "Beatriz", "Caio", "Diana", "Enzo"};
            String[] generos = {"Feminino", "Masculino", "Outro"};
            for (int i = 0; i < 30; i++) {
                Cliente c = new Cliente();
                c.setNome(nomes[i]);
                c.setSobreNome("Silva");
                c.setGenero(generos[i % generos.length]);
                Endereco e = new Endereco();
                e.setCidade("Cidade " + ((i % 5) + 1));
                e.setEstado("Estado " + ((i % 3) + 1));
                e.setBairro("Bairro " + ((i % 4) + 1));
                e.setRua("Rua " + (i + 1));
                e.setNumero(String.valueOf(100 + i));
                e.setCodigoPostal("00000-" + String.format("%03d", i));
                e.setInformacoesAdicionais("Cliente gerado automaticamente");
                c.setEndereco(e);
                Telefone t = new Telefone();
                t.setDdd("1" + (i % 9));
                t.setNumero("90000-00" + String.format("%02d", i));
                c.getTelefones().add(t);
                repositorio.save(c);
            }
            // População de 20 produtos
            for (int i = 1; i <= 20; i++) {
                com.wb.wbbackend.entidades.Produto produto = new com.wb.wbbackend.entidades.Produto();
                produto.setNome("Produto " + i);
                produto.setDescricao("Descrição do produto " + i);
                produto.setPreco(10.0 + (i * 2));
                produto.setCategoria("Categoria " + ((i % 4) + 1));
                repositorioProduto.save(produto);
            }
            // População de 20 serviços
            for (int i = 1; i <= 20; i++) {
                com.wb.wbbackend.entidades.Servico servico = new com.wb.wbbackend.entidades.Servico();
                servico.setNome("Serviço " + i);
                servico.setDescricao("Descrição do serviço " + i);
                servico.setPreco(15.0 + (i * 2));
                servico.setCategoria("Categoria " + ((i % 3) + 1));
                repositorioServico.save(servico);
            }
            // Consumos variados
            java.util.List<com.wb.wbbackend.entidades.Cliente> clientes = repositorio.findAll();
            java.util.List<com.wb.wbbackend.entidades.Produto> produtos = repositorioProduto.findAll();
            java.util.List<com.wb.wbbackend.entidades.Servico> servicos = repositorioServico.findAll();
            java.util.Random rand = new java.util.Random();
            for (Cliente cli : clientes) {
                // Cada cliente consome de 2 a 6 produtos diferentes
                for (int j = 0; j < 2 + rand.nextInt(5); j++) {
                    com.wb.wbbackend.entidades.Consumo consumoProduto = new com.wb.wbbackend.entidades.Consumo();
                    consumoProduto.setCliente(cli);
                    com.wb.wbbackend.entidades.Produto prod = produtos.get(rand.nextInt(produtos.size()));
                    consumoProduto.setProduto(prod);
                    consumoProduto.setQuantidade(1 + rand.nextInt(4));
                    consumoProduto.setDataHora(java.time.LocalDateTime.now().minusDays(rand.nextInt(30)));
                    repositorioConsumo.save(consumoProduto);
                }
                // Cada cliente consome de 1 a 4 serviços diferentes
                for (int j = 0; j < 1 + rand.nextInt(4); j++) {
                    com.wb.wbbackend.entidades.Consumo consumoServico = new com.wb.wbbackend.entidades.Consumo();
                    consumoServico.setCliente(cli);
                    com.wb.wbbackend.entidades.Servico serv = servicos.get(rand.nextInt(servicos.size()));
                    consumoServico.setServico(serv);
                    consumoServico.setQuantidade(1 + rand.nextInt(3));
                    consumoServico.setDataHora(java.time.LocalDateTime.now().minusDays(rand.nextInt(30)));
                    repositorioConsumo.save(consumoServico);
                }
            }
		}
	}
}