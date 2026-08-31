#!/usr/bin/env python3
"""Bakes the home-screen icons from one 16x16 pixel drawing.

Same idea as js/pixels.js: the art is hand-placed glyph by glyph against a
named palette, and the generated PNGs are committed so there is no build step.
Re-run this only if you change ART or PALETTE:

    python3 icons/make-icons.py

Needs nothing but the standard library.
"""

import struct
import zlib
from pathlib import Path

# Palette letters match js/pixels.js so the icon and the game agree on colour.
PALETTE = {
    'T': '#2c7a74',   # deep water
    't': '#5ec2b1',   # shallow water
    'G': '#3d8636',   # leaf, shaded
    'g': '#79c257',   # leaf, lit
    'h': '#8d5c2b',   # trunk
    'H': '#5a3817',   # trunk, shaded
    'c': '#f4e0b8',   # sand
    'l': '#e0c188',   # sand, shaded
}

# A palm on a sand island, 16 rows of exactly 16 characters.
ART = [
    "TTTTTTTTTTTTTTTT",
    "TTTTTTggggTTTTTT",
    "TTTTGgggggggGTTT",
    "TTGggggghggggGTT",
    "TTTTGggghgggGTTT",
    "TTTTTTGghgGTTTTT",
    "TTTTTTTThTTTTTTT",
    "TTTTTTTThTTTTTTT",
    "TTTTTTTThTTTTTTT",
    "TTTTTtttHtttTTTT",
    "TTTcccccHcccTTTT",
    "TTccccccccccccTT",
    "TcccclcccccclccT",
    "TTcccccccccccTTT",
    "TTTTtttttttTTTTT",
    "TTTTTTTTTTTTTTTT",
]


def rgb(hex_colour):
    h = hex_colour.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def png_bytes(rows):
    """rows is a list of lists of (r, g, b). Returns a complete 8-bit RGB PNG."""
    h, w = len(rows), len(rows[0])
    raw = b''.join(b'\x00' + bytes(v for px in row for v in px) for row in rows)

    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data
                + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))

    return (b'\x89PNG\r\n\x1a\n'
            + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw, 9))
            + chunk(b'IEND', b''))


def main():
    assert len(ART) == 16, f'ART must be 16 rows, got {len(ART)}'
    for i, row in enumerate(ART):
        assert len(row) == 16, f'ART row {i} must be 16 chars, got {len(row)}'
        for ch in row:
            assert ch in PALETTE, f'ART row {i} uses "{ch}", which is not in PALETTE'

    small = [[rgb(PALETTE[ch]) for ch in row] for row in ART]
    here = Path(__file__).parent

    # Nearest-neighbour only, at integer multiples, so the pixels stay crisp.
    for size in (192, 512):
        n = size // 16
        big = [[px for px in row for _ in range(n)] for row in small for _ in range(n)]
        out = here / f'icon-{size}.png'
        out.write_bytes(png_bytes(big))
        print(f'{out.name}  {size}x{size}  {out.stat().st_size} bytes')


if __name__ == '__main__':
    main()
