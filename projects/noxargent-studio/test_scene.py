"""NOXARGENT STUDIO — test scene: dark 2D room, window, flashlight, film grain, slow zoom.
1920x1080, 30 fps, 10 s. Output path is the first CLI arg (default: Desktop/test.mp4)."""
import subprocess, sys, time
from pathlib import Path
import cv2
import numpy as np

W, H, FPS, SECONDS = 1920, 1080, 30, 10
N = FPS * SECONDS
out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Desktop" / "test.mp4"
out.parent.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)

# ---------- static room, drawn a bit larger than the frame so we can zoom ----------
S = 1.12
BW, BH = int(W * S), int(H * S)
img = np.zeros((BH, BW, 3), np.float32)  # BGR, 0..1
yy = np.linspace(0, 1, BH, dtype=np.float32)[:, None]
img[:] = np.stack([0.05 + 0.03 * yy, 0.045 + 0.025 * yy, 0.04 + 0.02 * yy], -1) * np.ones((1, BW, 1), np.float32)
floor_y = int(BH * 0.72)
img[floor_y:] *= 0.55
for x in range(0, BW, 96):                      # wall planks
    cv2.line(img, (x, 0), (x, floor_y), (0.015, 0.015, 0.015), 3)
for k in range(8):                              # floor boards
    cv2.line(img, (0, floor_y + k * 38), (BW, floor_y + k * 38), (0.01, 0.01, 0.01), 2)
# window with cold night light
wx0, wy0, wx1, wy1 = int(BW * 0.12), int(BH * 0.14), int(BW * 0.34), int(BH * 0.56)
cv2.rectangle(img, (wx0, wy0), (wx1, wy1), (0.03, 0.02, 0.015), 22)
cv2.rectangle(img, (wx0, wy0), (wx1, wy1), (0.20, 0.11, 0.05), -1)
pts = np.array([[wx0, wy1], [wx0 + 90, wy0 + 200], [wx0 + 170, wy1 - 110], [wx0 + 280, wy0 + 150], [wx1, wy1 - 60], [wx1, wy1]], np.int32)
cv2.fillPoly(img, [pts], (0.12, 0.07, 0.03))
cv2.line(img, ((wx0 + wx1) // 2, wy0), ((wx0 + wx1) // 2, wy1), (0.03, 0.02, 0.015), 12)
cv2.line(img, (wx0, (wy0 + wy1) // 2), (wx1, (wy0 + wy1) // 2), (0.03, 0.02, 0.015), 12)
# moonlight spill from the window onto the room
spill = np.zeros((BH, BW), np.float32)
cv2.ellipse(spill, ((wx0 + wx1) // 2, int(BH * 0.62)), (int(BW * 0.22), int(BH * 0.30)), 0, 0, 360, 1.0, -1)
spill = cv2.GaussianBlur(spill, (0, 0), 90)
img += spill[..., None] * np.array([0.10, 0.065, 0.03], np.float32)
# table, chair silhouette, door
cv2.rectangle(img, (int(BW * 0.55), int(BH * 0.62)), (int(BW * 0.82), int(BH * 0.66)), (0.02, 0.03, 0.05), -1)
for x in (0.57, 0.80):
    cv2.rectangle(img, (int(BW * x), int(BH * 0.66)), (int(BW * x) + 20, int(BH * 0.86)), (0.015, 0.02, 0.03), -1)
cv2.rectangle(img, (int(BW * 0.40), int(BH * 0.18)), (int(BW * 0.50), floor_y), (0.025, 0.03, 0.045), -1)
cv2.circle(img, (int(BW * 0.485), int(BH * 0.46)), 9, (0.2, 0.3, 0.35), -1)
img = np.clip(img, 0, 1)

# vignette (output size)
gx = np.linspace(-1, 1, W, dtype=np.float32)[None, :]
gy = np.linspace(-1, 1, H, dtype=np.float32)[:, None]
vig = np.clip(1.15 - 0.55 * (gx ** 2 + gy ** 2), 0.25, 1.0)[..., None]

# flashlight geometry at half resolution
hw, hh = W // 2, H // 2
px = np.arange(hw, dtype=np.float32)[None, :] * 2
py = np.arange(hh, dtype=np.float32)[:, None] * 2
ox, oy = 1780.0, 1010.0

ff = subprocess.Popen(
    ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
     "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(out)],
    stdin=subprocess.PIPE)

t0 = time.perf_counter()
for k in range(N):
    t = k / FPS
    z = 1.0 + 0.12 * (k / (N - 1))                    # slow zoom-in
    cw, ch = BW / z, BH / z
    x0, y0 = (BW - cw) / 2, (BH - ch) / 2
    M = np.float32([[W / cw, 0, -x0 * W / cw], [0, H / ch, -y0 * H / ch]])
    frame = cv2.warpAffine(img, M, (W, H), flags=cv2.INTER_LINEAR)

    # flashlight cone sweeping slowly across the wall, with a little hand shake
    ang_c = np.deg2rad(-150 + 40 * np.sin(t * 0.55) + 2.0 * np.sin(t * 9.1))
    dx, dy = px - ox, py - oy
    dist = np.sqrt(dx * dx + dy * dy) + 1e-3
    ang = np.arctan2(dy, dx)
    da = np.arctan2(np.sin(ang - ang_c), np.cos(ang - ang_c))
    cone = np.exp(-(da / 0.20) ** 2) * np.exp(-dist / 1500.0)
    spot_x, spot_y = ox + 1100 * np.cos(ang_c), oy + 1100 * np.sin(ang_c)
    spot = np.exp(-(((px - spot_x) ** 2 + (py - spot_y) ** 2) / (2 * 150.0 ** 2)))
    light = cv2.resize((0.55 * cone + 0.9 * spot).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    flick = 0.93 + 0.07 * np.sin(t * 23.0) * np.sin(t * 7.0)
    frame += light[..., None] * flick * np.array([0.55, 0.78, 0.95], np.float32) * (0.35 + 0.65 * frame.mean(-1, keepdims=True) * 3)
    frame += light[..., None] * flick * np.array([0.10, 0.16, 0.20], np.float32)

    frame *= vig
    grain = cv2.resize(rng.normal(0, 0.035, (H // 2, W // 2)).astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    frame += grain[..., None]
    ff.stdin.write((np.clip(frame, 0, 1) * 255).astype(np.uint8).tobytes())

ff.stdin.close()
ff.wait()
print(f"RENDER_SECONDS={time.perf_counter() - t0:.1f} file={out}")
