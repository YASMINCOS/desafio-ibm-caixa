[Início: Usuário acessa sistema]
                |
                v
      +---------------------+
      | Escolher Fluxo      |
      | Ideia | Problema    |
      +---------------------+
         |                  |
         v                  v
 [Agente de Ideias]   [Agente de Problemas]
 Perguntas guiadas    Perguntas guiadas
         |                  |
         v                  v
   [Validação]         [Validação]
         |                  |
         v                  v
[Agente verifica       [Registro do Problema]
duplicatas + internet] Categoria + JSON
         |
         v
[Agente de Ideias Semelhantes]
(Consulta base de Problemas)
         |
         v
 [Registro da Ideia]
 Status=EM_TRIAGEM + JSON
         |
         v
 [Avaliação Inicial]
 Categoria + Urgência + Impacto
         |
         v
 [Match Inteligente]
 Conecta Ideias ↔ Problemas
 Exibe duplicatas / gaps
         |
         v
 [Dashboard Final]
 Status, Categorias, Ligações
