#!/usr/bin/env python3
"""
extract_resume.py - pull plain text out of a resume, with zero dependencies.

Why this exists: this toolchain had no pdftotext, no pypdf, no LibreOffice, and
pip was network-blocked. So the PDF and DOCX paths are implemented here against
the Python standard library only.

Usage:
    python3 scripts/extract_resume.py path/to/resume.pdf
    python3 scripts/extract_resume.py resume.docx --out resume.txt

Supported: .pdf  .docx  .txt  .md
PDF caveat: text held in content streams is recovered. A PDF that embeds text as
glyph subsets with a custom CID encoding (rare for resumes exported from Word,
Google Docs, or a browser) may come back garbled - send a screenshot then.
"""
import argparse
import html
import re
import sys
import zipfile
import zlib


# --------------------------------------------------------------------- PDF ---

def _pdf_streams(data: bytes):
    """Yield decompressed content-stream bytes."""
    for m in re.finditer(rb"stream\r?\n", data):
        start = m.end()
        end = data.find(b"endstream", start)
        if end == -1:
            continue
        raw = data[start:end].rstrip(b"\r\n")
        try:
            yield zlib.decompress(raw)
        except zlib.error:
            yield raw          # not Flate-compressed; pass it through


_OCTAL = re.compile(rb"\\([0-7]{1,3})")
_ESCAPES = {b"n": b"\n", b"r": b"\r", b"t": b"\t", b"b": b"\b",
            b"f": b"\f", b"(": b"(", b")": b")", b"\\": b"\\"}


def _unescape_literal(s: bytes) -> bytes:
    out = bytearray()
    i = 0
    while i < len(s):
        c = s[i:i + 1]
        if c == b"\\" and i + 1 < len(s):
            nxt = s[i + 1:i + 2]
            if nxt in _ESCAPES:
                out += _ESCAPES[nxt]
                i += 2
                continue
            m = _OCTAL.match(s, i)
            if m:
                out.append(int(m.group(1), 8) & 0xFF)
                i = m.end()
                continue
            if nxt in (b"\n", b"\r"):      # line continuation
                i += 2
                continue
            out += nxt
            i += 2
            continue
        out.append(s[i])
        i += 1
    return bytes(out)


def _decode_pdf_text(raw: bytes) -> str:
    """PDF strings are byte strings. Prefer UTF-16 when it looks like it."""
    if raw.startswith(b"\xfe\xff"):
        try:
            return raw[2:].decode("utf-16-be", "replace")
        except Exception:
            pass
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252", "replace")


def pdf_to_text(data: bytes) -> str:
    chunks = [s for s in _pdf_streams(data)
              if b"BT" in s or b"Tj" in s or b"TJ" in s]
    content = b"\n".join(chunks)

    # Walk the text operators in order, emitting newlines on positioning ops.
    token = re.compile(
        rb"\((?:\\.|[^\\()])*\)"          # literal string
        rb"|<[0-9A-Fa-f\s]*>"             # hex string
        rb"|T\*|Td|TD|TL|TJ|Tj|'|\"",     # operators
        re.S,
    )

    out = []
    for m in token.finditer(content):
        t = m.group(0)
        if t.startswith(b"("):
            out.append(_decode_pdf_text(_unescape_literal(t[1:-1])))
        elif t.startswith(b"<"):
            hexs = re.sub(rb"\s", b"", t[1:-1])
            if len(hexs) % 2:
                hexs += b"0"
            try:
                out.append(_decode_pdf_text(bytes.fromhex(hexs.decode("ascii"))))
            except ValueError:
                pass
        elif t in (b"Td", b"TD", b"T*", b"'"):
            out.append("\n")

    text = "".join(out)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()

# -------------------------------------------------------------------- DOCX ---

def docx_to_text(data: bytes) -> str:
    import io

    with zipfile.ZipFile(io.BytesIO(data)) as z:
        if "word/document.xml" not in z.namelist():
            raise ValueError("not a .docx (word/document.xml missing)")
        xml = z.read("word/document.xml").decode("utf-8", "replace")

    xml = re.sub(r"<w:br[^>]*/>", "\n", xml)      # explicit line breaks
    xml = re.sub(r"</w:p>", "\n", xml)            # paragraph boundaries
    xml = re.sub(r"<w:tab[^>]*/>", "\t", xml)
    text = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", xml, re.S))
    text = html.unescape(text)
    text = re.sub(r"[ \t]+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


# -------------------------------------------------------------------- main ---

def extract(path: str) -> str:
    with open(path, "rb") as fh:
        data = fh.read()

    lower = path.lower()
    if data[:4] == b"%PDF" or lower.endswith(".pdf"):
        return pdf_to_text(data)
    if data[:2] == b"PK" or lower.endswith(".docx"):
        return docx_to_text(data)
    if lower.endswith((".txt", ".md")):
        return data.decode("utf-8", "replace")
    raise ValueError("unsupported file type: " + path)


def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Extract text from a resume (no dependencies).")
    ap.add_argument("path")
    ap.add_argument("--out", help="write to this file instead of stdout")
    args = ap.parse_args(argv)

    try:
        text = extract(args.path)
    except Exception as err:
        print("error: " + str(err), file=sys.stderr)
        return 1

    if not text.strip():
        print("warning: no text recovered - the file may be a scanned image",
              file=sys.stderr)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(text + "\n")
        print("wrote " + args.out + " (" + str(len(text)) + " chars)")
    else:
        print(text)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
