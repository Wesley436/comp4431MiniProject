(function(imageproc) {
    "use strict";

    /*
     * Apply negation to the input data
     */
    imageproc.negation = function(inputData, outputData) {
        console.log("Applying negation...");

        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]     = 255 - inputData.data[i];
            outputData.data[i + 1] = 255 - inputData.data[i + 1];
            outputData.data[i + 2] = 255 - inputData.data[i + 2];
        }
    }

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        console.log("Applying grayscale...");

        /**
         * TODO: You need to create the grayscale operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
           var intensity = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3;
            // Change the RGB components to the resulting value

            outputData.data[i]     = intensity;
            outputData.data[i + 1] = intensity;
            outputData.data[i + 2] = intensity;
        }
    }

    /*
     * Applying brightness to the input data
     */
    imageproc.brightness = function(inputData, outputData, offset) {
        console.log("Applying brightness...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by adding an offset
            var R = inputData.data[i] + offset;
            var G = inputData.data[i + 1] + offset;
            var B = inputData.data[i + 2] + offset;

            if (R > 255){
                R = 255;
            } else if (R < 0){
                R = 0;
            }
            if (G > 255){
                G = 255;
            } else if (G < 0){
                G = 0;
            }
            if (B > 255){
                B = 255;
            } else if (B < 0){
                B = 0;
            }

            outputData.data[i]     = R;
            outputData.data[i + 1] = G;
            outputData.data[i + 2] = B;

            // Handle clipping of the RGB components
        }
    }

    /*
     * Applying contrast to the input data
     */
    imageproc.contrast = function(inputData, outputData, factor) {
        console.log("Applying contrast...");

        /**
         * TODO: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by multiplying a factor

            var R = inputData.data[i] * factor;
            var G = inputData.data[i + 1] * factor;
            var B = inputData.data[i + 2] * factor;

            if (R > 255){
                R = 255;
            } else if (R < 0){
                R = 0;
            }
            if (G > 255){
                G = 255;
            } else if (G < 0){
                G = 0;
            }
            if (B > 255){
                B = 255;
            } else if (B < 0){
                B = 0;
            }

            outputData.data[i]     = R;
            outputData.data[i + 1] = G;
            outputData.data[i + 2] = B;

            // Handle clipping of the RGB components
        }
    }

    /*
     * Make a bit mask based on the number of MSB required
     */
    function makeBitMask(bits) {
        var mask = 0;
        for (var i = 0; i < bits; i++) {
            mask >>= 1;
            mask |= 128;
        }
        return mask;
    }

    /*
     * Apply posterization to the input data
     */
    imageproc.posterization = function(inputData, outputData,
                                       redBits, greenBits, blueBits) {
        console.log("Applying posterization...");

        /**
         * TODO: You need to create the posterization operation here
         */

        // Create the red, green and blue masks
        // A function makeBitMask() is already given
        var rMask = makeBitMask(redBits);
        var gMask = makeBitMask(greenBits);
        var bMask = makeBitMask(blueBits);

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Apply the bitmasks onto the RGB channels
            var R = inputData.data[i] & rMask;
            var G = inputData.data[i + 1] & gMask;
            var B = inputData.data[i + 2] & bMask

            outputData.data[i]     = R;
            outputData.data[i + 1] = G;
            outputData.data[i + 2] = B;
        }
    }

    /*
     * Apply threshold to the input data
     */
    imageproc.threshold = function(inputData, outputData, thresholdValue) {
        console.log("Applying thresholding...");

        /**
         * TODO: You need to create the thresholding operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Find the grayscale value using simple averaging
            var R = inputData.data[i];
            var G = inputData.data[i + 1];
            var B = inputData.data[i + 2];
            var intensity = (R + G + B) / 3;
            // You will apply thresholding on the grayscale value
            if (intensity < thresholdValue){
                R = 0;
                G = 0;
                B = 0;
            }else {
                R = 255;
                G = 255;
                B = 255;
            }
           
            // Change the colour to black or white based on the given threshold

            outputData.data[i]     = R;
            outputData.data[i + 1] = G;
            outputData.data[i + 2] = B;
        }
    }

    /*
     * Build the histogram of the image for a channel
     */
    function buildHistogram(inputData, channel) {
        var histogram = [];
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;

        /**
         * TODO: You need to build the histogram here
         */

        // Accumulate the histogram based on the input channel
        // The input channel can be:
        // "red"   - building a histogram for the red component
        // "green" - building a histogram for the green component
        // "blue"  - building a histogram for the blue component
        // "gray"  - building a histogram for the intensity
        //           (using simple averaging)
        switch(channel){
            case "red":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    histogram[inputData.data[i]]++;
                }
                break;
            case "green":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    histogram[inputData.data[i+1]]++;
                }
                break;
            case "blue":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    histogram[inputData.data[i+2]]++;
                }
                break;
            case "gray":
                for (var i = 0; i < inputData.data.length; i += 4) {
                    var grayLevel = (inputData.data[i] + inputData.data[i+1] + inputData.data[i+2])/3;
                    histogram[grayLevel]++;
                }
                break;
        }

        return histogram;
    }

    /*
     * Find the min and max of the histogram
     */
    function findMinMax(histogram, pixelsToIgnore) {
        var min = 0, max = 255;

        /**
         * TODO: You need to build the histogram here
         */

        // Find the minimum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore

        var ignore;
        if(pixelsToIgnore > 0){
            ignore = pixelsToIgnore/2;
        }else{
            ignore = 0;
        }

        var pixelSum = 0;
        for(min = 0; min < 255; min++){            
            if(histogram[min] > 0){
                pixelSum += histogram[min];
                if (pixelSum >= ignore){
                    break;
                }
            }
        }
        
        pixelSum = 0;
        // Find the maximum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        for(max = 255; max > 0; max--){
            if(histogram[max] > 0){
                pixelSum += histogram[max];
                if (pixelSum >= ignore){
                    break;
                }
            }
        }
        
        return {"min": min, "max": max};
    }

    /*
     * Apply automatic contrast to the input data
     */
    imageproc.autoContrast = function(inputData, outputData, type, percentage) {
        console.log("Applying automatic contrast...");

        // Find the number of pixels to ignore from the percentage
        var pixelsToIgnore = (inputData.data.length / 4) * percentage;

        var histogram, minMax;
        if (type == "gray") {
            // Build the grayscale histogram
            histogram = buildHistogram(inputData, "gray");

            // Find the minimum and maximum grayscale values with non-zero pixels
            minMax = findMinMax(histogram, pixelsToIgnore);

            var min = minMax.min, max = minMax.max, range = max - min;

            /**
             * TODO: You need to apply the correct adjustment to each pixel
             */

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each pixel based on the minimum and maximum values

                outputData.data[i]     = (inputData.data[i] - min) / range * 255;
                outputData.data[i + 1] = (inputData.data[i+1] - min) / range * 255;
                outputData.data[i + 2] = (inputData.data[i+2] - min) / range * 255;

                if (outputData.data[i] < 0){
                    outputData.data[i] = 0;
                }else if (outputData.data[i] > 255){
                    outputData.data[i] = 255;
                }
                if (outputData.data[i+1] < 0){
                    outputData.data[i+1] = 0;
                }else if (outputData.data[i+1] > 255){
                    outputData.data[i+1] = 255;
                }
                if (outputData.data[i+2] < 0){
                    outputData.data[i+2] = 0;
                }else if (outputData.data[i+2] > 255){
                    outputData.data[i+2] = 255;
                }
            }
        }
        else {

            /**
             * TODO: You need to apply the same procedure for each RGB channel
             *       based on what you have done for the grayscale version
             */
            var Rhistogram = buildHistogram(inputData, "red");
            var RminMax = findMinMax(Rhistogram, pixelsToIgnore);
            var Rmin = RminMax.min, Rmax = RminMax.max, Rrange = Rmax - Rmin;

            var Ghistogram = buildHistogram(inputData, "green");
            var GminMax = findMinMax(Ghistogram, pixelsToIgnore);
            var Gmin = GminMax.min, Gmax = GminMax.max, Grange = Gmax - Gmin;

            var Bhistogram = buildHistogram(inputData, "blue");
            var BminMax = findMinMax(Bhistogram, pixelsToIgnore);
            var Bmin = BminMax.min, Bmax = BminMax.max, Brange = Bmax - Bmin;

            for (var i = 0; i < inputData.data.length; i += 4) {
                // Adjust each channel based on the histogram of each one

                outputData.data[i]     = (inputData.data[i] - Rmin) / Rrange * 255;
                outputData.data[i + 1] = (inputData.data[i+1] - Gmin) / Grange * 255;
                outputData.data[i + 2] = (inputData.data[i+2] - Bmin) / Brange * 255;

                if (outputData.data[i] < 0){
                    outputData.data[i] = 0;
                }else if (outputData.data[i] > 255){
                    outputData.data[i] = 255;
                }
                if (outputData.data[i+1] < 0){
                    outputData.data[i+1] = 0;
                }else if (outputData.data[i+1] > 255){
                    outputData.data[i+1] = 255;
                }
                if (outputData.data[i+2] < 0){
                    outputData.data[i+2] = 0;
                }else if (outputData.data[i+2] > 255){
                    outputData.data[i+2] = 255;
                }
            }
        }
    }

}(window.imageproc = window.imageproc || {}));
