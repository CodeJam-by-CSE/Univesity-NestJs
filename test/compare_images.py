from PIL import Image
import numpy as np

def compare_images(expected_path, generated_path):
    # Load images
    expected = Image.open(expected_path).convert('RGB')
    generated = Image.open(generated_path).convert('RGB')
    
    # Check if images have the same size
    if expected.size != generated.size:
        print(f"Size mismatch: {expected.size} vs {generated.size}")
        return 0

    # Convert to NumPy arrays
    expected_arr = np.array(expected)
    generated_arr = np.array(generated)
    
    # Calculate pixel-wise difference
    diff = np.abs(expected_arr - generated_arr)
    total_diff = np.sum(diff)
    
    # Maximum possible difference
    max_diff = expected_arr.size * 255  # size = width * height * 3 (RGB channels)
    
    # Calculate similarity
    similarity = 1 - (total_diff / max_diff)
    score = max(0, min(100, round(similarity * 100)))
    
    return score
