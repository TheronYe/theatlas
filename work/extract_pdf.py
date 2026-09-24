# -*- coding: utf-8 -*-
import sys, io, glob, os
from pypdf import PdfReader
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
os.makedirs('work/pdftext', exist_ok=True)
for f in glob.glob('*.pdf'):
    try:
        r = PdfReader(f)
        out = []
        for i, p in enumerate(r.pages[:15]):
            t = p.extract_text() or ''
            out.append(f'--- page {i+1} ---\n{t[:3000]}')
        txt = '\n'.join(out)
        with open('work/pdftext/' + f.replace('.pdf', '.txt'), 'w', encoding='utf-8') as fh:
            fh.write(txt)
        print(f, '| pages:', len(r.pages), '| chars:', len(txt))
    except Exception as e:
        print(f, 'ERROR', e)
