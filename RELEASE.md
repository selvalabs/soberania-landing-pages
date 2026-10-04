# Publicação

Issue: https://github.com/selvalabs/soberania-landing-pages/issues/1

A página inicial é a versão integrada aprovada na prévia local. As referências antigas permanecem no projeto original e não são publicadas.

Revisar e homologar o PR antes de mesclar. Configurar GitHub Pages para GitHub Actions. Após o merge, sincronizar main e criar uma tag anotada v1.0.0 no SHA aprovado. O workflow publica apenas tags anotadas que pertencem ao histórico de main.

Validar a página inicial, arquivos CSS/JS, iframe local, modal da Arca e destinos de WhatsApp após a publicação. A primeira release não possui versão anterior para rollback; releases futuras devem preservar a tag anterior e podem republicá-la por uma nova release aprovada.

A cópia demonstrativa não inicializa Meta Pixel nem o tracker da campanha original. A página comercial não coleta dados até que a configuração específica do projeto seja aprovada.

Não há backend, dependências npm, migrações, segredos ou VPS envolvidos nesta publicação.
