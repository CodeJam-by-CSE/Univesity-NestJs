from compare_images import compare_images

def main():
    try:
        score = compare_images("apps/cse40/expected_images/canny_edges.png", "apps/feature-detection/output_images/canny_edges.png")
        print("canny_edge_detection: {} marks".format(score))
    except Exception as e:
        print("canny_edge_detection: Error ({})".format(e))

if __name__ == "__main__":
    main()
