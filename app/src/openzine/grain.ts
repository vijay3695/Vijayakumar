import grainBase64 from "../../../.codex/skills/openzine/runtime/grain.webp.base64?raw";

/**
 * OpenZine's original paper-grain texture, kept as a runtime asset so the
 * existing React resume can use it without exporting or flattening pages.
 */
export const openZinePaperGrainDataUrl = `data:image/webp;base64,${grainBase64.trim()}`;
export const openZinePaperGrain = `url("${openZinePaperGrainDataUrl}")`;
