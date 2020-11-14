const PDFDocument = require('pdfkit')
const fs = require('fs')
const _ = require('lodash')

const mmToPtRatio = 595.28 / 210

const endXPt = 841.89
const endYPt = 595.28
const PACKETS_PER_PAGE = 6

/**
 * Converts millimeters to point values
 * @param  {Number} mm millimeters on the page
 * @return {Number}    The number of points which represent the mm on the PDF doc
 */
function mmToPt (mm) {
  return mm * mmToPtRatio
}

/**
 * Draws all the cutting lines for the 6 envelopes
 * @param  {Object} doc             The PDF Doc
 * @return {null}                   Doesn't return anything, the lines are drawn on the doc.
 */
function drawCutLines (doc) {
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
    .stroke()

  // right vertical cut line
  const rightVerticalLineCut = midVerticalLineCut + 99
  doc.moveTo(mmToPt(rightVerticalLineCut), 0)
    .lineTo(mmToPt(rightVerticalLineCut), endYPt)
    .lineWidth(0.5)
    .strokeColor(red)
    .stroke()
}

/**
 * Draws fole lines and fold ordering numbers (and circles) for one enveloppe
 * @param  {Object} doc             The PDF Doc
 * @param  {Number} xTranslation    The X translation (0, 1, or 2)
 * @param  {Number} yTranslation    The Y translation (0 or 1)
 * @return {null}                   Doesn't return anything, the lines are drawn on the doc.
 */
function drawFoldLines (doc, xTranslation, yTranslation) {
  const red = 'red'

  // LINE A
  doc.moveTo(mmToPt((xTranslation * 99)), mmToPt((yTranslation * 99) + 41))
    .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 0))
    .lineWidth(0.5)
    .strokeColor('lightgray')
    .dash(3, { space: 10 })
    .stroke()

  // LINE B
  doc.moveTo(mmToPt((xTranslation * 99)), mmToPt((yTranslation * 99) + 41))
    .lineTo(mmToPt((xTranslation * 99) + 41), mmToPt((yTranslation * 99) + 58))
    .lineWidth(0.5)
    .strokeColor('lightgray')
    .dash(3, { space: 10 })
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
    .strokeColor('lightgray')
    .dash(3, { space: 10 })
    .stroke()

  // Main diagonal folding line
  doc.moveTo(mmToPt(xTranslation * 99), mmToPt((yTranslation * 99) + 99))
    .lineTo(mmToPt((xTranslation * 99) + 99), mmToPt(yTranslation * 99))
    .lineWidth(0.5)
    .strokeColor('red')
    .dash(5, { space: 10 })
    .stroke()

  // Draw Circle for First Fold Line
  doc
    .circle(mmToPt((xTranslation * 99) + 85), mmToPt((yTranslation * 99) + 22), 6)
    .lineWidth(0.5)
    .undash()
    .strokeColor('green')
    .stroke()

  // Draw "1" for First Fold Line
  doc.fontSize(8)
  doc.text('1', mmToPt((xTranslation * 99) + 84), mmToPt((yTranslation * 99) + 21))

  // Draw Circle for Second Fold Line
  doc
    .circle(mmToPt((xTranslation * 99) + 70), mmToPt((yTranslation * 99) + 50), 6)
    .lineWidth(0.5)
    .undash()
    .strokeColor('green')
    .stroke()

  // Draw "2" for Second Fold Line
  doc.fontSize(8)
  doc.text('2', mmToPt((xTranslation * 99) + 69), mmToPt((yTranslation * 99) + 49))

  // Draw Circle for Third Fold Line
  doc
    .circle(mmToPt((xTranslation * 99) + 50), mmToPt((yTranslation * 99) + 70), 6)
    .lineWidth(0.5)
    .undash()
    .strokeColor('green')
    .stroke()

  // Draw "3" for Third Fold Line
  doc.fontSize(8)
  doc.text('3', mmToPt((xTranslation * 99) + 49), mmToPt((yTranslation * 99) + 69))

  // Draw Circle for Fourth Fold Line
  doc
    .circle(mmToPt((xTranslation * 99) + 82), mmToPt((yTranslation * 99) + 82), 6)
    .lineWidth(0.5)
    .undash()
    .strokeColor('green')
    .stroke()

  // Draw "4" for Fourth Fold Line
  doc.fontSize(8)
  doc.text('4', mmToPt((xTranslation * 99) + 81), mmToPt((yTranslation * 99) + 81))
}

/**
 * Draws akk the fold lines for the page (6 envelopes)
 * @param  {Object} doc             The PDF Doc
 * @return {null}                   Doesn't return anything, the lines are drawn on the doc.
 */
function drawFoldLinesForPage (doc) {
  drawFoldLines(doc, 0, 0)
  drawFoldLines(doc, 0, 1)
  drawFoldLines(doc, 1, 0)
  drawFoldLines(doc, 1, 1)
  drawFoldLines(doc, 2, 0)
  drawFoldLines(doc, 2, 1)
}

/**
 * Calculates the width of each text so that this can be fed to the text box, and
 * the text can be properly centered
 * @param  {Number} lineNumber The line number to write (1, 2, ... 8)
 * @param  {Number} topMargin  The offset from the top of the envelope (only needed for the first line)
 * @return {Number}            The width of the text box for the specific line number
 */
function calcTextWidth (lineNumber, topMargin = 0) {
  const textHeight = 5
  const buffer = (lineNumber * 1.2) // used to offset the space between lines
  const slope = 34 / 44

  return 58 + buffer - ((topMargin + (0.5 * textHeight * lineNumber)) * slope)
}

/**
 * Writes the 8 possible lines for a single enveloppe
 * @param  {Object} doc             The PDF Doc
 * @param  {Number} xTranslation    The X translation (0, 1, or 2)
 * @param  {Number} yTranslation    The Y translation (0 or 1)
 * @param  {String[]} textToWrite   An array of up to 8 strings to write
 * @return {null}                   Doesn't return anything, the text is added to the doc.
 */
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

/**
 * Adds a new page, and draws the necessary cut and fold lines
 * @param  {Object} doc             The PDF Doc
 * @return {null}                   Doesn't return anything, the page is added to the doc.
 */
function addNewPage (doc) {
  doc.addPage()
}

/**
 * draws all cut and fold lines to a page
 * @param  {Object} doc             The PDF Doc
 * @return {null}                   Doesn't return anything, the lines are added to the doc.
 */
function drawCutAndFoldLines (doc) {
  drawCutLines(doc)
  drawFoldLinesForPage(doc)
}

/**
 * Calculates the x and y position where the label should be written on the page, and
 * then writes the label.
 * The decimal packet position (0...5) is translated to one of the following coordinates:
 *                                          (0,0), (0,1), (1,0), (1,1), (2,0), (2,1)
 * @param  {Object} doc             The PDF Doc
 * @param  {Number} currentPacketPosition Number between 0 and 5, representing the position on the page
 * @param  {String[]} textToWrite   An array of up to 8 strings to write
 * @return {null}                   Doesn't return anything, the text is added to the doc.
 */
function writeOneLabel (doc, currentPacketPosition, label) {
  const binaryPosition = ('00' + currentPacketPosition.toString(2)).slice(-3)
  const xBinaryPosition = binaryPosition.substring(0, 2)
  const xInt = parseInt(xBinaryPosition, 2)

  const yBinaryPosition = binaryPosition.substring(2, 3)
  const yInt = parseInt(yBinaryPosition, 2)
  writeText(doc, xInt, yInt, label)
}

/**
 * Main entry point. Accepts the user's payload, and a callback to call once the PDF has been created
 * @param  {Object}   payload  Client payload, of the form:
 *                             {
 *                               packets: [
 *                                 {
 *                                   count: 1,
 *                                   label: [
 *                                     'LINE 1',
 *                                     'LINE 2',
 *                                     'LINE 3',
 *                                     'LINE 4',
 *                                     'LINE 5',
 *                                     'LINE 6',
 *                                     'LINE 7',
 *                                     'LINE 8'
 *                                   ]
 *                                 },
 *                                 {
 *                                   count: 5,
 *                                   label: [
 *                                     'Other 1',
 *                                     'Other 2',
 *                                     'Other 3',
 *                                     'Other 4',
 *                                     'Other 5',
 *                                     'Other 6',
 *                                     'Other 7',
 *                                     'Other 8'
 *                                   ]
 *                                 }
 *                               ]
 *                             }
 * @param  {Function} callback A callback to call once we're done
 * @return {null}              Nothing, a PDF is saved locally to disk
 */
function generateSeedEnvelopes (payload, callback) {
  const doc = new PDFDocument({
    layout: 'landscape',
    size: 'A4'
  })

  const writeStream = fs.createWriteStream('someid' + '.pdf')
  // Pipe it's output somewhere, like to a file or HTTP response
  // See below for browser usage
  doc.pipe(writeStream)

  drawCutAndFoldLines(doc)

  const seedPackets = payload.packets

  seedPackets.reduce((prev, packetConfig) => {
    let seedPacketsToWrite = packetConfig.count

    while (seedPacketsToWrite > 0) {
      const params = {
        currentPagePacketCount: prev.currentPagePacketCount,
        seedPacketsToWrite,
        currentPacketPosition: prev.currentPacketPosition
      }

      prev = drawPacketsOnCurrentPage(doc, params, packetConfig)
      seedPacketsToWrite = prev.seedPacketsToWrite

      if (prev.currentPacketPosition >= 6) {
        addNewPage(doc)
        drawCutAndFoldLines(doc)
        prev.currentPagePacketCount = 0
        prev.currentPacketPosition = 0
      }
    }

    return prev
  }, {
    currentPagePacketCount: 0,
    currentPageCount: 1,
    currentPacketPosition: 0
  })

  doc.end()
  writeStream.on('finish', function () {
    callback(null, true)
  })
}

/**
 * Draws the label of one packet onto a page.
 * If you attempt to draw more packets then there is space available on the current page,
 * the the returned params will indicate (via seedPacketsToWrite, and currentPagePacketCount) that the page is
 * complete, but that there are leftover packets of this kind to write.
 * A new page should be added to the doc (in another function), and this function should be called again to finish writing
 * the necessary packets
 * @param  {Object} doc             The PDF Doc
 * @param  {[type]} params          Page configuration of the form:
 *                                       {
 *                                         currentPagePacketCount,  // Number of packets that are already assigned to this page
 *                                         seedPacketsToWrite,      // Initially, for each packet, it is the count of identical seed packets to print. Then, if there are leftover after a new page is created, the leftover is represented here
 *                                         currentPacketPosition    // The current packet position on the page, represented as a number between 0 and 5
 *                                       }
 * @param  {Object} packetConfig    The packet config from the user, of the form:
 *                                    {
 *                                      count: 3 // number,
 *                                      label: [ 'some', 'strings', 'here' ]
 *                                    }
 * @return {Object}                   An updated version of the params that were passed to the function, of the form:
 *                                       {
 *                                         currentPagePacketCount,  // Number of packets that are already assigned to this page
 *                                         seedPacketsToWrite,      // Initially, for each packet, it is the count of identical seed packets to print. Then, if there are leftover after a new page is created, the leftover is represented here
 *                                         currentPacketPosition    // The current packet position on the page, represented as a number between 0 and 5
 *                                       }
 */
function drawPacketsOnCurrentPage (doc, params, packetConfig) {
  const result = _.cloneDeep(params)

  // how much space is available on this page?
  const packetCountAvailableOnCurrentPage = Math.max((PACKETS_PER_PAGE - params.currentPagePacketCount), 0)

  // how many packets should we write to the page (minimum between space available, or total packets of this type left to print)
  const packetsToWriteOnCurrentPage = Math.min(params.seedPacketsToWrite, packetCountAvailableOnCurrentPage)

  // once we're done this iteration, how many remaining packets of this type are left to print?
  const remainingPacketsToWrite = params.seedPacketsToWrite - packetsToWriteOnCurrentPage

  // if we have packets to write on this page, and there's still some space left on the page
  if (packetsToWriteOnCurrentPage > 0 && packetCountAvailableOnCurrentPage > 0) {
    for (let i = 0; i < packetsToWriteOnCurrentPage; i++) {
      writeOneLabel(doc, result.currentPacketPosition, packetConfig.label)
      result.currentPacketPosition = result.currentPacketPosition + 1
    }
  }

  result.seedPacketsToWrite = remainingPacketsToWrite
  result.currentPagePacketCount = params.currentPagePacketCount + packetsToWriteOnCurrentPage

  return result
}

const payload = {
  packets: [
    {
      count: 1,
      label: [
        'LINE 1',
        'LINE 2',
        'LINE 3',
        'LINE 4',
        'LINE 5',
        'LINE 6',
        'LINE 7',
        'LINE 8'
      ]
    },
    {
      count: 5,
      label: [
        'TOTOTO 1',
        'TOTOTO 2',
        'TOTOTO 3',
        'TOTOTO 4',
        'TOTOTO 5',
        'TOTOTO 6',
        'TOTOTO 7',
        'TOTOTO 8'
      ]
    },
    {
      count: 0,
      label: [
        '888888 1',
        '888888 2',
        '888888 3',
        '888888 4',
        '888888 5',
        '888888 6',
        '888888 7',
        '888888 8'
      ]
    },
    {
      count: 4,
      label: [
        '****** 1',
        '****** 2',
        '****** 3',
        '****** 4',
        '****** 5',
        '****** 6',
        '****** 7',
        '****** 8'
      ]
    }
  ]
}

generateSeedEnvelopes(payload, () => {
  console.log('done')
})

module.exports = generateSeedEnvelopes
