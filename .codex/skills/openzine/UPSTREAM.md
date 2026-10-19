# Vendored OpenZine skill

Source: https://github.com/JosssphZhou/openzine
Imported on 2026-10-19 from the upstream main branch.

This is the OpenZine skill and its builder/runtime, vendored in this repository so the portfolio build can use the same workflow without a local/global skill installation. The only functional change to upstream `scripts/make-book.mjs` is support for reading the grain texture from `runtime/grain.webp.base64`; the binary texture is stored as base64 because repository file editing is text-based. The builder otherwise retains the upstream implementation.

**Mixed rights:** OpenZine's own files have the file-specific terms in `OPENZINE-LICENSE.txt`. The bundled Paper page-turn renderer/shader/grain are copyright Paper and are not covered by OpenZine's MIT licence. The Paper Mono font is SIL OFL 1.1; Three.js is MIT. Generated books should retain the Paper attribution/footer added by OpenZine. See the upstream licence and bundled notices before redistributing modified runtime assets.
