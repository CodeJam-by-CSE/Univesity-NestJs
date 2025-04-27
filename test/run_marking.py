from compare_images import compare_images  # assuming you saved previous function as compare_images.py

def main():
    tests = [
        ('apps/basic-processing/output_images/contrast_100_image.png', 'apps/cse40/expected_images/contrast_100_image.png', 'Contrast 100')
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
