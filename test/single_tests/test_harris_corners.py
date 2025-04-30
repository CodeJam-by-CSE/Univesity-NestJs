from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/harris_sharp_input_image.png", "apps/feature-detection/output_images/harris_sharp_input_image.png")
        print("harris_corners: {} marks".format(score))
    except Exception as e:
        print("harris_corners: Error ({})".format(e))

if __name__ == "__main__":
    main()
