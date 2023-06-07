import os
import shutil
from PIL import Image
import concurrent.futures

HERE = os.path.dirname(os.path.abspath(__file__))
HTML_DIR = os.path.join(HERE, "html")
DOCS_DIR = os.path.join(HTML_DIR, "docs")
OUT_DIR = os.path.join(HTML_DIR, "out")

def get_all_files() -> list[str]:
    """Get all files in the docs directory."""
    files = []
    for root, _, filenames in os.walk(DOCS_DIR):
        for filename in filenames:
            files.append(os.path.join(root, filename))
    return files

def convert_png_to_webp(file: str, relative_path: str):
    im = Image.open(file)
    output_path = os.path.join(OUT_DIR, os.path.splitext(relative_path)[0] + '.webp')
    print(f"Converting {relative_path} to {output_path}")
    im.save(output_path, 'webp')

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
        relative_path = os.path.relpath(file, DOCS_DIR)
        # Create the directory in the output directory
        os.makedirs(os.path.join(OUT_DIR, os.path.dirname(relative_path)), exist_ok=True)
        # Copy the file to the output directory
        file_ext = os.path.splitext(file)[1]
        if file_ext.lower() == ".png":
            # Transform png with transparency into a webp image
            task = executor.submit(convert_png_to_webp, file, relative_path)
            png_conversion_tasks.append(task)
        if file_ext.lower() == ".html":
            # Read the file as UTF-8
            content = read_utf8(file)
            # Replace all .png with .webp
            content = content.replace(".png", ".webp")
            # Write the file as UTF-8
            write_utf8(os.path.join(OUT_DIR, relative_path), content)
        else:
            shutil.copy(file, os.path.join(OUT_DIR, relative_path))

    # Wait for all png conversions to complete
    for task in concurrent.futures.as_completed(png_conversion_tasks):
        pass
