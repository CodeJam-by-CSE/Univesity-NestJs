from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/resized_image.png", "apps/basic-processing/output_images/resized_image.png")
        print("resized_image: {} marks".format(score))
    except Exception as e:
        print("resized_image: Error ({})".format(e))

if __name__ == "__main__":
    main()
