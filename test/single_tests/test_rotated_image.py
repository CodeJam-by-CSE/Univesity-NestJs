from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/rotated_90_image.png", "apps/basic-processing/output_images/rotated_90_image.png")
        print("rotated_image: {} marks".format(score))
    except Exception as e:
        print("rotated_image: Error ({})".format(e))

if __name__ == "__main__":
    main()
