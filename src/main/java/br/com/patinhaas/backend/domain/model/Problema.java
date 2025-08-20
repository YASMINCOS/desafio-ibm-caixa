package br.com.patinhaas.backend.domain.model;

import br.com.patinhaas.backend.domain.model.enums.CategoriaEnum;
import br.com.patinhaas.backend.domain.model.enums.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "problemas")
public class Problema {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @NotBlank
    private String nome;

    @NotBlank
    private String matricula;

    @NotBlank
    private String unidade;

    @NotBlank
    private String email;

    @NotBlank
    @Column(name = "problema_descricao", length = 2000)
    private String problemaDescricao;

    @NotBlank
    @Column(length = 1000)
    private String processo;

    @Enumerated(EnumType.STRING)
    @NotNull
    private CategoriaEnum categoria;

    @Column(name = "impacto_financeiro", precision = 10, scale = 2)
    private BigDecimal impactoFinanceiro;

    @NotBlank
    @Column(name = "tipo_solucao_esperada", length = 1000)
    private String tipoSolucaoEsperada;

    @Enumerated(EnumType.STRING)
    @NotNull
    private Status status = Status.ABERTO;

    @Column(name = "matching_score")
    private Double matchingScore;

    @CreationTimestamp
    @Column(name = "data_criacao")
    private OffsetDateTime dataCriacao;

    @Column(name = "impacto_pessoas")
    private Integer impactoPessoas;
}
