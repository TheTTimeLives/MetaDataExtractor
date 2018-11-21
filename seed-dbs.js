
//How do you test a route?

//Two conventions of writing your import of the node package. ES6 and later vs ES5 old shit

//You should be able to do it as below but Node doesn't support ES6 imports STILL and you have to do some whacky babel stuff to get it to work
// import 'express' as 'express'
const fs = require('fs')
const recursive = require("recursive-readdir");
const db = require('./models')
const xml2js = require('xml2js')
const { parseString } = xml2js
const { stripPrefix } = xml2js.processors
const util = require('util');
const parseStringP = util.promisify(parseString);


db.Subject.associate = function (models) {
  Subject.belongsTo(models.Book)
}

db.Book.associate = function (models) {
  Book.hasMany(models.Subject, {as: 'Subjects'})
}


db.sequelize.sync().then(() => console.log('SYNC RAN'))

async function init () {
  // Setup DB

  parseFiles()
}


async function parseFiles() {
  try {
    console.log('Fetching file paths')
    var filePaths = await recursive("../rdf-files/cache/epub/")
  }
  catch (err) {
    console.log(`Could not read files: ${err}`)
    process.exit(1)
  }

  // forEach loop through each path
  // fs.stat on each one


  // TODO: replace for each with a map
  filePaths.slice(0, 500).forEach(async (filePath, index) => {
    const fileContents = fs.readFileSync(filePath)

    try {
      var result = await parseStringP(fileContents, { tagNameProcessors: [stripPrefix] })

    } catch (err) {
      console.log(`Could not read parsed file contents: ${err}`)
      process.exit(1)
    }


    const {ebook} = result.RDF

    if (!ebook[0].issued || ebook[0].issued[0] === 'None') {
      console.log('Skipping catalog')
      return
    }

    let author = 'unknown'

    if (ebook[0].creator) {
      author = ebook[0].creator[0].agent[0].name[0]
    }

    // function getKey(object, path, fallback) {

    // }

    // author: getKey(ebook, ['creator', 'agent', 'name'], 'unknown')
    // fs.writeFileSync(`./data/${index}.json`, JSON.stringify(result.RDF, null, 2))

    try {
      var title = ebook[0].title[0]
    } catch (error) {
      console.log('bad title', JSON.stringify(ebook, null, 2))
    }

    const subjectTitles = (ebook[0].subject || []).map(subject => subject.Description[0].value[0])

    const parsed = {
      bookID: ebook[0].$['rdf:about'].slice(7),
      title: ebook[0].title[0],
      author, //I believe these names can have multiples so we may need to design our models accordingly,
      publisher: 'Project Gutenberg',
      pubDate: ebook[0].issued[0]._, //this is definitely wrong lol
      language: ebook[0].language[0].Description[0].value[0]._,
      //subjectTitles, //the array of subjects,
      rights: ebook[0].rights[0] //is there an array of rights types?,
    }

    console.log('BOOKa',ebook[0].$['rdf:about'].slice(7))
    console.log('BOOKb',ebook[0].$['rdf:about'])
    console.log('BOOKb',ebook[0].$)



    const book = await db.Book.create({
      bookId: ebook[0].$['rdf:about'].slice(7),
      title: ebook[0].title[0],
      author, //I believe these names can have multiples so we may need to design our models accordingly,
      publisher: 'Project Gutenberg',
      publicationDate: ebook[0].issued[0]._,
      language: ebook[0].language[0].Description[0].value[0]._,
      licenseRights: ebook[0].rights[0] //is there an array of rights types?,
    })

    //FOR WHATEVER REASON I CAN ONLY PUSH ID 1, 10, 100 AND 1000

    //This database A. Only sends the above figures, B. Doesn't update them reliably and C. Doesn't even send all of the stuff all of the time. Alot of that is one the errors below probs.

    //Also I can't read that title in forEach

    subjectTitles.forEach(async title => {
      const subject = await db.Subject.create({
        title, 
        name: ebook[0].title[0],
      }) 

      //For some reason, this update does not work for id's larger than 10 (this stuff is so confusing)

      const update = await db.Subject.update({
        BookId:ebook[0].$['rdf:about'].slice(7),
      }, {
          where: {
            name: ebook[0].title[0],
          }
        })

      //The magic method way of doing it is the better way, but it's not working so we can just update manually
      // subject.setSubject(ebook[0].$['rdf:about'].slice(7))
    })

//    fs.writeFileSync(`./data/${index}-parsed.json`, JSON.stringify(parsed, null, 2))



  });

}

parseFiles()


// app.use(bp.json());
// app.use(bp.urlencoded({ extended: false }));

// require('./controller/routes')(app)

// db.sequelize.sync().then(function() {
//   app.listen(3000, () => { console.log('Your app is running') });
// });

