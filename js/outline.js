(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * TODO: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                var xRTotal = 0;
                var xGTotal = 0;
                var xBTotal = 0;
                var yRTotal = 0;
                var yGTotal = 0;
                var yBTotal = 0;
                for (var i = -1; i < 2; i++){
                    for (var j = -1; j < 2; j++){
                        var pixel = imageproc.getPixel(inputData, x+i, y+j, "");
                        xRTotal += pixel.r*Gx[i+1][j+1];
                        xGTotal += pixel.g*Gx[i+1][j+1];
                        xBTotal += pixel.b*Gx[i+1][j+1];
                        yRTotal += pixel.r*Gy[i+1][j+1];
                        yGTotal += pixel.g*Gy[i+1][j+1];
                        yBTotal += pixel.b*Gy[i+1][j+1];
                    }
                }

                // Then set the blurred result to the output data
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = Math.hypot(xRTotal, yRTotal);
                outputData.data[i + 1] = Math.hypot(xGTotal, yGTotal);
                outputData.data[i + 2] = Math.hypot(xBTotal, yBTotal);
            }
        }
        imageproc.threshold(outputData, outputData, threshold);
    } 

}(window.imageproc = window.imageproc || {}));
