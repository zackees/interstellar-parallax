import os
import shutil
from PIL import Image
import concurrent.futures

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.join(HERE, "imgs")
OUT_DIR = os.path.join(HERE, "webp")

def get_all_files() -> list[str]:
    """Get all files in the docs directory."""
    files = []
    for root, _, filenames in os.walk(SRC_DIR):
        for filename in filenames:
            files.append(os.path.join(root, filename))
    return files

def convert_png_to_webp(file: str, out_file: str):
    im = Image.open(file)
    # Reduce the image size by half
    new_size = (im.width, im.height)
    im.thumbnail(new_size)
    # Save as webp
    im.save(fp=out_file, format='webp', optimize=True)
    # get size of original file
    original_size = os.path.getsize(file)
    # get size of webp file
    webp_size = os.path.getsize(out_file)  # change 'file' to 'out_file'
    # calculate savings
    savings = original_size - webp_size
    # print savings
    savings_perc = savings / original_size * 100
    print(f"Converting {file} to {out_file}, Saved {savings} bytes ({savings_perc:.2f}%)")


files = get_all_files()

shutil.rmtree(OUT_DIR, ignore_errors=True)
os.makedirs(OUT_DIR, exist_ok=True)

# Create a list to hold png conversion tasks
png_conversion_tasks = []

def read_utf8(file: str) -> str:
    """Read a file as UTF-8."""
    with open(file, "r", encoding="utf-8") as f:
        return f.read()
    
def write_utf8(file: str, content: str):
    """Write a file as UTF-8."""
    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

# Use a ProcessPoolExecutor to process png conversion in parallel
with concurrent.futures.ThreadPoolExecutor() as executor:
    # Process each file
    for file in files:
        # Get the relative path of the file
        relative_path = os.path.relpath(file, SRC_DIR)
        # Create the directory in the output directory
        os.makedirs(os.path.join(OUT_DIR, os.path.dirname(relative_path)), exist_ok=True)
        # Copy the file to the output directory
        file_ext = os.path.splitext(file)[1]
        if file_ext.lower() == ".png":
            # Transform png with transparency into a webp image
            outfile = os.path.join(OUT_DIR, relative_path.replace(".png", ".webp"))
            task = executor.submit(convert_png_to_webp, file, outfile)
            #png_conversion_tasks.append(task)
            task.result()

    # Wait for all png conversions to complete
    for task in concurrent.futures.as_completed(png_conversion_tasks):
        pass
