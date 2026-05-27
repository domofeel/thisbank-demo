from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


def remove_black_edge_background(src: Path, dst: Path, luma_threshold: float = 8, sat_threshold: float = 18) -> None:
    image = Image.open(src).convert("RGBA")
    data = np.array(image)
    rgb = data[:, :, :3].astype(np.int16)
    alpha = data[:, :, 3]

    luma = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    candidate = (luma < luma_threshold) & (saturation < sat_threshold) & (alpha > 0)

    height, width = candidate.shape
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        if candidate[0, x]:
            visited[0, x] = True
            queue.append((0, x))
        if candidate[height - 1, x]:
            visited[height - 1, x] = True
            queue.append((height - 1, x))

    for y in range(height):
        if candidate[y, 0]:
            visited[y, 0] = True
            queue.append((y, 0))
        if candidate[y, width - 1]:
            visited[y, width - 1] = True
            queue.append((y, width - 1))

    while queue:
        y, x = queue.popleft()
        for next_y, next_x in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if (
                0 <= next_y < height
                and 0 <= next_x < width
                and candidate[next_y, next_x]
                and not visited[next_y, next_x]
            ):
                visited[next_y, next_x] = True
                queue.append((next_y, next_x))

    edge_mask = Image.fromarray((visited * 255).astype("uint8"), "L")
    feathered = np.array(edge_mask.filter(ImageFilter.GaussianBlur(radius=0.55))).astype(np.int16)
    next_alpha = np.clip(255 - feathered, 0, 255).astype(np.uint8)
    next_alpha[visited] = 0
    data[:, :, 3] = np.minimum(alpha, next_alpha)

    Image.fromarray(data, "RGBA").save(dst)
    print(f"saved {dst}")
    print(f"size {image.size}")
    print(f"transparent_pixels {int((data[:, :, 3] == 0).sum())}")
    print(f"partial_alpha {int(((data[:, :, 3] > 0) & (data[:, :, 3] < 255)).sum())}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("src", type=Path)
    parser.add_argument("dst", type=Path)
    parser.add_argument("--luma", type=float, default=8)
    parser.add_argument("--sat", type=float, default=18)
    args = parser.parse_args()
    remove_black_edge_background(args.src, args.dst, args.luma, args.sat)


if __name__ == "__main__":
    main()
