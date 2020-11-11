const PDFDocument = require('pdfkit')
const fs = require('fs')

const mmToPtRatio = 595.28 / 210

const endXPt = 841.89
const endYPt = 595.28

function mmToPt (mm) {
  return mm * mmToPtRatio
}

function SPCApdf (callback) {
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4'
  })

  const writeStream = fs.createWriteStream('someid' + '.pdf')
  // Pipe it's output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(writeStream)

  const red = 'red'

  const midHorizontalLineCut = 99
  doc.moveTo(0, mmToPt(midHorizontalLineCut))
    .lineTo(endXPt, mmToPt(midHorizontalLineCut))
    .lineWidth(0.5)
    .strokeColor(red)
    .stroke()

  const bottomHorizontalLineCut = midHorizontalLineCut + 99

  doc.moveTo(0, mmToPt(bottomHorizontalLineCut))
    .lineTo(endXPt, mmToPt(bottomHorizontalLineCut))
    .lineWidth(0.5)
    .strokeColor(red)
    .stroke()

  // Left most vertical cut line
  const leftVerticalLineCut = 99
  doc.moveTo(mmToPt(leftVerticalLineCut), 0)
    .lineTo(mmToPt(leftVerticalLineCut), endYPt)
    .lineWidth(0.5)
    .strokeColor(red)
    .stroke()

  // middle vertical cut line
  const midVerticalLineCut = leftVerticalLineCut + 99
  doc.moveTo(mmToPt(midVerticalLineCut), 0)
    .lineTo(mmToPt(midVerticalLineCut), endYPt)
    .lineWidth(0.5)
    .strokeColor(red)
    // .dash(5, {space:10})
    .stroke()

  // right vertical cut line
  const rightVerticalLineCut = midVerticalLineCut + 99
  doc.moveTo(mmToPt(rightVerticalLineCut), 0)
    .lineTo(mmToPt(rightVerticalLineCut), endYPt)
    .lineWidth(0.5)
    .strokeColor(red)
    .stroke()

  // Top Left diagonal line
  doc.moveTo(0, mmToPt(99))
    .lineTo(mmToPt(99), 0)
    .lineWidth(0.5)
    .strokeColor(red)
    .dash(5, { space: 10 })
    .stroke()

  // Bottom Left diagonal line
  doc.moveTo(0, mmToPt(2 * 99))
    .lineTo(mmToPt(2 * 99), 0)
    .lineWidth(0.5)
    .strokeColor(red)
    .dash(5, { space: 10 })
    .stroke()

  // Bottom Middle diagonal line
  doc.moveTo(mmToPt(99), mmToPt(2 * 99))
    .lineTo(mmToPt(3 * 99), 0)
    .lineWidth(0.5)
    .strokeColor(red)
    .dash(5, { space: 10 })
    .stroke()

  // Left diagonal line
  doc.moveTo(mmToPt(2 * 99), mmToPt(2 * 99))
    .lineTo(mmToPt(3 * 99), mmToPt(99))
    .lineWidth(0.5)
    .strokeColor(red)
    .dash(5, { space: 10 })
    .stroke()

  function drawFoldLines (doc, xTranslation, yTranslation) {
  // LINE A
    doc.moveTo(mmToPt((xTranslation * 99)), mmToPt((yTranslation * 99) + 41))
      .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 0))
      .lineWidth(0.5)
      .strokeColor(red)
      .dash(5, { space: 10 })
      .stroke()

    // LINE B
    doc.moveTo(mmToPt((xTranslation * 99)), mmToPt((yTranslation * 99) + 41))
      .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 58))
      .lineWidth(0.5)
      .strokeColor(red)
      .dash(5, { space: 10 })
      .stroke()

    // LINE C
    doc.moveTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 58))
      .lineTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 99))
      .lineWidth(0.5)
      .strokeColor(red)
      .dash(5, { space: 10 })
      .stroke()

    // LINE D
    doc.moveTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 99))
      .lineTo(mmToPt((xTranslation * 99) + 99), mmToPt((yTranslation * 99) + 58))
      .lineWidth(0.5)
      .strokeColor(red)
      .dash(5, { space: 10 })
      .stroke()

    // LINE E
    doc.moveTo(mmToPt((xTranslation * 99) + 99), mmToPt((yTranslation * 99) + 58))
      .lineTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 41))
      .lineWidth(0.5)
      .strokeColor(red)
      .dash(5, { space: 10 })
      .stroke()

    // LINE F
    doc.moveTo(mmToPt((xTranslation * 99) + 58), mmToPt((yTranslation * 99) + 41))
      .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 0))
      .lineWidth(0.5)
      .strokeColor(red)
      .dash(5, { space: 10 })
      .stroke()
  }

  drawFoldLines(doc, 0, 0)
  drawFoldLines(doc, 0, 1)
  drawFoldLines(doc, 1, 0)
  drawFoldLines(doc, 1, 1)
  drawFoldLines(doc, 2, 0)
  drawFoldLines(doc, 2, 1)

  function calcTextWidth (lineNumber, topMargin = 0) {
    const textHeight = 5
    const buffer = lineNumber // used to offset the space between lines
    const slope = 34 / 44

    return 58 + buffer - ((topMargin + (0.5 * textHeight * lineNumber)) * slope)
  }

  function writeText (doc, xTranslation, yTranslation, textToWrite) {
    let topMargin

    doc.save()
    const xCoord = (xTranslation * 99) + 4
    const yCoord = (yTranslation * 99) + 41

    doc.rotate(315, { origin: [mmToPt(xCoord), mmToPt(yCoord)] })
    doc.font('Courier')

    // set to proper point
    doc.text('', mmToPt(xCoord), mmToPt(yCoord))

    // write out each line for that seed packet
    for (let lineNumber = 1; lineNumber <= textToWrite.length; lineNumber++) {
      const lineText = textToWrite[lineNumber - 1]

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

  writeText(doc, 0, 0, firstLabel)
  writeText(doc, 0, 1, firstLabel)
  writeText(doc, 1, 0, firstLabel)
  writeText(doc, 1, 1, firstLabel)
  writeText(doc, 2, 0, firstLabel)
  writeText(doc, 2, 1, firstLabel)

  doc.end()
  writeStream.on('finish', function () {
    callback(null, true)
  })
}

SPCApdf(() => {
  console.log('done')
})

module.exports = SPCApdf
