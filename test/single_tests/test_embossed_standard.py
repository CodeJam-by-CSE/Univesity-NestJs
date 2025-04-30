from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/emboss_image.png", "apps/basic-processing/output_images/emboss_image.png")
        print("embossed_standard: {} marks".format(score))
    except Exception as e:
        print("embossed_standard: Error ({})".format(e))

if __name__ == "__main__":
    main()
