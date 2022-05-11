(function(imageproc) {
    "use strict";

    /*
     * Apply the basic processing operations
     */
    function applyBasicOp(inputImage, outputImage) {
        switch (currentBasicOp) {
            // Apply negation
            case "negation":
                imageproc.negation(inputImage, outputImage);
                break;

            // Apply grayscale
            case "grayscale":
                imageproc.grayscale(inputImage, outputImage);
                break;

            // Apply brightness
            case "brightness":
                var offset = parseInt($("#brightness-offset").val());
                imageproc.brightness(inputImage, outputImage, offset);
                break;

            // Apply contrast
            case "contrast":
                var factor = parseFloat($("#contrast-factor").val());
                imageproc.contrast(inputImage, outputImage, factor);
                break;

            // Apply posterization
            case "posterization":
                var rbits = parseInt($("#posterization-red-bits").val());
                var gbits = parseInt($("#posterization-green-bits").val());
                var bbits = parseInt($("#posterization-blue-bits").val());
                imageproc.posterization(inputImage, outputImage, rbits, gbits, bbits);
                break;

            case "histogramEqualization":
                // for getting and displaying histograms of the RGB channels as well as grayscale of the input iamge
                let canvasNames = ['inputRHistogram', 'inputGHistogram', 'inputBHistogram', 'inputGrayscaleHistogram'];
                let outputCanvasNames = ['outputRHistogram', 'outputGHistogram', 'outputBHistogram', 'outputGrayscaleHistogram'];
                
                for (let i = 0; i < 4; i++) {
                    let src = cv.imread('input');
                    let channels;
                    if (i == 3){
                        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY, 0);
                        channels = [0];
                    }else{
                        channels = [i];
                    }
                    let srcVec = new cv.MatVector();
                    srcVec.push_back(src);
                    let accumulate = false;
                    
                    let histSize = [256];
                    let ranges = [0, 255];
                    let hist = new cv.Mat();
                    let mask = new cv.Mat();
                    let color = new cv.Scalar(255, 255, 255);
                    let scale = 1;
                    
                    cv.calcHist(srcVec, channels, mask, hist, histSize, ranges, accumulate);

                    let result = cv.minMaxLoc(hist, mask);
                    let max = result.maxVal;
                    let dst = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);
                    let sum=0;
                    let sum_list=[];
                    let cdf_list = new Array(256).fill(0);
                    // draw histogram
                    for (let j = 0; j < histSize[0]; j++) {
                        let binVal = hist.data32F[j] * src.rows / max;
                        let point1 = new cv.Point(j * scale, src.rows);
                        let point2 = new cv.Point((j + 1) * scale - 1, src.rows - binVal);
                        cv.rectangle(dst, point1, point2, color, cv.FILLED);
                        sum+=binVal;
                        sum_list.push(sum);
                    }
                    //draw cdf
                    if (sum!=0){
                        for (let j=0; j< histSize[0]-1; j++){
                            let point1 = new cv.Point((j + 0.5) * scale, src.rows - sum_list[j]*src.rows/sum_list.slice(-1));
                            let point2 = new cv.Point((j + 1.5) * scale, src.rows - sum_list[j+1]*src.rows/sum_list.slice(-1));
                            cv.line(dst,point1,point2,new cv.Scalar(255,0,0),1);
                            cdf_list[j+1]=sum_list[j+1]/sum_list.slice(-1);
                        }
                    } else {
                        for (let j=0; j< histSize[0]-1; j++){
                            let point1 = new cv.Point((j + 0.5) * scale, 0);
                            let point2 = new cv.Point((j + 1.5) * scale, 0);
                            cv.line(dst,point1,point2,new cv.Scalar(255,0,0),1);
                        }
                    }
                    cv.imshow(canvasNames[i], dst);

                    //equalize image's histogram
                    for (let j=0; j < inputImage.data.length; j+=4){
                        outputImage.data[j+i]=inputImage.data[j+i];
                    }
                    
                    let outputHistogram = new Array(256).fill(0);

                    if (i==3 && !$("#RGBorGrayscale").prop("checked")){
                        for (let j=0; j < inputImage.data.length; j+=4){
                            let Y = Math.round(0.299*inputImage.data[j] + 0.587*inputImage.data[j+1] + 0.114*inputImage.data[j+2]);

                            outputImage.data[j]=Math.round((histSize[0]-1)*cdf_list[Y]);
                            outputImage.data[j+1]=Math.round((histSize[0]-1)*cdf_list[Y]);
                            outputImage.data[j+2]=Math.round((histSize[0]-1)*cdf_list[Y]);

                            let cdfIndex = Math.round(outputImage.data[j]);
                            outputHistogram[cdfIndex]++;
                        }
                        
                    } else if (i==0 && $("#showRHistogram").prop("checked") || i==1 && $("#showGHistogram").prop("checked") || i==2 && $("#showBHistogram").prop("checked")){
                        for (let j=0; j < inputImage.data.length; j+=4){
                            outputImage.data[j+i]=Math.round((histSize[0]-1)*cdf_list[inputImage.data[j+i]]);
                            outputHistogram[outputImage.data[j+i]]++;
                        }
                    }

                    let outputDst = new cv.Mat.zeros(src.rows, histSize[0] * scale, cv.CV_8UC3);
                    let outputSum=0;
                    let outputSum_list=[];
                    // draw processed histograms
                    for (let k = 0; k < outputHistogram.length; k++) {
                        let binVal = outputHistogram[k] * src.rows / max;
                        let point1 = new cv.Point(k * scale, src.rows);
                        let point2 = new cv.Point((k + 1) * scale - 1, src.rows - binVal);
                        cv.rectangle(outputDst, point1, point2, color, cv.FILLED);
                        outputSum+=binVal;
                        outputSum_list.push(outputSum);
                    }
                    // draw processed cdf
                    if (outputSum!=0){
                        for (let j=0; j< outputHistogram.length-1; j++){
                            let point1 = new cv.Point((j + 0.5) * scale, src.rows - outputSum_list[j]*src.rows/outputSum_list.slice(-1));
                            let point2 = new cv.Point((j + 1.5) * scale, src.rows - outputSum_list[j+1]*src.rows/outputSum_list.slice(-1));
                            cv.line(outputDst,point1,point2,new cv.Scalar(255,0,0),1);
                        }
                    } else {
                        for (let j=0; j< outputHistogram.length-1; j++){
                            let point1 = new cv.Point((j + 0.5) * scale, 0);
                            let point2 = new cv.Point((j + 1.5) * scale, 0);
                            cv.line(outputDst,point1,point2,new cv.Scalar(255,0,0),1);
                        }
                    }
                    cv.imshow(outputCanvasNames[i], outputDst);

                    src.delete(); dst.delete(); srcVec.delete(); mask.delete(); hist.delete(); outputDst.delete();
                }
                
                // TODO: process and equalize the image's histograms, as well as displaying them
                break;

            // Apply threshold
            case "threshold":
                var threshold = parseFloat($("#threshold-value").val());
                imageproc.threshold(inputImage, outputImage, threshold);
                break;

            // Apply comic colour
            case "comic-color":
                var saturation = parseInt($("#comic-color-saturation").val());
                imageproc.comicColor(inputImage, outputImage, saturation);
                break;

            // Apply automatic contrast
            case "auto-contrast":
                var type = $("#auto-contrast-type").val();
                var percentage = parseInt($("#auto-contrast-percentage").val()) / 100.0;
                imageproc.autoContrast(inputImage, outputImage, type, percentage);
                break;
        }
    }

    /*
     * Apply the base layer operations
     */
    function applyBaseLayerOp(inputImage, processedImage, outputImage) {
        switch (currentBaseLayerOp) {
            // Apply blur
            case "blur":
                if ($("#blur-input").val() == "processed")
                    inputImage = processedImage;
                var size = parseInt($("#blur-kernel-size").val());
                imageproc.blur(inputImage, outputImage, size);
                break;

            // Apply kuwahara
            case "kuwahara":
                if ($("#kuwahara-input").val() == "processed")
                    inputImage = processedImage;
                var size = parseInt($("#kuwahara-filter-size").val());
                imageproc.kuwahara(inputImage, outputImage, size);
                break;
        }
    }

    /*
     * Apply the shade layer operations
     */
    function applyShadeLayerOp(inputImage, processedImage, outputImage) {
        switch (currentShadeLayerOp) {
            // Apply dither
            case "dither":
                if ($("#dither-input").val() == "processed")
                    inputImage = processedImage;
                imageproc.dither(inputImage, outputImage,
                                 $("#dither-matrix-type").val());
                break;
        }
    }

    /*
     * Apply the outline layer operations
     */
    function applyOutlineLayerOp(inputImage, processedImage, outputImage) {
        switch (currentOutlineLayerOp) {
            // Apply sobel edge detection
            case "sobel":
                if ($("#sobel-input").val() == "processed")
                    inputImage = processedImage;

                // Use the grayscale image
                var grayscale = imageproc.createBuffer(outputImage);
                imageproc.grayscale(inputImage, grayscale);

                // Blur if needed
                if ($("#sobel-blur").prop("checked")) {
                    var blur = imageproc.createBuffer(outputImage);
                    var size = parseInt($("#sobel-blur-kernel-size").val());
                    imageproc.blur(grayscale, blur, size);
                    grayscale = blur;
                }

                var threshold = parseInt($("#sobel-threshold").val());
                imageproc.sobelEdge(grayscale, outputImage, threshold);

                // Flip edge values
                if ($("#sobel-flip").prop("checked")) {
                    for (var i = 0; i < outputImage.data.length; i+=4) {
                        if (outputImage.data[i] == 0) {
                            outputImage.data[i]     =
                            outputImage.data[i + 1] =
                            outputImage.data[i + 2] = 255;
                        }
                        else {
                            outputImage.data[i]     =
                            outputImage.data[i + 1] =
                            outputImage.data[i + 2] = 0;
                        }
                    }
                }
                break;
        }
    }

    /*
     * The image processing operations are set up for the different layers.
     * Operations are applied from the base layer to the outline layer. These
     * layers are combined appropriately when required.
     */
    imageproc.operation = function(inputImage, outputImage) {
        // Apply the basic processing operations
        var processedImage = inputImage;
        if (currentBasicOp != "no-op") {
            processedImage = imageproc.createBuffer(outputImage);
            applyBasicOp(inputImage, processedImage);
        }

        // Apply the base layer operations
        var baseLayer = processedImage;
        if (currentBaseLayerOp != "no-op") {
            baseLayer = imageproc.createBuffer(outputImage);
            applyBaseLayerOp(inputImage, processedImage, baseLayer);
        }

        // Apply the shade layer operations
        var shadeLayer = baseLayer;
        if (currentShadeLayerOp != "no-op") {
            shadeLayer = imageproc.createBuffer(outputImage);
            applyShadeLayerOp(inputImage, processedImage, shadeLayer);

            // Show base layer for dithering
            if (currentShadeLayerOp == "dither" &&
                $("#dither-transparent").prop("checked")) {

                /**
                 * TODO: You need to show the base layer (baseLayer) for
                 * the white pixels (transparent)
                 */
                for (var i = 0; i < shadeLayer.data.length; i+=4){
                    if (shadeLayer.data[i] == 255){
                        shadeLayer.data[i] = baseLayer.data[i];
                        shadeLayer.data[i+1] = baseLayer.data[i+1];
                        shadeLayer.data[i+2] = baseLayer.data[i+2];
                        shadeLayer.data[i+3] = baseLayer.data[i+3];
                    }
                }

            }
        }

        // Apply the outline layer operations
        var outlineLayer = shadeLayer;
        if (currentOutlineLayerOp != "no-op") {
            outlineLayer = imageproc.createBuffer(outputImage);
            applyOutlineLayerOp(inputImage, processedImage, outlineLayer);

            // Show shade layer for non-edge pixels
            if (currentOutlineLayerOp == "sobel" &&
                $("#sobel-transparent").prop("checked")) {

                /**
                 * TODO: You need to show the shade layer (shadeLayer) for
                 * the non-edge pixels (transparent)
                 */
                 for (var i = 0; i < outlineLayer.data.length; i+=4) {
                    if ($("#sobel-flip").prop("checked") == (outlineLayer.data[i] == 255)) {                        
                        outlineLayer.data[i] = shadeLayer.data[i];
                        outlineLayer.data[i+1] = shadeLayer.data[i+1];
                        outlineLayer.data[i+2] = shadeLayer.data[i+2];
                        outlineLayer.data[i+3] = shadeLayer.data[i+3];
                    }
                }

            }
        }

        // Show the accumulated image
        imageproc.copyImageData(outlineLayer, outputImage);
    }
 
}(window.imageproc = window.imageproc || {}));
