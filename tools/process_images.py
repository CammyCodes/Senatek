import os
import glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

BRAIN_DIR = r"C:\Users\Cammy\.gemini\antigravity\brain\28f47327-668b-4937-9b39-6897b4ff1d98"
PROJECT_DIR = r"y:\Github\Senatek"
IMAGES_DIR = os.path.join(PROJECT_DIR, "images")
SECTORS_DIR = os.path.join(IMAGES_DIR, "sectors")

def crop_ratio(im, x0, ratio, ya=0.5):
    """Largest box of `ratio` inside the region right of x0, anchored vertically by ya."""
    W, H = im.size
    aw, ah = W - x0, H
    if aw / ah > ratio:
        ch = ah
        cw = int(ch * ratio)
    else:
        cw = aw
        ch = int(cw / ratio)
    y0 = int((ah - ch) * ya)
    return im.crop((x0, y0, x0 + cw, y0 + ch))

def save_jpeg(im, path, max_dim=None, q=82):
    if max_dim:
        im = im.copy()
        im.thumbnail(max_dim, Image.Resampling.LANCZOS)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
    size_kb = os.path.getsize(path) / 1024
    print(f"{os.path.relpath(path, PROJECT_DIR):<45} {im.size[0]}x{im.size[1]} {size_kb:.1f} KB")

def process_renewables_og(source_path, target_path):
    W, H = 1672, 941
    src = Image.open(source_path).convert('RGB').resize((W, H), Image.Resampling.LANCZOS)
    
    # Create base canvas with near black background #07090e
    canvas = Image.new('RGB', (W, H), (7, 9, 14))
    canvas.paste(src, (0, 0))
    
    # 1. Darken left ~40-50% with linear gradient to near-black #07090e
    gradient = Image.new('L', (W, H), 0)
    draw_g = ImageDraw.Draw(gradient)
    for x in range(W):
        if x < 400:
            alpha = 255
        elif x < 850:
            alpha = int(255 * (1 - (x - 400) / 450.0))
        else:
            alpha = 0
        draw_g.line([(x, 0), (x, H)], fill=alpha)
    
    black_layer = Image.new('RGB', (W, H), (7, 9, 14))
    canvas = Image.composite(black_layer, canvas, gradient)
    
    # 2. Draw amber arc sweep and light streaks
    draw = ImageDraw.Draw(canvas)
    # Circular arc in #f7941d
    arc_box = (-350, H - 750, 650, H + 250)
    draw.arc(arc_box, start=250, end=360, fill=(247, 148, 29), width=4)
    draw.arc((-360, H - 760, 660, H + 260), start=250, end=360, fill=(247, 148, 29, 100), width=2)
    
    # 3. Paste main-logo.png
    logo_path = os.path.join(IMAGES_DIR, "main-logo.png")
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert('RGBA')
        # Sized nicely in the top left
        target_logo_h = 75
        target_logo_w = int(logo.width * (target_logo_h / logo.height))
        logo_resized = logo.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)
        canvas.paste(logo_resized, (85, 85), logo_resized)
    
    # 4. Render title text
    # Try system fonts or default
    font_path = r"C:\Windows\Fonts\segoeuib.ttf"
    if not os.path.exists(font_path):
        font_path = r"C:\Windows\Fonts\arialbd.ttf"
    
    try:
        font_large = ImageFont.truetype(font_path, 48)
        font_eyebrow = ImageFont.truetype(font_path, 18)
    except Exception:
        font_large = ImageFont.load_default()
        font_eyebrow = ImageFont.load_default()
        
    # Eyebrow / Category
    draw.text((85, 230), "SECTOR BRIEFING", fill=(247, 148, 29), font=font_eyebrow)
    
    # Main title lines
    draw.text((85, 270), "Renewables &", fill=(244, 242, 238), font=font_large)
    draw.text((85, 330), "Energy Storage", fill=(247, 148, 29), font=font_large)
    
    # Underline rule
    draw.rectangle([(85, 410), (185, 414)], fill=(247, 148, 29))
    
    save_jpeg(canvas, target_path, q=85)

def main():
    print("--- Senatek Image Post-Processing Script ---")
    
    # Mapping of generated brain files to project destinations
    brain_files = {
        "renewables_source": glob.glob(os.path.join(BRAIN_DIR, "renewables_source_*.jpg")),
        "hero_about": glob.glob(os.path.join(BRAIN_DIR, "hero_about_*.jpg")),
        "hero_clients": glob.glob(os.path.join(BRAIN_DIR, "hero_clients_*.jpg")),
        "hero_candidates": glob.glob(os.path.join(BRAIN_DIR, "hero_candidates_*.jpg")),
        "hero_contact": glob.glob(os.path.join(BRAIN_DIR, "hero_contact_*.jpg")),
        "clients_briefing": glob.glob(os.path.join(BRAIN_DIR, "clients_briefing_*.jpg")),
        "clients_shortlist": glob.glob(os.path.join(BRAIN_DIR, "clients_shortlist_*.jpg")),
        "candidates_onsite": glob.glob(os.path.join(BRAIN_DIR, "candidates_onsite_*.jpg")),
        "candidates_progression": glob.glob(os.path.join(BRAIN_DIR, "candidates_progression_*.jpg")),
        "about_values": glob.glob(os.path.join(BRAIN_DIR, "about_values_*.jpg")),
        "split_clients": glob.glob(os.path.join(BRAIN_DIR, "split_clients_*.jpg")),
        "split_candidates": glob.glob(os.path.join(BRAIN_DIR, "split_candidates_*.jpg")),
        "og_default": glob.glob(os.path.join(BRAIN_DIR, "og_default_*.jpg")),
    }
    
    # Group A - Renewables
    if brain_files["renewables_source"]:
        ren_src_path = brain_files["renewables_source"][0]
        ren_source_dest = os.path.join(SECTORS_DIR, "renewables-source.jpg")
        im_ren = Image.open(ren_src_path).convert('RGB')
        save_jpeg(im_ren, ren_source_dest, max_dim=(1672, 941))
        
        # Derivatives
        save_jpeg(crop_ratio(im_ren, 0, 21/9), os.path.join(SECTORS_DIR, "renewables-wide.jpg"), max_dim=(1400, 600))
        save_jpeg(crop_ratio(im_ren, 0, 4/3), os.path.join(SECTORS_DIR, "renewables-tile.jpg"), max_dim=(972, 729))
        
        # OG Composited banner
        process_renewables_og(ren_src_path, os.path.join(SECTORS_DIR, "renewables-og.jpg"))

    # Group B - Heroes
    hero_map = [
        ("hero_about", "hero-about.jpg"),
        ("hero_clients", "hero-clients.jpg"),
        ("hero_candidates", "hero-candidates.jpg"),
        ("hero_contact", "hero-contact.jpg"),
    ]
    for key, dest_name in hero_map:
        if brain_files[key]:
            im = Image.open(brain_files[key][0]).convert('RGB')
            save_jpeg(im, os.path.join(IMAGES_DIR, dest_name), max_dim=(1600, 900))

    # Group C - Section imagery
    sec_map = [
        ("clients_briefing", "clients-briefing.jpg"),
        ("clients_shortlist", "clients-shortlist.jpg"),
        ("candidates_onsite", "candidates-onsite.jpg"),
        ("candidates_progression", "candidates-progression.jpg"),
        ("about_values", "about-values.jpg"),
    ]
    for key, dest_name in sec_map:
        if brain_files[key]:
            im = Image.open(brain_files[key][0]).convert('RGB')
            save_jpeg(im, os.path.join(IMAGES_DIR, dest_name), max_dim=(1000, 750))

    # Group D - Split panels
    split_map = [
        ("split_clients", "split-clients.jpg"),
        ("split_candidates", "split-candidates.jpg"),
    ]
    for key, dest_name in split_map:
        if brain_files[key]:
            im = Image.open(brain_files[key][0]).convert('RGB')
            save_jpeg(im, os.path.join(IMAGES_DIR, dest_name), max_dim=(1200, 800))

    # Group E - Site-wide & Jobs hero
    if brain_files["og_default"]:
        im_og = Image.open(brain_files["og_default"][0]).convert('RGB')
        save_jpeg(im_og, os.path.join(IMAGES_DIR, "og-default.jpg"), max_dim=(1200, 630))
        save_jpeg(im_og, os.path.join(IMAGES_DIR, "hero-jobs.jpg"), max_dim=(1600, 900))

    print("--- Post-Processing Complete ---")

if __name__ == "__main__":
    main()
