from compare_images import compare_images  # assuming you saved previous function as compare_images.py

def main():
    tests = [
        ('apps/cse40/expected_images/contrast_20_image.png', 'apps/basic-processing/output_images/contrast_20_image.png', 'Contrast 20'),
        ('apps/cse40/expected_images/embossed_standard_1.0.png', 'apps/basic-processing/output_images/embossed_standard_1.0.png', 'Embossed Standard 1.0'),
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
