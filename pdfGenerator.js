var PDFDocument = require('pdfkit');
var fs = require('fs');
var dateFormat = require('dateformat');

const ptTomm = 210 / 595.28
const mmToPtRatio = 595.28 / 210

const endXPt = 841.89
const endYPt = 595.28

function mmToPt(mm) {
  return mm * mmToPtRatio
}

function SPCApdf(callback) {
  doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4'
  })
  writeStream = fs.createWriteStream('someid' + ".pdf");
    //Pipe it's output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(writeStream);

  var initialX = doc.x
  var starty = 0;
  var red = 'red'
  var black = 'black';

  const midHorizontalLineCut = 99
  doc.moveTo(0, mmToPt(midHorizontalLineCut))
    .lineTo(endXPt, mmToPt(midHorizontalLineCut))
    .lineWidth(.5)
    .strokeColor(red)
    // .dash(5, {space:10})
    .stroke()

  const bottomHorizontalLineCut = midHorizontalLineCut + 99

  doc.moveTo(0, mmToPt(bottomHorizontalLineCut))
    .lineTo(endXPt, mmToPt(bottomHorizontalLineCut))
    .lineWidth(.5)
    .strokeColor(red)
    // .dash(5, {space:10})
    .stroke()

  // Left most vertical cut line
  const leftVerticalLineCut = 99
  doc.moveTo(mmToPt(leftVerticalLineCut), 0)
    .lineTo(mmToPt(leftVerticalLineCut), endYPt)
    .lineWidth(.5)
    .strokeColor(red)
    // .dash(5, {space:10})
    .stroke()

  // middle vertical cut line
  const midVerticalLineCut = leftVerticalLineCut + 99
  doc.moveTo(mmToPt(midVerticalLineCut), 0)
    .lineTo(mmToPt(midVerticalLineCut), endYPt)
    .lineWidth(.5)
    .strokeColor(red)
    // .dash(5, {space:10})
    .stroke()

  // right vertical cut line
  const rightVerticalLineCut = midVerticalLineCut + 99
  doc.moveTo(mmToPt(rightVerticalLineCut), 0)
    .lineTo(mmToPt(rightVerticalLineCut), endYPt)
    .lineWidth(.5)
    .strokeColor(red)
    // .dash(5, {space:10})
    .stroke()

  const leftDiagonalLineStartX = 0
  const leftDiagonalLineStartY = 0
  const leftDiagonalLineEndX = mmToPt(99 * 2)
  const leftDiagonalLineEndY = mmToPt(99 * 2)

  // Top Left diagonal line
  doc.moveTo(0, mmToPt(99))
    .lineTo(mmToPt(99), 0)
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // Bottom Left diagonal line
  doc.moveTo(0, mmToPt(2 * 99))
    .lineTo(mmToPt(2 * 99), 0)
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // Bottom Middle diagonal line
  doc.moveTo(mmToPt(99), mmToPt(2 * 99))
    .lineTo(mmToPt(3 * 99), 0)
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // Left diagonal line
  doc.moveTo(mmToPt(2 * 99), mmToPt(2 * 99))
    .lineTo(mmToPt(3 * 99), mmToPt(99))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()


function drawFoldLines (xTranslation, yTranslation) {
  // LINE A
  doc.moveTo(mmToPt((xTranslation * 99)), mmToPt((yTranslation * 99) + 41))
    .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 0))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // LINE B
  doc.moveTo(mmToPt((xTranslation * 99)), mmToPt((yTranslation * 99) + 41))
    .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 58))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // LINE C
  doc.moveTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 58))
    .lineTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 99))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // LINE D
  doc.moveTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 99))
    .lineTo(mmToPt((xTranslation * 99) + 99), mmToPt((yTranslation * 99) + 58))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // LINE E
  doc.moveTo(mmToPt((xTranslation * 99) + 99), mmToPt((yTranslation * 99) + 58))
    .lineTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 41))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()

  // LINE F
  doc.moveTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 41))
    .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 0))
    .lineWidth(.5)
    .strokeColor(red)
    .dash(5, {space:10})
    .stroke()
}

drawFoldLines(0, 0)
drawFoldLines(0, 1)
drawFoldLines(1, 0)
drawFoldLines(1, 1)
drawFoldLines(2, 0)
drawFoldLines(2, 1)


// from https://stackoverflow.com/questions/41469801/is-there-any-trick-to-rotate-text-in-pdfkit
function doTransform (x, y, angle) {
  const rads = angle / 180 * Math.PI;
  const newX = x * Math.cos(rads) + y * Math.sin(rads);
  const newY = y * Math.cos(rads) - x * Math.sin(rads);

  const topLeftX = 0 * Math.cos(rads) + 0 * Math.sin(rads);
  const topLeftY = 0 * Math.cos(rads) - 0 * Math.sin(rads);

  const topRightX = 841.89 * Math.cos(rads) + 0 * Math.sin(rads);
  const topRightY = 0 * Math.cos(rads) - 841.89 * Math.sin(rads);

  const bottomLeftX = 0 * Math.cos(rads) + 595.28 * Math.sin(rads);
  const bottomLeftY = 595.28 * Math.cos(rads) - 0 * Math.sin(rads);

  const bottomRightX = 841.8 * Math.cos(rads) + 595.28 * Math.sin(rads);
  const bottomRightY = 595.28 * Math.cos(rads) - 841.8 * Math.sin(rads);


  console.log(`Top Left (${topLeftX}, ${topLeftY})`)
  console.log(`Top Right (${topRightX}, ${topRightY})`)
  console.log(`Bottom Left (${bottomLeftX}, ${bottomLeftY})`)
  console.log(`Bottom Right (${bottomRightX}, ${bottomRightY})`)
  return {
    x: newX,
    // y: newY - 175,
    y: newY,
    rads: rads,
    angle: angle
  };
};

function calcTextWidth (lineNumber, topMargin = 0) {
  const textHeight = 5
  const buffer = lineNumber // used to offset the space between lines
  const slope = 34/44

  return 58 + buffer - ( (topMargin + (0.5 * textHeight * lineNumber)) * slope )
}


// const topLineWidthMM = 58 - ( (topMargin + (0.5 * textHeight * lineNumber)) * slope)

function writeText (xTranslation, yTranslation, textToWrite) {

  let topMargin

  doc.save()
  const xCoord = (xTranslation * 99) + 4
  const yCoord = (yTranslation * 99) + 41
  console.log(`what is xCoord ${xCoord}, what is yCoord ${yCoord}`)

  // const loc = doTransform(xCoord, yCoord, 315)

  // original
  const loc = doTransform(mmToPt(xCoord), mmToPt(yCoord), 315)
  console.error(loc)
  doc.rotate(315)
  doc.font('Courier')

  doc.text('', loc.x, loc.y)

  for (lineNumber = 1; lineNumber <= textToWrite.length; lineNumber++) {
    const lineText = textToWrite[lineNumber-1]

    if (lineNumber === 1) {
      doc.fontSize(16)
      topMargin = 4
    } else {
      doc.fontSize(12)
      topMargin = 0
    }

    doc
      // hack: https://github.com/foliojs/pdfkit/issues/348
      .text(lineText, {
        width: mmToPt(calcTextWidth(lineNumber, topMargin)),
        height: mmToPt(5),
        lineBreak: false,
        align: 'center'
      })
  }

  doc.restore()
}

const firstLabel = [
  'VIET BIRDS EYE',
  '.SECOND LINE.',
  '.THIRD LINE.',
  '.FOURTH LINE.',
  '.FIFTH LINE.',
  '.SIXTH  LINE.',
  '.7TH LINE.'
  ]
// const firstLabel = [
//   '1'
//   ]
writeText(0, 0, firstLabel)
writeText(0, 1, firstLabel)
writeText(1, 0, firstLabel)
writeText(1, 1, firstLabel)
writeText(2, 0, firstLabel)
writeText(2, 1, firstLabel)

 // writeText(2, 0, firstLabel)
 // writeText(0, 1, firstLabel)
 // writeText(1, 1, firstLabel)
//writeText(2, 1, firstLabel)


 doc.end();
 writeStream.on('finish', function(){

   callback(true)
 });
}

SPCApdf(() => {
  console.log('done')
});

module.exports = SPCApdf;