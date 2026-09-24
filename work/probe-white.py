# -*- coding: utf-8 -*-
# 分析截图左上角区域的白色矩形：找出近白色像素块的位置与边界
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from PIL import Image

def analyze(path, region_w=520, region_h=120):
    img = Image.open(path).convert('RGB')
    w, h = img.size
    print(f'== {path}  size={w}x{h} ==')
    # 逐行扫描左上区域，找近白像素 (r,g,b 全部 >= 245)
    px = img.load()
    cols_with_white = {}
    rows_with_white = []
    for y in range(0, min(region_h, h)):
        cnt = 0
        for x in range(0, min(region_w, w)):
            r, g, b = px[x, y]
            if r >= 245 and g >= 245 and b >= 245:
                cnt += 1
                cols_with_white.setdefault(x, 0)
                cols_with_white[x] += 1
        if cnt > 30:
            rows_with_white.append((y, cnt))
    if not rows_with_white:
        print('  左上区域无大块白色像素')
        return
    ys = [r[0] for r in rows_with_white]
    xs = sorted(cols_with_white)
    # 只统计与白色行重叠的列
    x_lo, x_hi = xs[0], xs[-1]
    print(f'  白色行范围: y={min(ys)}..{max(ys)}  行数={len(rows_with_white)}')
    print(f'  白色列范围: x={x_lo}..{x_hi}')
    # 输出前几个白色行的详细信息
    for y, c in rows_with_white[:5]:
        # 找该行白色像素的连续段
        runs = []
        start = None
        for x in range(min(region_w, w)):
            r, g, b = px[x, y]
            if r >= 245 and g >= 245 and b >= 245:
                if start is None: start = x
            else:
                if start is not None:
                    runs.append((start, x - 1)); start = None
        if start is not None: runs.append((start, min(region_w, w) - 1))
        big = [r for r in runs if r[1] - r[0] >= 8]
        print(f'  y={y}: 白像素={c} 连续段={big[:4]}')

analyze(sys.argv[1] if len(sys.argv) > 1 else 'work/probe-atlas.png')
if len(sys.argv) > 2:
    analyze(sys.argv[2])