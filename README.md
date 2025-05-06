<p align="center">
  <a href="https://cse40.cse.uom.lk/codejam" target="blank"><img src="https://firebasestorage.googleapis.com/v0/b/profile-image-1c78a.appspot.com/o/codejam%2FCodeJameLogo.webp?alt=media&token=507a7f7b-e735-4952-ad04-d0a8f48a8f55" width="350" alt="CodeJam Logo" /></a>
</p>


## Introduction

Professor Roshan Thennakoon from the University of Moratuwa created this challenge for his CS4051 Image Processing students. While many excel at theory, he noticed they struggle with identifying subtle bugs in real-world code. This NestJS application implements core image processing algorithms that are divided into three sections.
1. Basic Processing Algorithms
    - Greyscale
    - Negative
    - Resize
    - Rotate
    - Sharpen
    - Contrast
    - Emboss
2. Image Enhancement Algorithms
    - Flood-fill
    - Histogram equalization
3. Feature Detection Algorithms
    - Canny Edge Detection
    - Harris Corner Detection

This code contains deliberately planted logical errors that produce visual anomalies without causing compilation failures.

## Your Mission

Your task is to find and fix all logical bugs in the codebase, document what was wrong with each implementation, and demonstrate how your fixes improve the output images. Success requires not just coding skills, but a deep understanding of image processing fundamentals and the ability to trace algorithm execution when results don't match expectations.

## Project setup

```bash
$ npm install
```

## Run all the services given below

```bash
# run main service
$ npm start cse40

# run basic-processing service
$ npm run start:basic-processing

# run enhancement service
$ npm run start:enhancement

# run feature-detection service
$ npm run start:feature-detection
```

### Access the swagger API Documentation `http://localhost:3000/api`