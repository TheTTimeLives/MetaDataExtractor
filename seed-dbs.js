const fs = require('fs')
const recursive = require("recursive-readdir");
const db = require('./models')
const xml2js = require('xml2js')
const { parseString } = xml2js
const { stripPrefix } = xml2js.processors
const util = require('util');
const parseStringP = util.promisify(parseString);
const mongoose = require("mongoose");

console.log('DB',db)

//Using async to write awaitable functions
async function parseFiles() {

  //Error handling for grabbing our recursive files. This package supports promises natively so we didn't need to use promisify to convert it.
  try {
    console.log('Fetching file paths')
    var filePaths = await recursive("../rdf-files/cache/epub/")
  }
  catch (err) {
    console.log(`Could not read files: ${err}`)
    process.exit(1)
  }

  // Runs an array forEach method on every filePath returned from the readdir. Uses slice for testing purposes. Using async to write awaitable functions.
  filePaths.slice(0, 5).forEach(async (filePath, index) => {

    //Read a file and assign it's contents to fileContents
    const fileContents = fs.readFileSync(filePath)

    //Parse fileContents, which is XML, into an object
    try {
      var result = await parseStringP(fileContents, { tagNameProcessors: [stripPrefix] })
    } catch (err) {
      console.log(`Could not read parsed file contents: ${err}`)
      process.exit(1)
    }




    //Some handling for inconsistences between different keys when we push to MongoDB
    const {ebook} = result.RDF

    if (!ebook[0].issued || ebook[0].issued[0] === 'None') {
      console.log('Skipping catalog')
      return
    }

    let author = 'unknown'

    if (ebook[0].creator) {
      author = ebook[0].creator[0].agent[0].name[0]
    }

    try {
      var title = ebook[0].title[0]
    } catch (error) {
      console.log('bad title', JSON.stringify(ebook, null, 2))
    }

    const subjectTitles = (ebook[0].subject || []).map(subject => subject.Description[0].value[0])




    const book = await db.Book.create({
      bookId: ebook[0].$['rdf:about'].slice(7),
      title: ebook[0].title[0],
      author, //I believe these names can have multiples so we may need to design our models accordingly,
      publisher: 'Project Gutenberg',
      publicationDate: ebook[0].issued[0]._,
      language: ebook[0].language[0].Description[0].value[0]._,
      licenseRights: ebook[0].rights[0], //is there an array of rights types?,
      titles: subjectTitles
    })

  });

}

//Run our function (will probably make an export)
parseFiles()

//To be connected to a mongoDB called library
mongoose.connect("mongodb://localhost/library");

