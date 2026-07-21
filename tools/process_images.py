import os
import glob
from PIL import Image, ImageDraw, ImageFont

PROJECT_DIR = r"y:\Github\Senatek"
IMAGES_DIR = os.path.join(PROJECT_DIR, "images")
SECTORS_DIR = os.path.join(IMAGES_DIR, "sectors")

def save_jpeg(im, path, max_dim=None, q=82):
    if max_dim:
        im = im.copy()
        im.thumbnail(max_dim, Image.Resampling.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
    size_kb = os.path.getsize(path) / 1024
    print(f"{os.path.relpath(path, PROJECT_DIR):<45} {im.size[0]}x{im.size[1]} {size_kb:.1f} KB")

def process_heroes():
    print("--- Creating Hero Background Images ---")
    
    # 1. hero-home.jpg (from og-default.jpg)
    og_default_path = os.path.join(IMAGES_DIR, "og-default.jpg")
    if os.path.exists(og_default_path):
        im_home = Image.open(og_default_path).convert('RGB')
        save_jpeg(im_home, os.path.join(IMAGES_DIR, "hero-home.jpg"), max_dim=(1600, 900))

    # 2. hero-sectors.jpg (from clients-shortlist.jpg)
    shortlist_path = os.path.join(IMAGES_DIR, "clients-shortlist.jpg")
    if os.path.exists(shortlist_path):
        im_sec = Image.open(shortlist_path).convert('RGB')
        save_jpeg(im_sec, os.path.join(IMAGES_DIR, "hero-sectors.jpg"), max_dim=(1600, 900))

    # 3. hero-power-energy.jpg (from power-energy-wide.jpg)
    pe_path = os.path.join(SECTORS_DIR, "power-energy-wide.jpg")
    if os.path.exists(pe_path):
        im_pe = Image.open(pe_path).convert('RGB')
        save_jpeg(im_pe, os.path.join(IMAGES_DIR, "hero-power-energy.jpg"), max_dim=(1600, 900))

    # 4. hero-data-centres.jpg (from data-centres-wide.jpg)
    dc_path = os.path.join(SECTORS_DIR, "data-centres-wide.jpg")
    if os.path.exists(dc_path):
        im_dc = Image.open(dc_path).convert('RGB')
        save_jpeg(im_dc, os.path.join(IMAGES_DIR, "hero-data-centres.jpg"), max_dim=(1600, 900))

    # 5. hero-building-services.jpg (from building-services-wide.jpg)
    bs_path = os.path.join(SECTORS_DIR, "building-services-wide.jpg")
    if os.path.exists(bs_path):
        im_bs = Image.open(bs_path).convert('RGB')
        save_jpeg(im_bs, os.path.join(IMAGES_DIR, "hero-building-services.jpg"), max_dim=(1600, 900))

    # 6. hero-renewables.jpg (from renewables-wide.jpg)
    ren_path = os.path.join(SECTORS_DIR, "renewables-wide.jpg")
    if os.path.exists(ren_path):
        im_ren = Image.open(ren_path).convert('RGB')
        save_jpeg(im_ren, os.path.join(IMAGES_DIR, "hero-renewables.jpg"), max_dim=(1600, 900))

    print("--- Hero Images Created ---")

if __name__ == "__main__":
    process_heroes()
