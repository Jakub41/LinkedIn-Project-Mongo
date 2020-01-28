const HTML5ToPDF = require("html5-to-pdf");
const path = require("path");

const pdfMaker = async (req, res) => {
    const html5ToPDF = new HTML5ToPDF({
        inputPath: path.join(__dirname, "./templates", "index.html"),
        outputPath: path.join(__dirname, "./public", "output.pdf"),
        include: [
            path.join(__dirname, "templates", "style.css"),
        ]
    });

    await html5ToPDF.start();
    await html5ToPDF.build();
    await html5ToPDF.close();
    console.log("DONE");
    process.exit(0);
};

module.exports = pdfMaker;
