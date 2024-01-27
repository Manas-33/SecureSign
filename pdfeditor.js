const hummus = require("hummus");
const signedFile = "";
var writer = new streams.WritableStream();
var reader = new hummus.PDFRStreamForBuffer(
  await readFile(signedFile.getLocation())
);
var pdfWriter = hummus.createWriterToModify(
  reader,
  new hummus.PDFStreamForResponse(writer)
);
var pageModifier = new hummus.PDFPageModifier(pdfWriter, 0);

pageModifier = new hummus.PDFPageModifier(
  pdfWriter,
  pdfWriter.getModifiedFileParser().getPagesCount() - 1
);
var y = 755;
var x = 25;
for (i in docRequest.signers) {
  textOptions.size = 12;
  pageModifier
    .startContext()
    .getContext()
    .writeText(
      "Document Signed by " +
        docRequest.signers[i].name +
        "(" +
        docRequest.signers[i].email +
        ")",
      x,
      y,
      textOptions
    );
  y -= 15;
  textOptions.size = 8;
  pageModifier
    .startContext()
    .getContext()
    .writeText(
      "Timestamp: " + new Date(docRequest.signers[i].btime * 1000),
      x,
      y,
      textOptions
    );
  y -= 35;
  if (y < 50) {
    //Run out of space on page, let's create a new one
    pageModifier.endContext().writePage();
    var page = pdfWriter.createPage(0, 0, 595, 842);
    pdfWriter.writePage(page);
    pdfWriter.end();
    reader = new hummus.PDFRStreamForBuffer(writer.toBuffer());
    writer = new streams.WritableStream();
    pdfWriter = hummus.createWriterToModify(
      reader,
      new hummus.PDFStreamForResponse(writer)
    );
    textOptions = {
      font: pdfWriter.getFontForFile(__dirname + "/arial.ttf"),
      size: 12,
      colorspace: "gray",
      color: 0x00,
    };
    pageModifier = new hummus.PDFPageModifier(
      pdfWriter,
      pdfWriter.getModifiedFileParser().getPagesCount() - 1
    );
    y = 755;
  }
}
