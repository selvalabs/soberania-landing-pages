# Rotina da Empreendedora Selvagem — pacote final de deploy

Estrutura:

- `index.html` — página de produção, sem Inline Editor.
- `assets/css/style.css` — estilos da landing.
- `assets/js/main.js` — JavaScript de produção da landing.
- `assets/images/` — imagens e mockups locais, incluindo `mariana-tevah.webp`.
- `SHA256SUMS.txt` — checksums dos arquivos do pacote.

## Deploy

Publique **a pasta inteira mantendo esta estrutura relativa** e configure o servidor estático para servir `index.html` na raiz.

Os assets visuais estão no pacote. O tracker de analytics é carregado de `https://api-stg.soberania.cloud/tracker.js`.

## Analytics

A landing está vinculada ao projeto `qa-marianatevah-20260805` do API Tracker e requer publicação em `https://desafioselvagem.marianatevah.com.br`, origem autorizada no tracker.

Eventos automáticos: início de sessão, visualização de página e marcos de scroll. Eventos adicionais: visualização da oferta e clique em cada CTA identificado.

## Meta Pixel

A landing usa o Meta Pixel `1551669599831665` da conta Astrologia Psique Profunda. O código em `assets/js/meta-pixel.js` envia:

- `PageView` ao carregar a página;
- `ViewContent` quando a seção de oferta entra na tela;
- `OfferCtaClick` para cada CTA identificado;
- `ScrollDepth` ao atingir 90% da página.

A landing não envia `InitiateCheckout` nem `Purchase`: seus CTAs direcionam ao checkout da Kiwify. A conversão confirmada deve ser medida pela integração nativa do mesmo Pixel na Kiwify, não pelo clique na landing.

## Contrato de rastreamento do checkout

- O snippet do Pixel no `head` inicializa o Pixel `1551669599831665` e envia um único `PageView`.
- `assets/js/meta-pixel.js` envia `ViewContent` quando `#oferta` entra na tela, `OfferCtaClick` com o ID do CTA e `ScrollDepth` aos 90% de profundidade. Ele não reinicializa o Pixel.
- O botão principal `hero_offer` apenas leva à seção de oferta e é registrado pelo API Tracker como `click_offer`.
- Os CTAs que abrem a Kiwify são registrados pelo API Tracker como `click_checkout`, com seus IDs individuais: `header_offer`, `investment_start`, `final_offer` e `sticky_offer`.
- A landing não envia `InitiateCheckout` nem `Purchase`. Configure o mesmo Pixel e a CAPI na Kiwify para que ela envie esses eventos ao abrir o checkout e confirmar o pagamento, sem duplicação.
- `assets/js/checkout-links.js` preserva somente parâmetros de campanha permitidos (`src`, `sck`, UTMs e `s1` a `s3`). Nunca acrescente ID de visitante, IP, e-mail ou outro dado pessoal à URL do checkout.
