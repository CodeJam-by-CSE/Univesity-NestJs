from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/flood_filled_input_image.png", "apps/enhancement/output_images/flood_filled_input_image.png")
        print("flood_filled_input: {} marks".format(score))
    except Exception as e:
        print("flood_filled_input: Error ({})".format(e))

if __name__ == "__main__":
    main()
