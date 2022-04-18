(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
        var kernel;
        var divisor;
        switch (kernelSize){
            case 3:{   
                kernel = [ [1, 1, 1], [1, 1, 1], [1, 1, 1] ];
                divisor = 9;
                break;
            }
            case 5:{
                kernel = [ [1, 1, 1 ,1 ,1], [1, 1, 1 ,1 ,1], [1, 1, 1 ,1 ,1], [1, 1, 1 ,1 ,1], [1, 1, 1 ,1 ,1] ];
                divisor = 25;
                break;
            }
            case 7:{
                kernel = [ [1, 1, 1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1] ];
                divisor = 49;
                break;
            }
            case 9:{
                kernel = [ [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1], [1, 1, 1 ,1 ,1 ,1 ,1 ,1 ,1] ];
                divisor = 81;
                break;
            }
        }

        /**
         * TODO: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel

                var RTotal = 0;
                var GTotal = 0;
                var BTotal = 0;
                var halfSize = Math.floor(kernelSize/2);
                for (var i = -halfSize; i < halfSize+1; i++){
                    for (var j = -halfSize; j < halfSize+1; j++){
                        var pixel = imageproc.getPixel(inputData, x+i, y+j, "");
                        RTotal += pixel.r;
                        GTotal += pixel.g;
                        BTotal += pixel.b;
                    }
                }

                // Then set the blurred result to the output data
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = RTotal/divisor;
                outputData.data[i + 1] = GTotal/divisor;
                outputData.data[i + 2] = BTotal/divisor;
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
