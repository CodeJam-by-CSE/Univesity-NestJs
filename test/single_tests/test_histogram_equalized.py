from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/histogram_equalized.png", "apps/enhancement/output_images/histogram_equalized.png")
        print("histogram_equalized: {} marks".format(score))
    except Exception as e:
        print("histogram_equalized: Error ({})".format(e))

if __name__ == "__main__":
    main()
