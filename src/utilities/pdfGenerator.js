const pdfMake = require("pdfmake");
const vfsFonts = require("./vsf_fonts");

const pdfMaker = async (req, res) => {

    pdfMake.vfs = vfsFonts.pdfMake.vfs;

    const documentDefinition = {
        content: [`Hello World`, "Nice to meet you!"]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);

    pdfDoc.getBase64((data)=>{
        res.writeHead(200,
        {
            'Content-Type': 'application/pdf',
            'Content-Disposition':'attachment;filename="filename.pdf"'
        });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        res.end(download);
    });
};

module.exports = pdfMaker;
