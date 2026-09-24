# -*- coding: utf-8 -*-
import sys, io
from pypdf import PdfReader
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
r = PdfReader('TheAtlas_SB_Phase1_final (Sep14).pdf')
out = []
for i in range(14, min(45, len(r.pages))):
    t = r.pages[i].extract_text() or ''
    out.append(f'--- page {i+1} ---\n{t[:2500]}')
open('work/pdftext/SB_p15-45.txt', 'w', encoding='utf-8').write('\n'.join(out))
print('done')
