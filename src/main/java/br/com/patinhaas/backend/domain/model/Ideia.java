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

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "ideias")
public class Ideia {

    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @Column(name = "nome_proponente")
    private String nomeProponente;

    @Column(name = "matricula_proponente")
    private String matriculaProponente;

    @Column(name = "unidade_proponente")
    private String unidadeProponente;

    @Column(name = "nome_experimento")
    private String nomeExperimento;

    @Column(name = "equipe_envolvida", length = 1000)
    private String equipeEnvolvida;

    @Column(name = "desafio_problema", length = 2000)
    private String desafioProblema;

    @Column(name = "solucao_descricao", length = 2000)
    private String solucaoDescricao;

    @Column(name = "metodologia_execucao", length = 2000)
    private String metodologiaExecucao;

    @Column(name = "hipotese_principal", length = 1000)
    private String hipotesePrincipal;

    @Column(name = "horizonte_inovacao")
    private String horizonteInovacao; // H1/H2/H3

    @Column(name = "baseline_atual", length = 1000)
    private String baselineAtual;

    @Column(name = "resultados_esperados", length = 1000)
    private String resultadosEsperados;

    @Column(name = "kpis_smart", length = 1000)
    private String kpisSmart;

    @Enumerated(EnumType.STRING)
    private CategoriaEnum categoria;

    @Enumerated(EnumType.STRING)
    private Status status = Status.ABERTO;

    @Column(name = "avaliacao_ia", length = 2000)
    private String avaliacaoIA;

    @Column(name = "avaliacao_humana", length = 2000)
    private String avaliacaoHumana;

    @CreationTimestamp
    @Column(name = "data_criacao")
    private OffsetDateTime dataCriacao;
}
