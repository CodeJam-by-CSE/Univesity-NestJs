import os

# List of test cases (expected image, generated image, test name)
tests = [
    ('apps/cse40/expected_images/contrast_20_image.png',
     'apps/basic-processing/output_images/contrast_20_image.png', 'contrast_20'),
    ('apps/cse40/expected_images/emboss_image.png',
     'apps/basic-processing/output_images/emboss_image.png', 'embossed_standard'),
    ('apps/cse40/expected_images/greyscale_image.png',
     'apps/basic-processing/output_images/greyscale_image.png', 'greyscale_image'),
    ('apps/cse40/expected_images/negative_image.png',
     'apps/basic-processing/output_images/negative_image.png', 'negative_image'),
    ('apps/cse40/expected_images/resized_image.png',
     'apps/basic-processing/output_images/resized_image.png', 'resized_image'),
    ('apps/cse40/expected_images/rotated_90_image.png',
     'apps/basic-processing/output_images/rotated_90_image.png', 'rotated_image'),
    ('apps/cse40/expected_images/sharpened_image.png',
     'apps/basic-processing/output_images/sharpened_image.png', 'sharpened_image'),
    ('apps/cse40/expected_images/flood_filled_input_image.png',
     'apps/enhancement/output_images/flood_filled_input_image.png', 'flood_filled_input'),
    ('apps/cse40/expected_images/histogram_equalized.png',
     'apps/enhancement/output_images/histogram_equalized.png', 'histogram_equalized'),
    ('apps/cse40/expected_images/canny_edges.png',
     'apps/feature-detection/output_images/canny_edges.png', "canny_edge_detection"),
    ('apps/cse40/expected_images/harris_sharp_input_image.png',
     'apps/feature-detection/output_images/harris_sharp_input_image.png', 'harris_corners'),
]

# Ensure the output directory exists
os.makedirs("single_tests", exist_ok=True)

# Template for each test file
template = '''from compare_images import compare_images

def main():
    try:
        score = compare_images("{expected}", "{generated}")
        print("{name}: {{}} marks".format(score))
    except Exception as e:
        print("{name}: Error ({{}})".format(e))

if __name__ == "__main__":
    main()
'''

# Generate each file
for expected, generated, name in tests:
    filename = f"single_tests/test_{name}.py"
    with open(filename, "w") as f:
        f.write(template.format(expected=expected, generated=generated, name=name))

print("✅ 11 test files created in 'single_tests/' directory.")