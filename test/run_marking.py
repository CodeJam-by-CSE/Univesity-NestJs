from compare_images import compare_images  # assuming you saved previous function as compare_images.py

def main():
    tests = [
        ('apps/cse40/expected_images/contrast_20_image.png', 'apps/basic-processing/output_images/contrast_20_image.png', 'Contrast 20'),
        ('apps/cse40/expected_images/embossed_standard_1.0.png', 'apps/basic-processing/output_images/embossed_standard_1.0.png', 'Embossed Standard 1.0'),
        ('apps/cse40/expected_images/greyscale_image.png', 'apps/basic-processing/output_images/greyscale_image.png', 'Greyscale Image'),
        ('apps/cse40/expected_images/negative_image.png', 'apps/basic-processing/output_images/negative_image.png', 'Negative Image'),
        ('apps/cse40/expected_images/rotated_90_image.png', 'apps/basic-processing/output_images/rotated_90_image.png', 'Rotated Image'),
        ('apps/cse40/expected_images/flood_filled_input_image.png', 'apps/enhancement/output_images/flood_filled_input_image.png', 'Flood Filled Input Image'),
        ('apps/cse40/expected_images/histogram_equalized.png', 'apps/enhancement/output_images/histogram_equalized.png', 'Histogram Equalized'),
    ]

    total_marks = 0
    for expected, generated, name in tests:
        try:
            score = compare_images(expected, generated)
            print(f"{name}: {score} marks")
            total_marks += score
        except Exception as e:
            print(f"{name}: Error ({e})")
    
    print(f"Total Marks: {total_marks}/{len(tests)*100}")

if __name__ == "__main__":
    main()
